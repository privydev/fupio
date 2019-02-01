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

import './style';

export default class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			ws: null,
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
			address: window.location.origin,
			userSettings: { tags: ['fupio'] },
			profileLoaded: false,
			isLoading: false,
			pubSubInit: false,
			feedListFileName: 'fupio-feeds-ai.json',
			feeds: [],
			profiles: {},
			tagCount: 7,
			updateMainState: this.updateMainState.bind(this),
			// getFeed: this.getFeed.bind(this),
			// updateFeed: this.updateFeed.bind(this),
			followTag: this.followTag.bind(this),
			unFollowTag: this.unFollowTag.bind(this),
			handleSignIn: this.handleSignIn.bind(this),
			handleSignOut: this.handleSignOut.bind(this)
		};
	}
	componentWillMount() {
		if (isSignInPending()) {
		  handlePendingSignIn().then((userData) => {
				window.location = window.location.origin;
		  });
		}
	}
	updateMainState(object_to_set) {
		this.setState(object_to_set);
	}
	handleSignIn(e) {
		e.preventDefault();
		const origin = window.location.origin;
		redirectToSignIn(origin, origin + '/manifest.json', ['store_write', 'publish_data']);
	}
	handleSignOut(e) {
		e.preventDefault();
		signUserOut(window.location.origin);
		this.setState({ user: null, userSettings: null });
	}
	componentDidUpdate() {
		// if user logged in but profile not loaded
		if (this.state.user && this.state.profileLoaded == false && this.state.isLoading == false) {
			setTimeout(this.loadProfile(), 100);
		}
		// if profile loaded but WS not connected
		else if (isUserSignedIn() && !this.state.ws && this.state.profileLoaded == true && this.state.isLoading == false) {
			if (window.location.origin.includes('localhost')) {
				setTimeout(this.initConnection("ws://localhost:5000"), 200);
			}
			else {
				setTimeout(this.initConnection(), 200);
			}
		}
		
		// init ws pub/sub
		else if (this.state.profileLoaded && this.state.wsConnected && !this.state.pubSubInit) {
			this.setState({ pubSubInit: true });
			this.state.ws.json({ type: 'init_pub_sub', data: { tags: this.state.userSettings.tags } });
		}
	}
	unique = x => [...new Set(x)];
	initConnection = (orion='wss://orion8.herokuapp.com', v='1') => {
		const url = `${orion}?v=${v}&token=${this.state.user.authResponseToken}`;
		const wsConnection = new Sockette(url, {
		  timeout: 7e3,
		  maxAttempts: 10,
		  onopen: e => this.setState({ wsConnected: true }),
		  onmessage: e => this.handleWebSocket(e),
		  onreconnect: e => this.setState({ wsConnected: true }),
		  onmaximum: e => this.setState({ ws: null, wsConnected: false }),
		  onclose: e => this.setState({ ws: null, wsConnected: false }),
		  onerror: e => console.log('Something Wrong With the Connection. Error: ', e)
		});
		this.setState({ ws: wsConnection });
	};
	handleWebSocket = (e) => {
		const message = JSON.parse(e.data || '{}');
		switch (message.type) {
			case 'feed_load_promise': {
				this.loadFeedPromise(message.data);
				this.loadProfilePromise(message.data.username);
				break;
			}
			case 'comment_load_promise': {
				this.loadCommentPromise(message.data);
				break;
			}
			case 'tag_suggestion': {
				const tag = message.data.toLowerCase();
				const { suggested } = this.state;
				suggested.unshift(tag);
				this.setState({ suggested: this.unique(suggested) });
				break;
			}
			case 'sort_wall': {
				this.sortFeedsByRank();
				break;
			}
		}
		console.log("get -> ", message)
	};
	loadProfilePromise = (username) => {
		// get the user photo
		let { profiles } = this.state;
		if (profiles && !(username in profiles)) {
			profiles[username] = 'pending';
			this.setState({ profiles });
			// load the image
			lookupProfile(username)
				.then(profile => {
					const person = new Person(profile);
					profiles[username] = { avatar: person.avatarUrl() };
					this.setState({ profiles });
				});
		}
	}
	getFeed = (created, identity) => {
		for (let feed of this.state.feeds) {
			if (parseInt(created) == parseInt(feed.created) && identity == feed.identity) {
				return feed;
			}
		}
		return false;
	}
	updateFeed = (created, identity, data) => {
		let feedSnapshot = this.state.feeds;
		feedSnapshot.map((feed, i) => {
			if (created == feed.created && identity == feed.identity) {
				feedSnapshot[i] = data;
				this.setState({ feeds: feedSnapshot });
			}
		});
	}
	loadFeedPromise = (feedRaw) => {
		console.log("debug: load feed from gaia", feedRaw)
		const newRank = hot(0, 0, new Date(feedRaw.created));
		const feed = { resolved: false, rank: newRank, ...feedRaw };
		// feed yoksa ekle.
		if (this.getFeed(feed.created, feed.identity) == false) {
			this.state.feeds.unshift(feed);
			this.setState({ feeds: this.state.feeds });
			const feedSlug = `${feed.created}-${feed.identity}`;
			this.state.ws.json({ type: 'follow_tag', data: { name: feedSlug } });
			const options = { username: feed.username, app: this.state.address, decrypt: false };
			const feedFile = `${feed.created}-${feed.identity}.json`;
			getFile(feedFile, options).then((file) => {
				if (file) {
					const feedContent = JSON.parse(file);
					let newFeed = this.getFeed(feed.created, feed.identity);
					if (newFeed) {
						newFeed.resolved = true;
						newFeed.username = feedContent.username;
						newFeed.text = feedContent.text;
						newFeed.image = feedContent.image;
						newFeed.likes = feedContent.likes;
						newFeed.rating = feedContent.rating;
						this.updateFeed(feed.created, feed.identity, newFeed);
					}
				}
			});
		}
	}
	parseID = (key) => {
		const dump = key.split('-');
		return { created: dump[0], identity: dump[1], commentCreated: dump[2] };
	}
	loadCommentPromise = (comment) => {
		const { created, identity } = this.parseID(comment.feedId);
		const feed = this.getFeed(created, identity);
		if (feed) {
			if (!feed.comments) {
				feed.comments = [];
			}
			feed.comments.push(comment);
			// re-calculate the rank if the created bigger
			if (comment.created > feed.created) {
				feed.created = comment.created;
				feed.rank = hot(0, 0, new Date(feed.created));
			}
			this.updateFeed(created, identity, feed);
			if (this.state.user.identityAddress !== comment.identity) {
				this.sortFeedsByRank();
			}
		}
	}
	loadProfile = () => {
		// this.setState({ isLoading: true });
		const options = { decrypt: true };
		getFile(`${this.state.user.identityAddress}-profile.json`, options)
			.then((file) => {
				const userSettings = JSON.parse(file || '{}');
				if (userSettings.tags) {
					// const newUserSettings = this.state.userSettings;
					// newUserSettings.tags = this.unique(userSettings.tags.map(t => typeof t === 'string' && t.toLowerCase()));
					this.setState({ userSettings: userSettings });
				}
				else {
					const blankSettings = { tags: [this.state.user.identityAddress], feeds: [] };
					putFile(`${this.state.user.identityAddress}-profile.json`, JSON.stringify(blankSettings), options);
					this.setState({ userSettings: userSettings });
				}
				this.setState({ isLoading: false, profileLoaded: true });
			})
			.catch((e) => {
				this.setState({ internetConnection: false });
				console.log(e);
			});
	};
	followTag = (tagRaw) => {
		if(tagRaw) {
			const tag = tagRaw.toLowerCase();
			const newUserSettings = this.state.userSettings;
			// newUserSettings.tags = newUserSettings.tags && this.unique(newUserSettings.tags);
			if (!newUserSettings.tags.includes(tag)) {
				newUserSettings.tags.unshift(tag);
				this.state.ws.json({ type: 'follow_tag', data: { name: tag } });
			}
			this.setState({ userSettings: newUserSettings });
			putFile(`${this.state.user.identityAddress}-profile.json`, JSON.stringify(newUserSettings), { encrypt: true });
		}
	};
	unFollowTag = (tagRaw) => {
		const tag = tagRaw.toLowerCase();
		const newUserSettings = this.state.userSettings;
		console.log("newUserSettings", newUserSettings)
		//newUserSettings.tags = this.unique(newUserSettings.tags.map(tag));
		//console.log("newUserSettings.tags", newUserSettings.tags)
		if (newUserSettings.tags.includes(tag)) {
			// remove string from array
			newUserSettings.tags = newUserSettings.tags.filter(e => e !== tag);
			this.state.ws.json({ type: 'unfollow_tag', data: { name: tag } });
		}
		else{
			console.error('there is no tag for unfollow: ', tag, newUserSettings.tags)
		}
		this.setState({ userSettings: newUserSettings });
		putFile(`${this.state.user.identityAddress}-profile.json`, JSON.stringify(newUserSettings), { encrypt: true });
		
	};
	sortFeedsByRank = () => {
		let { feeds } = this.state;
		feeds.sort( (a, b) => b.rank - a.rank );
		this.setState({ feeds });
	}
	handleRoute = e => {
		this.currentUrl = e.url;
	};
	render() {
		if (isUserSignedIn() && this.state.user == null) {
			const userData = loadUserData();
			this.setState({ user: userData });
		}
		return (
			<Router onChange={this.handleRoute}>
				<Main path="/" {...this.state} />
				<Wall path="/:feed_slug" {...this.state} />
				<Discover path="/user/discover" {...this.state} />
				<Settings path="/user/settings" {...this.state} feeds={null} />
				<Page path="/page/:page_slug" {...this.state} feeds={null} />
			</Router>
		);
	}
}