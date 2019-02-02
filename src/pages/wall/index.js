import { h, Component } from 'preact';

import Header from '../../components/header';
import Feed from '../../components/feed';
import CreateFeed from '../../components/createFeed';
import Footer from '../../components/footer';
import Onboarding from '../../components/onboarding';
import Loading from '../../components/loading';
import TagButton from '../../components/tagButton';

export default class Wall extends Component {
    constructor(props) {
		super(props);
		this.state = {
			init: null,
			slug: decodeURIComponent(window.location.pathname).slice(1).trim().toLocaleLowerCase()
		}
	}
	componentDidMount(){
		this.setState({init: false});
	}
	componentDidUpdate(){
		if( this.props.wsConnected && this.props.ws && this.props.userSettings.tags.length > this.props.tagCount && 
			this.props.profileLoaded && !this.state.init){
				this.setState({init: true});
				this.loadWall();
		}
	}
	loadWall = () => {
		let tags = [ this.state.slug ];
		// if it is the homepage
		if (window.location.pathname.length <= 1) {
			tags = this.props.userSettings.tags
		}
		this.props.updateMainState({ feeds: [] });
		this.props.ws.json({type: 'load_feeds', data: {'tags': tags, 'page': this.props.page || 0}});
	}
	render({userSettings, isLoading, tagCount, user, profileLoaded, wsConnected, feeds}) {
 		return (
			<div>
				<Header {...this.props} />
				<div class="container">
					<div class="wall" style={`min-height: ${(window.innerHeight)/7*5}px;`}>
						{isLoading && <div id="loaderBox"><Loading /></div>}
						{userSettings && userSettings.tags && userSettings.tags.length <= tagCount && profileLoaded &&
							<div>
								<h3>Follow at least <strong>7</strong> tags which you interests.</h3>
								<Onboarding {...this.props} />
							</div>
						}
						{user && user.username && wsConnected && window.location.pathname.length > 1 && 
							<div class="text-center" style="margin-bottom: 1em">
								<TagButton {...this.props} tag={this.state.slug} />
							</div>
						}
						{user && user.username && userSettings && userSettings.tags && userSettings.tags.length > tagCount && 
							<CreateFeed {...this.props} />
						}
						{user && !user.username && 
							<div class="feed text-center" style="min-height: 0.2em;font-size:0.8em">
								<content>
									You're in the <strong>restrict</strong> mode. 
									Because you don't have any 
									<strong> <a target="_blank" href="http://localhost:8888/profiles/i/all">Blockstack ID</a></strong>. 
									You can <strong>follow</strong> the tags, but unfortunately you <strong>can't </strong>
									create feeds or reply for now. 
									You can get an ID <strong><a target="_blank" href="http://localhost:8888/profiles/i/all">here</a></strong> if you wish.
								</content>
							</div>
						}
						{feeds.map(
							feed => <Feed {...feed} {...this.props} />
						)}
						<div class="row" style="margin-top: 2em">
							{this.props.page && parseInt(this.props.page) > 0 &&
								<div class="col text-left">
									<a class="button" href={`?page=${(parseInt(this.props.page) || 0)-1}`}>
										<span class="icon icon-left-open"></span> previous
									</a>
								</div>
							}
							{feeds.length > 3 && 
								<div class="col text-right">
									<a class="button" href={`?page=${(parseInt(this.props.page) || 0)+1}`}>
										<span class="icon icon-right-open"></span> next
									</a>
								</div>
							}
						</div>
					</div>
					<Footer {...this.props} />
				</div>
			</div>
		);
	}
}
