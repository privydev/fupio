import { h, Component } from 'preact';
import TimeAgo from 'preact-timeago';
import Markdown from 'preact-markdown';

import TagButton from '../tagButton';

import CommentList from '../commentList';
// import Like from '../like';
import CreateComment from '../createComment';
import Loading from '../loading';

const comment_button = <span><span class="icon icon-chat" /> comment</span>;
const comment_button_clicked = <strong><span class="icon icon-chat" /> comment</strong>;

export default class Feed extends Component {
	constructor(props) {
		super(props);
		this.state = {
			commentFormOpen: false,
			commentText: comment_button,
			imageLoaded: false
		};
	}
    updateCommentForm = (event) => {
    	event.preventDefault();
    	let commentFormStatus = this.state.commentFormOpen = !this.state.commentFormOpen;
    	let newCommentText = this.state.commentFormOpen ? comment_button_clicked : comment_button;
    	this.setState({ commentFormOpen: commentFormStatus, commentText: newCommentText });
    }
    render({ identity, created, username, text, comments, tags, image, profiles }, {}) {
    	return (
    		<div style="margin: 1.67em auto">
    			<div class="feed row">
    				<div class="col-tenth">
    					<a href="javascript:">
    						<img class="profileImage"
    							onError={(e) => {e.target.src='/assets/profile.png';}}
	src={profiles[username] && profiles[username].avatar ? profiles[username].avatar : '/assets/profile.png'}
                            />
    					</a>
    				</div>
    				<div class="col">
    					<content>
    						<a href="javascript:">
    							{username ?
    								<strong>{ username }</strong> :
    								<strong>{ identity.slice(0, 9) }...</strong>
    							}
    						</a>
    						{text && <Markdown markdown={text.replace(/!\[(.*?)\]\((.*?)\)/g, '').replace('javascript:', 'javascript_')} /> }
    						{image && image.name &&
                                <img src={image.base64} title={image.origin} />
    						}
    					</content>
    					<hr />
    					<actions>
    						<span>
    							<TimeAgo datetime={created} live />
    						</span>
    						{this.props.user.username &&
                                <span> - <a href="javascript:" onClick={this.updateCommentForm}>
                                	{this.state.commentText}
                                </a>
                                </span>
    						}
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
    					<hr />
    					<tags>
    						{tags && tags.map(tag => (<span>
                                <TagButton tag={tag} {...this.props} />
                            </span>))}
    					</tags>
    				</div>
                    
    			</div>
                 
    		</div>
    	);
    }
}
