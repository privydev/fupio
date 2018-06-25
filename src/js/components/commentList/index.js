import { h, Component } from 'preact';
import Comment from '../comment';

export default class CommentList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false
        }
    }
    openCommentList = (event) => {
        event.preventDefault();
        this.setState({show: true});
    }
    render({comments}, {show}) {
        return (
            <div class="commentList">
                {comments && !show && comments.length > 2 && 
                    <div>
                        <Comment {...comments[0]} />
                        <a href="javascript:" onClick={this.openCommentList}>
                            <span style="border-bottom: 1px dotted">{comments.length - 2} more comments</span>
                        </a>
                        <Comment {...comments[comments.length - 1]} />
                    </div>
                }

                {comments && show && comments.length > 2 && comments.map(comment => <Comment {...comment} />)}

                {comments && comments.length < 3 && comments.map(comment => <Comment {...comment} />)}
            </div>
        );
    }
}
