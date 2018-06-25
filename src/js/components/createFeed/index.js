import { h, Component } from 'preact';

import TokenInput from 'preact-token-input';

const { putFile } = window.blockstack;

export default class CreateFeed extends Component {
    constructor(props){
        super(props)
        this.state = {
            tags: [],
            text: ""
        }
    }
    onChangeTags = (event) => {
        this.setState({ tags: event.value });
    }
    onChangeText = (event) => {
        this.setState({ text: event.target.value });
    }
    onSubmitFeed = () => {
        let feed = {
            username: this.props.user.username,
            text: this.state.text.trim(),
            comments: [],
            rating: null,
            tags: this.state.tags,
            created: Date.now(),
            identity: this.props.user.identityAddress
        };
        this.saveFeed(feed);
        this.saveRelation(feed);
        this.setState({tags:[], text:""})
    }
    saveFeed = (feed) => {
		putFile(`${feed.created}-${feed.identity}.json`, JSON.stringify(feed), {encrypt: false})
        .then(() => {
            this.props.ws.json({type: 'add_feed', data: feed});
            feed.tags.map((tag) => {
                this.props.followTag(tag);
            });
        })
	}
    saveRelation = (feed) => {
        const newUserSettings = this.props.userSettings;
        if(!newUserSettings.feeds){
			newUserSettings.feeds = [`${feed.created}-${feed.identity}.json`]
		} else {
            newUserSettings.feeds.unshift(`${feed.created}-${feed.identity}.json`);
        }
        this.props.updateMainState({userSettings: newUserSettings});
        putFile(`${this.props.user.identityAddress}-profile.json`, JSON.stringify(newUserSettings), {encrypt: true})
        .then(() => {
            this.props.updateMainState({ isLoading: false})
        });
	}
    render() {
        const {text, tags} = this.state;
        return (
            <div class="createFeed">
                <form action="javascript:" onSubmit={this.onSubmitFeed}>
                    <textarea value={text} onInput={this.onChangeText} 
                        class="text" type="text" placeholder="what a lovely day.." 
                        autocomplete="off" required="required" />
                    <TokenInput value={tags} onChange={this.onChangeTags} placeholder='tags, here, like, this' 
                        autocomplete={"off"} />
                    <input type="submit" value="send"/>
                </form>
            </div>
        );
    }
}
