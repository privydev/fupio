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
			slug: decodeURIComponent(window.location.pathname).slice(1).trim().toLocaleLowerCase()
		}
	}
	componentDidUpdate(){
		if( this.props.wsConnected && this.props.ws && this.props.userSettings.tags.length > this.props.tagCount && 
			this.props.profileLoaded && !this.props.initialWallLoad){
				this.loadWall();
		}
	}
	loadWall = () => {
		let tags = [ this.state.slug ];
		if (window.location.pathname.length <= 1) {
			tags = this.props.userSettings.tags
		}
		this.props.updateMainState({ feeds: {}, initialWallLoad: true });
		this.props.ws.json({type: 'load_feeds', data: {'tags': tags}});
		this.setState({wallLoad: true})
	}
	render({userSettings, isLoading, tagCount, user, profileLoaded, wsConnected}) {
 		return (
			<div>
				<Header {...this.props} />
				
				<div class="container">
					<div class="wall" style={`min-height: ${(window.innerHeight)/7*5}px;`}>
						{isLoading && <div id="loaderBox"><Loading /></div>}
						
						{userSettings.tags.length <= tagCount && profileLoaded &&
							<div>
								<h3>Follow at least <strong>7</strong> tags which you interests.</h3>
								<Onboarding {...this.props} />
							</div>
						}

						{user && user.username && wsConnected && window.location.pathname.length > 1 && 
							<tags class="text-center">
								<TagButton tag={this.state.slug} {...this.props} />
							</tags>
						}
						
						{user && user.username && wsConnected && userSettings.tags.length > tagCount && 
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
						
						{Object.values(this.props.feeds).sort((f1, f2) => f2.rank - f1.rank).map(
							feed => <Feed {...feed} {...this.props} />
						) }

						{Object.keys(this.props.feeds).length == 0 && 
							<div class="feed text-center" style="min-height: 0.2em;font-size:0.8em">
								<content>
									Seems like this no one created a feed with this tag yet.
								</content>
							</div>
						}
					</div>
					<Footer {...this.props} />
				</div>
			</div>
		);
	}
}
