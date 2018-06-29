import { h, Component } from 'preact';
import { route } from "preact-router";

export default class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: ""
        }
    }
    onChangeText = (event) => {
        this.setState({ text: event.target.value });
    }
    onSubmitForm = (e) => {
        e.preventDefault();
        this.props.updateMainState({ feeds: {} });
        this.props.ws.json({type: 'load_feeds', data: {'tags': [this.state.text.toLowerCase()]}});
        
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        route(`/${this.state.text}`)
    }
    onClickIcon = () => {
        this.setState({clickedIcon: true})
    }
	render({}, {clickedIcon}) {
        const icon = <span onClick={this.onClickIcon} class="icon icon-search" style="padding-left:0.3em"></span>
        const form = (<form style="display:inline" onSubmit={this.onSubmitForm} action="javascript:">
                        <input onInput={this.onChangeText} class="search" type="text" 
                            placeholder="Go to Tag" autofocus />
                      </form>);
		return !clickedIcon ? icon : form;
	}
}

