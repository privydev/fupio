import { h, Component } from 'preact';

export default class TagLink extends Component {
	constructor(props){
        super(props)
    }
	handleTagRoute = (e) => {
        
        this.props.updateMainState({ feeds: [] });
        if(this.props.href == "/"){
            this.props.ws.json({type: 'load_feeds', data: {'tags': this.props.userSettings.tags}});
        }
		else {
            this.props.ws.json({type: 'load_feeds', data: {'tags': [this.props.title.toLowerCase()]}});
        }
        
        // Scroll to top
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    }
	render({href, title}) {
        return (
            <a class="tag" onClick={this.handleTagRoute.bind()} href={href} title={title}>
                {title}
            </a>
        )
	}
}