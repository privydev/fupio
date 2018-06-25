import { h, Component } from 'preact';

const { putFile } = window.blockstack;

export default class CreateComment extends Component {
    constructor(props) {
        super(props);
        this.state = { text: "" }
    }
    onChangeText = (event) => {
        this.setState({ text: event.target.value });
    }
    onSubmitForm = () => {
        const comment = {
            username: this.props.user.username,
            text: this.state.text.trim(),
            created: Date.now(),
            identity: this.props.user.identityAddress,
            feedId: `${this.props.created}-${this.props.identity}`
        };
        this.setState({ text: "" })
        const commentFile = `${this.props.created}-${this.props.identity}-${comment.created}.json`;
        const options = { username: this.props.username, app: this.props.address, decrypt: false };
        putFile(commentFile, JSON.stringify(comment), options).then(() => {
            this.props.ws.json({ type: 'add_comment', data: comment });
        })

        // const feedsSnapshot = this.props.feeds;
        // if (!feedsSnapshot[comment.feedId].comments){
        //     feedsSnapshot[comment.feedId].comments = []
        // }
        // feedsSnapshot[comment.feedId].comments.push(comment);
        // this.props.updateMainState({feeds: feedsSnapshot});
    }
    render({}, { text }) {
        return (
            <div class="createComment">
                <form action="javascript:" onSubmit={this.onSubmitForm}>
                    <input value={text} onInput={this.onChangeText} class="text" type="text" 
                        placeholder="comment text" autocomplete="off" required autofocus />    
                </form>
            </div>
        );
    }
}
