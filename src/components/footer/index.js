import { h, Component } from 'preact';
import { Link } from 'preact-router';

import TagLink from '../tagLink';

export default class Footer extends Component {
	constructor(props) {
		super(props);
		this.state = {
		}
	}
	shouldComponentUpdate(){
		return false;
	}
	// shuffle(a) {
	// 	for (let i = a.length - 1; i > 0; i--) {
	// 		const j = Math.floor(Math.random() * (i + 1));
	// 		[a[i], a[j]] = [a[j], a[i]];
	// 	}
	// 	return a;
	// }
	// titleCase(str) {
	// 	return str.toLowerCase().split(' ').map(function(word) {
	// 	  return word.replace(word[0], word[0].toUpperCase());
	// 	}).join(' ');
	// }
	render() {
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
							<li><Link href="/page/rules">Rules</Link></li>
							<li><Link href="/page/about">About</Link></li>
							<li><Link href="/page/team">Team</Link></li>
							
						</ul>
					</div>
					<div class="col">
							<h3>Links</h3>
							<ul>
								<li><a target="_blank" rel="noopener" href="https://github.com/fupio">Github</a></li>
								<li><a target="_blank" rel="noopener" href="https://speakerdeck.com/mehmetkose/fupio-a-decentralized-microblogging-application">Presentation</a></li>
								<li><a target="_blank" rel="noopener" href="https://t.me/joinchat/BeM0LwwdJkoIBbkketDfCw">Telegram</a></li>
							</ul>
					</div>
					<div class="col">
						<h3>Resources</h3>
						<ul>
							<li><Link href="/page/privacy">Privacy Policy</Link></li>
							<li><Link href="/page/tos">Terms of Use</Link></li>
							<li><Link href="/page/faq">FAQ</Link></li>
							<li><Link href="/page/branding">Branding</Link></li>
						</ul>
					</div>
					{this.props.ws &&
						<div class="col">
							<h3>Tags</h3>
							<ul>
								{this.props.suggested && this.props.suggested.slice(0, 5).map((tag) => (
									<li>
										<TagLink href={`/${tag}`} title={tag} {...this.props}>
											<span>{tag}</span>
										</TagLink>
									</li>
								))}
							</ul>
						</div>
					}
					
				</div>
			</footer>
		);
	}
}
