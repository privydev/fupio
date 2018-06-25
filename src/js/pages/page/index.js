import { h, Component } from 'preact';
import Markdown from 'preact-markdown';

import Header from '../../components/header';
import Footer from '../../components/footer';


export default class Default extends Component {
    constructor(props) {
		super(props);
		this.state = {
			content: {},
			title: "",
			body: [],
		}
	}
	componentDidMount(){
		fetch("/pages.json").then(response => response.json())
		.then( content => {
			this.setState({content: content})
			this.loadContent();
		})
		
		// Scroll to top
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
	}
	componentDidUpdate(){
		setInterval(()=>{this.loadContent()}, 2000);
	}

	loadContent() {
		const page_content = this.state.content[this.props.page_slug];
		this.setState({title: page_content.title, body: page_content.body})
	}
	render({}, {title, body}) {
		return (
			<div>
				<Header {...this.props} />
				<div class="container">
					<div class="wall page" style={`min-height: ${(window.innerHeight)/7*5}px;`}>
						<hr />
						<h1>{title}</h1>
						{this.state.body.map(line => <Markdown markdown={line} />)}
					</div>
					<Footer {...this.props} />
				</div>
			</div>
		)
	}
}