import { h, Component } from 'preact';
import { Link } from 'preact-router';

import TagLink from '../tagLink';
import Search from '../search';

export default class Header extends Component {
	constructor(props){
		super(props)
	}
	render() {
		return (
			<header class="header">
				<section class="container">
					<h1 class="logo">
						<TagLink href="/" title="Fupio" {...this.props} />
					</h1>
					{this.props.user &&
						<nav>
							{/* <Link href="/discussion" title="Discussion">
								<span class="icon icon-chat"></span>
							</Link> */}
							<Link href="/" title="Home">
								<span class="icon icon-home"></span>
							</Link>
							<Search {...this.props} />
							<Link href="/user/settings" title="Settings">
								<span class="icon icon-cog"></span>
							</Link>
							<Link href="#" title="Logout" onClick={ this.props.handleSignOut }>
								<span class="icon icon-logout"></span>
							</Link>
						</nav>
					}
					{/* TODO: Kapalı betadan çıkınca burayı aç */}
					{/* {!this.props.user && 
						<nav>
							<Link href="#" onClick={ this.props.handleSignIn.bind() }>login</Link>
						</nav>
					} */}
				</section>
			</header>
		);
	}
}
