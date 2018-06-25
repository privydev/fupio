import { h, Component } from 'preact';

export default class Search extends Component {
    constructor(props) {
        super(props);
        this.state = { text: "" }
    }
    onChangeText = (event) => {
        this.setState({ text: event.target.value });
    }
    onSubmitForm = () => {
        console.log(this.state.text)
    }
	render() {
		return (
            <form onSubmit={this.onSubmitForm} action="javascript:">
			    <input onInput={this.onChangeText} class="search" type="text" placeholder="Go Tag" />
            </form>
		);
	}
}
