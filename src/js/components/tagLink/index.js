import { h, Component } from 'preact';
import {route} from 'preact-router';

export default class TagLink extends Component {
	constructor(props){
        super(props)
        this.state = {
            title: this.props.title || "link"
        }
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

        route(this.props.href)
    }
	render({title},{href}) {
        return (
            <span onClick={this.handleTagRoute} href={href} title={title} style="cursor: pointer">
                {this.props.children ? this.props.children : title}
            </span>
        )
	}
}