import { h, Component } from 'preact';
import { Router } from 'preact-router';
import Sockette from 'sockette';
import hot from 'hot-ranking';
import Main from './pages/main';
import Wall from './pages/wall';
import Page from './pages/page';
import Settings from './pages/settings';
import Discover from './pages/discover';

const {
	isSignInPending, isUserSignedIn, redirectToSignIn, 
	handlePendingSignIn, signUserOut, loadUserData, 
	lookupProfile, Person, 
	getFile, putFile
} = window.blockstack;

export default class App extends Component {
	constructor(props) {
		super(props)
		this.state = {
			ws:null,
			wsConnected: false,
			user: null,
			suggested: [
				'Blockstack', 'Fupio', 'Blockchain',
				'Movies', 'Geek', 'Technology',
				'Science', 'Nature','Food', 'Drink', 'Books',
				'Gardening',  'Illustrations', 'Posters', 'Products', 
				'Travel', 'Photography', 'Design', 'Music', 'DIY', 'Crafts', 
				'Tattoos', 'Education'
			],
			address: window.location.origin.replace("https", "http"),
			userSettings: {tags: []},
			profileLoaded: false,
			isLoading: false,
			pubSubInit: false,
			initialWallLoad: false,
			feedListFileName: 'fupio-feeds-ai.json',
			feeds: {},
			profiles: {},
			tagCount: 7,
			updateMainState: this.updateMainState.bind(this),
			followTag: this.followTag.bind(this),
			unFollowTag: this.unFollowTag.bind(this),
			handleSignIn: this.handleSignIn.bind(this),
			handleSignOut: this.handleSignOut.bind(this)
		}
	};
	componentWillMount() {
		if (isSignInPending()) {
		  handlePendingSignIn().then((userData) => {
			window.location = window.location.origin;
		  });
		}
	};
	updateMainState(object_to_set){
		this.setState(object_to_set)
	};
	handleSignIn(e) {
		e.preventDefault();
		const origin = window.location.origin
		redirectToSignIn(origin, origin + '/manifest.json', ['store_write', 'publish_data'])
	};
	handleSignOut(e) {
		e.preventDefault();
		signUserOut(window.location.origin);
		this.setState({user: null, userSettings: null})
	};
	componentDidUpdate() {
		
		// if user logged in but profile not loaded
		if (this.state.user && this.state.profileLoaded == false && this.state.isLoading == false){
			
			this.loadProfile();

		}
		// if profile loaded but WS not connected
		if (isUserSignedIn() && !this.state.ws && this.state.profileLoaded == true && this.state.isLoading == false){
			if (window.location.origin.includes("localhost")) {
				this.initConnection("ws://127.0.0.1:38746");
			} else {
				this.initConnection();
			}
		}
		// init ws pub/sub
		if (this.state.profileLoaded && this.state.wsConnected && !this.state.pubSubInit){
			
			this.setState({pubSubInit: true});
			this.state.ws.json({type: 'init_pub_sub', data: {'tags': this.state.userSettings.tags}});

		}
	};
	unique = x => [...new Set(x)];
	initConnection = (orion="ws://orion8.fupio.com:38746", v="1") => {
		const url = `${orion}?v=${v}&token=${this.state.user.authResponseToken}`;
		const wsConnection = new Sockette(url, {
		  timeout: 5e3,
		  maxAttempts: 10,
		  onopen: e => this.setState({wsConnected: true}),
		  onmessage: e => this.handleWebSocket(e),
		  onreconnect: e => this.setState({wsConnected: true}),
		  onmaximum: e => this.setState({ws: null, wsConnected: false}),
		  onclose: e => this.setState({ws: null, wsConnected: false}),
		  onerror: e => console.log('Error:', e)
		});
		this.setState({ws: wsConnection});
	};
	handleWebSocket = (e) => {
		const message = JSON.parse(e.data || '{}');
		switch (message.type) {
			case "feed_load_promise": {
				this.loadFeedPromise(message.data);
				break;
			}
			case "comment_load_promise": {
				this.loadCommentPromise(message.data);
				break;
			}
		}
	};
	loadFeedPromise = (feedRaw) => {
		const feeds = this.state.feeds;
		const newRank = hot(0, 0, new Date(feedRaw.updated));
		const feed = {resolved: false, rank: newRank, ...feedRaw};
		
		if (`${feed.created}-${feed.identity}` in feeds && 
			feeds[`${feed.created}-${feed.identity}`].resolved &&
			feedRaw.updated <= feeds[`${feed.created}-${feed.identity}`].updated) {
			console.log("r5857 returned false")
			return false
		}
		
		
		feeds[`${feed.created}-${feed.identity}`] = feed;
		this.setState({feeds: feeds});

		const feedSlug = `${feed.created}-${feed.identity}`;
		this.state.ws.json({ type: 'follow_tag', data: {'name': feedSlug}});

		const options = {username: feed.username, app: this.state.address, decrypt: false};
		const feedFile = `${feed.created}-${feed.identity}.json`;
		getFile(feedFile, options).then((file) => {
				if(file){
					const feedContent = JSON.parse(file)
					// clone the feeds
					let feedsSnapShot = this.state.feeds;
					let newFeed = feedsSnapShot[`${feed.created}-${feed.identity}`];
					
					// get the user photo
					if (!(feed.username in this.state.profiles) 
					//|| profiles[feed.username] !== "pending"
					) {
						const {profiles} = this.state;
						// set pending
						// profiles[feed.username] = "pending";
						// this.setState({profiles: profiles});
						// load the image
						lookupProfile(feed.username)
							.then(profile => {
								profiles[feed.username] = profile;
								this.setState({profiles: profiles});
								const person = new Person(profile);
								newFeed.avatar = person.avatarUrl();
							})
					} else {
						const person = new Person(this.state.profiles[feed.username]);
						newFeed.avatar = person.avatarUrl();
					}
					// update the data
					if (newFeed) {
						newFeed.resolved = true;
						newFeed.username = feedContent.username;
						newFeed.text = feedContent.text;
						newFeed.image = feedContent.image;
						newFeed.likes = feedContent.likes;
						newFeed.rating = feedContent.rating;
						// replace feeds
						feedsSnapShot[`${feed.created}-${feed.identity}`] = newFeed;
						this.setState({feeds: feedsSnapShot})
					}
				}
		})

		const feedKey = `${feed.created}-${feed.identity}`;
		this.state.ws.json({ type: 'follow_tag', data: {'name': feedKey}});

	};
	loadCommentPromise = (comment) => {
		const feedsSnapshot = this.state.feeds;
		if (comment.feedId in feedsSnapshot){
			if (!feedsSnapshot[comment.feedId].comments){
				feedsSnapshot[comment.feedId].comments = []
			}
			feedsSnapshot[comment.feedId].comments.push(comment);
			this.setState({feeds: feedsSnapshot})
		}
	}
	loadProfile = () => {
		this.setState({ isLoading: true })
		const options = { decrypt: true }
		getFile(`${this.state.user.identityAddress}-profile.json`, options)
			.then((file) => {
				const userSettings = JSON.parse(file || '{}')
				if(userSettings.tags){
					const newUserSettings = this.state.userSettings;
					newUserSettings.tags = this.unique(userSettings.tags);
					this.setState({userSettings: newUserSettings})
				} else {
					const blankSettings = {tags: [this.state.user.identityAddress], feeds: []};
					putFile(`${this.state.user.identityAddress}-profile.json`, JSON.stringify(blankSettings), options)
				}
				this.setState({ isLoading: false, profileLoaded: true})
			})
			.catch(() => {
				this.setState({ internetConnection: false})
			})
	};
	followTag = (tagRaw) => {
		const tag = tagRaw.toLowerCase();
		const newUserSettings = this.state.userSettings;
		if(!newUserSettings.tags.includes(tag)){
			const newUserSettings = this.state.userSettings;
			newUserSettings.tags.push(tag.toLowerCase());
			newUserSettings.tags = this.unique(newUserSettings.tags);
			this.setState({userSettings: newUserSettings});
			putFile(`${this.state.user.identityAddress}-profile.json`, JSON.stringify(newUserSettings), { encrypt: true })
			this.state.ws.json({ type: 'follow_tag', data: {'name': tag}});
		}
	};
	unFollowTag = (tagRaw) => {
		const tag = tagRaw.toLowerCase();
		const newUserSettings = this.state.userSettings;
		if(newUserSettings.tags.includes(tag)){
			const newUserSettings = this.state.userSettings;
			newUserSettings.tags = this.unique(newUserSettings.tags);
			// remove string from array
			newUserSettings.tags = newUserSettings.tags.filter(e => e !== tag.toLowerCase());
			this.setState({userSettings: newUserSettings});
			putFile(`${this.state.user.identityAddress}-profile.json`, JSON.stringify(newUserSettings), { encrypt: true })
			this.state.ws.json({ type: 'unfollow_tag', data: {'name': tag}});
		}
	};
	handleRoute = e => {
		this.currentUrl = e.url;
	};
	render() {
		if(isUserSignedIn() && this.state.user == null){
			const userData = loadUserData()
			this.setState({user: userData})
		}
		return (
				<Router onChange={this.handleRoute}>
					<Main path="/" {...this.state} />
					<Wall path="/:feed_slug" {...this.state} />
					<Page path="/page/:page_slug" {...this.state} />
					<Settings path="/user/settings" {...this.state} feeds={null} />
					<Discover path="/user/discover" {...this.state} feeds={null} />
				</Router>
		);
	};
}
