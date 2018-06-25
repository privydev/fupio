import { h, Component } from 'preact';

import Footer from '../../components/footer';

export default class Default extends Component {
	constructor(props){
		super(props)
		this.state = {
			codeConfirmed: false,
			invitation: "",
			code1: "ORION"
		}
	}
	onChangeInvitation = (e) => {
		this.setState({ invitation: e.target.value });
		if(this.state.invitation == `${this.state.code1}8`){
			this.setState({codeConfirmed: true})
		}
	}
	componentDidMount(){
		console.log(this.props)
	}
	render() {
		const { handleSignIn } = this.props;
		return (
			<div class="container">
				<div class="index">
					<div class="row">
						<section class="col">
							<h1 class="logo">Fupio</h1>
							<h2>Dead simple decentralized microblogging application.</h2>
							{this.state.codeConfirmed &&
								<button class="action red" onClick={ handleSignIn.bind(this) }>
									Sign In with Blockstack
								</button>
							}
							{!this.state.codeConfirmed &&
								<form>
									<input onInput={this.onChangeInvitation} placeholder="invitation code" />
									<legend style="font-size:0.8em">
										<span>Fupio is in private beta now. </span>
										<a target="_blank" href="https://forum.blockstack.org/t/looking-for-alpha-testers/5522">
											Ask a code.
										</a>
									</legend>
								</form>
							}
						</section>
						<section class="col watermelon">
							<img src="/watermelon.png" />
						</section>
					</div>
				</div>
				<hr />
				<Footer {...this.props} codeConfirmed={this.state.codeConfirmed} />
			</div>
		);
	}
}
