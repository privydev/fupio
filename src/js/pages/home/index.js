import { h, Component } from 'preact';

import Footer from '../../components/footer';
import Loading from '../../components/loading';

const { redirectToSignIn } = window.blockstack;

export default class Default extends Component {
	constructor(props){
		super(props)
		this.state = {
		}
	}
	handleSignIn = (e) => {
		e.preventDefault();
		this.setState({clickedLogin: true})
		const origin = window.location.origin;
		redirectToSignIn(origin, origin + '/manifest.json', ['store_write', 'publish_data'])
	};
	render() {
		return (
			<div class="container">
				<div class="index">
					<div class="row">
						<section class="col">
							<h1 class="logo">Fupio</h1>
							<h2>Dead simple decentralized microblogging application.</h2>
							<button class="action red" onClick={ this.handleSignIn }>
								{!this.state.clickedLogin ? "Sign In with Blockstack" : <Loading />}
							</button>
						</section>
						<section class="col watermelon">
							<img src="/watermelon.png" />
						</section>
					</div>
				</div>
				<hr />
				<Footer {...this.props} />
			</div>
		);
	}
}
