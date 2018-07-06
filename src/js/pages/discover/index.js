import { h, Component } from 'preact';

import Header from '../../components/header';
import Footer from '../../components/footer';
import Onboarding from '../../components/onboarding';
import Feed from '../../components/feed';

export default class Default extends Component {
    constructor(props) {
		super(props);
		this.state = {
			feedListLoaded: false
		}
	}
	componentDidUpdate(){
		if( this.props.wsConnected && this.props.ws && this.props.userSettings.tags.length > this.props.tagCount && 
			this.props.profileLoaded && !this.state.feedListLoaded){
				console.log("fire")
				this.setState({feedListLoaded: true});
				this.props.updateMainState({ feeds: [] });
				this.props.ws.json({type: 'latest_feeds'});
		}
	}
	render({user, suggested, feeds}, {}) {
		return (
			<div>
				<Header {...this.props} />
				<div class="container">
					<div class="wall" style={`min-height: ${(window.innerHeight)/7*5}px;`}>
                        <h2>Discover</h2>
						<label>Tag Suggestions</label>
                        <Onboarding {...this.props} />
                        <hr />
						{feeds.map(
							feed => <Feed {...feed} {...this.props} />
						)}
					</div>
					<Footer {...this.props} />
				</div>
			</div>
		)
	}
}