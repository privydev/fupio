import { h, Component } from 'preact';

export default class TimeAgo extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        timeago: new Date()
    }

    timeSince = (date) => {

        let seconds = Math.floor((new Date() - date) / 1000);

        let interval = Math.floor(seconds / 31536000);

        if (interval > 1) {
            return interval + " years ago";
        }
        interval = Math.floor(seconds / 2592000);
        if (interval > 1) {
            return interval + " months ago";
        }
        interval = Math.floor(seconds / 86400);
        if (interval > 1) {
            return interval + " days ago";
        }
        interval = Math.floor(seconds / 3600);
        if (interval > 1) {
            return interval + " hours ago";
        }
        interval = Math.floor(seconds / 60);
        if (interval > 1) {
            return interval + " minutes ago";
        }
        return Math.floor(seconds) + " seconds ago";
    }

    componentDidMount() {
        let newdate = new Date(parseInt(this.props.value)*1000);
        let newtime = this.timeSince(newdate);
        this.setState({timeago: newtime})
    }

    render(props, state) {
        return (
            <time>{state.timeago}</time>
        );
    }
}
