import { h, Component } from 'preact';
import TimeAgo from 'preact-timeago';

export default class Default extends Component {
    constructor(props) {
        super(props);
    }
    
    render({text, username, created}) {
        return (
            <p class="comment">
                <span class="icon icon-comment"> </span> 
                {text} 
                <span> - </span> 
                <a href="javascript:">{ username }</a> 
                {/* <span> - </span> 
                <TimeAgo datetime={created} live={true} />  */}
            </p>
        );
    }
}
