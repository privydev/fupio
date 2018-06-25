import { h, Component } from 'preact';
import TimeAgo from 'preact-timeago';

import TagLink from '../tagLink';

import CommentList from '../commentList';
// import Like from '../like';
import CreateComment from '../createComment';
import Loading from '../loading';

const comment_button = <span><span class="icon icon-chat"> </span> comment</span>;
const comment_button_clicked = <strong><span class="icon icon-chat"> </span> comment</strong>;

export default class Feed extends Component {
    constructor(props) {
		super(props);
		this.state = {
            commentFormOpen: false,
            commentText: comment_button
        }
    }
    updateCommentForm = (event) => {
        event.preventDefault();
        let commentFormStatus = this.state.commentFormOpen = !this.state.commentFormOpen;
        let newCommentText = this.state.commentFormOpen ? comment_button_clicked : comment_button;
        this.setState({commentFormOpen: commentFormStatus, commentText: newCommentText});
    }
    render({identity, created, username, text, comments, tags}, {}) {
        return (
            <div style="margin: 1.67em auto">
                <div class="feed">
                    <a href="javascript:">
                        <img onError={(e)=>{e.target.src="/profile.png"}} 
                            src={`https://gaia.blockstack.org/hub/${identity}//avatar-0`} />
                    </a>
                    <content>
                        <a href="javascript:">
                            {username ? 
                                <strong>{ username }</strong> : 
                                <strong>{ identity.slice(0, 9) }...</strong>
                            }
                        </a>
                        {text ? <p>{text}</p> : <Loading />}
                    </content>
                    <hr />
                    <actions>
                        <span>
                            <TimeAgo datetime={created} live={true} />
                        </span>
                        <span> - <a href="javascript:" onClick={this.updateCommentForm}>
                                {this.state.commentText}
                            </a>
                        </span>
                        {/* <span>
                            <a href="javascript:">
                                <Like />
                            </a>
                        </span> */}
                    </actions>
                    <hr />
                    <CommentList comments={comments} />
                    {this.state.commentFormOpen && 
                        <CreateComment {...this.props} />
                    }
                </div>
                <tags>
                    {tags && tags.map(tag => <span><TagLink href={`/${tag}`} title={tag} {...this.props} /></span>)}
                </tags>  
            </div>
        );
    }
}
