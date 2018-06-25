import { h, Component } from 'preact';

const like_button = <span><i class="fa fa-thumbs-o-up"></i> like</span>;
const liked_button = <strong><i class="fa fa-thumbs-up"></i> liked</strong>;

export default class Create extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        liked: this.props.liked ? true : false,
        likedText: this.props.liked ? liked_button : like_button
    };

    onSubmitButton = (event) => {
        event.preventDefault();
        let newliked = this.props.liked = !this.props.liked;
        let newlikedText = this.props.liked ? liked_button : like_button;
        this.setState({liked: newliked, likedText: newlikedText});
    }
    
    render(props, { likedText }) {
        return (
            <span class="like" onClick={this.onSubmitButton}>
                    {likedText}
                </span>
        );
    }
}
