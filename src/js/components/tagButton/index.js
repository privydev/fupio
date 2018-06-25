import { h, Component } from 'preact';

export default class TagButton extends Component {
    constructor(props) {
        super(props);
    }
    handleTagClicked = (e) => {
        e.preventDefault();
        this.props.followTag(this.props.tag);
    }
    render() {
        let isFollowing = false;
        if(this.props.userSettings.tags.includes(this.props.tag.toLowerCase())){
            isFollowing = true;
        } 
        return (
            <button disabled={isFollowing} class="tag" onClick={this.handleTagClicked.bind()}>
                {this.props.tag}
            </button>
        );
    }
}
