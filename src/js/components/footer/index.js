import { h, Component } from 'preact';
import { Link } from 'preact-router';

import TagLink from '../tagLink';

export default class Footer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			suggested: this.props.suggested
		}
	}
	shouldComponentUpdate(){
		return false;
	}
	shuffle(a) {
		for (let i = a.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[a[i], a[j]] = [a[j], a[i]];
		}
		return a;
	}
	titleCase(str) {
		return str.toLowerCase().split(' ').map(function(word) {
		  return word.replace(word[0], word[0].toUpperCase());
		}).join(' ');
	}
	render() {
		const { handleSignOut } = this.props;
		const { suggested } = this.state;
		return (
			<footer class="footer">
				<div class="row">
					<div class="col">
						<h1 class="logo">Fupio</h1>
						<p>Made with ♥ on Blockstack Network.</p>
						<p> © {(new Date()).getFullYear()} </p>
					</div>
					<div class="col">
						<h3>Pages</h3>
						<ul>
							<li><Link href="/page/about">About</Link></li>
							<li><Link href="/page/team">Team</Link></li>
							<li><Link href="/page/why">Why?</Link></li>
							<li><a target="_blank" href="https://github.com/fupio">Github</a></li>
							<li><a target="_blank" href="https://speakerdeck.com/mehmetkose/fupio-a-decentralized-microblogging-application">Presentation</a></li>
							<li><a target="_blank" href="https://t.me/joinchat/BeM0LwwdJkoIBbkketDfCw">Telegram</a></li>
						</ul>
					</div>
					<div class="col">
						<h3>Resources</h3>
						<ul>
							<li><Link href="/page/branding">Branding</Link></li>
							<li><Link href="/page/privacy">Privacy Policy</Link></li>
							<li><Link href="/page/tos">Terms of Use</Link></li>
							<li><Link href="/page/disclaimers">Disclaimers</Link></li>
							<li><Link href="/page/faq">FAQ</Link></li>
							
							
						</ul>
					</div>
					<div class="col">
						<h3>Tags</h3>
						<ul>
						{suggested && suggested.slice(0, 5).map((tag) => (
							<li><TagLink href={`/${tag}`} title={this.titleCase(tag)} {...this.props} /></li>
						))}
						</ul>
					</div>
					{this.props.user &&
						<div class="col">
							<h3>Navigation</h3>
							<ul>
									<nav>
										<li><TagLink href="/" title="Home" {...this.props} /></li>
										{/* <li><Link href="/user/discussion">Discussion</Link></li>
										<li><Link href="/user/discussion">Discussion</Link></li>
										<li><Link href="/user/settings">Settings</Link></li> */}
										<li><Link href="#" onClick={ () => this.props.handleSignOut.bind() }>Logout</Link></li>
									</nav>
							</ul>
						</div>
					}
					{/* TODO: codeConfirmed related with the invitation code. it will be deleted.  */}
					{!this.props.user && this.props.codeConfirmed &&
						<div class="col">
							<h3>Navigation</h3>
							<ul>
								<nav>
									<li><Link href="#" onClick={ () => this.props.handleSignIn.bind() }>login</Link></li>
								</nav>
							</ul>
						</div>
					}
				</div>
			</footer>
		);
	}
}
