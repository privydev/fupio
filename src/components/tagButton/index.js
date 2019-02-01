import { h, Component } from 'preact';

export default class TagButton extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isFollowing: null,
			init: false
		};
	}
	componentDidMount(){
		this.setState({ isFollowing: false });
	}
	componentDidUpdate(){
		if (!this.state.init && this.props.tag) {
			const tag = this.props.tag.toLowerCase();
			const tags = this.props.userSettings.tags.map(t => typeof t === 'string' && t.toLowerCase());
			if (tags.includes(tag)) {
				this.setState({ isFollowing: true, init: true });
			}
			else {
				this.setState({ isFollowing: false, init: true });
			}
		}
	}
    handleTagRoute = (e) => {
    	this.props.updateMainState({ feeds: [] });
    	if (this.props.href == '/'){
    		this.props.ws.json({ type: 'load_feeds', data: { tags: this.props.userSettings.tags } });
    	}
    	else {
    		this.props.ws.json({ type: 'load_feeds', data: { tags: [this.props.tag.toLowerCase()] } });
    	}
    	// Scroll to top
    	document.body.scrollTop = 0; // For Safari
    	document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    }
    handleFollowAction = (e) => {
    	e.preventDefault();
    	// this.props.followTag(this.props.tag);
    	if (this.state.isFollowing == true) {
    		this.setState({ isFollowing: false });
    		this.props.unFollowTag(this.props.tag);
    	}
 else {
    		this.setState({ isFollowing: true });
    		this.props.followTag(this.props.tag);
    	}
    }
    render({ tag }, { isFollowing }) {
    	return (
    		<div class="tagButton">
    			<a onClick={this.handleTagRoute} href={`/${tag.toLowerCase()}`}>{tag.toLowerCase()}</a>
    			<button class={isFollowing ? 'active' : null} onClick={this.handleFollowAction}>
    				{isFollowing ?
    					<span class="icon icon-check" /> :
    					<span class="icon icon-plus" />
    				}
    			</button>
    		</div>
    	);
    }
}
