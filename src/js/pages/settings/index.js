import { h, Component } from 'preact';
import { Link } from 'preact-router';

import Header from '../../components/header';
import Footer from '../../components/footer';

export default class Default extends Component {
    constructor(props) {
		super(props);
		this.state = {
		}
	}
	render({user, suggested}, {}) {
		return (
			<div>
				<Header {...this.props} />
				<div class="container">
					<div class="wall page" style={`min-height: ${(window.innerHeight)/7*5}px;`}>
						<div class="row">
							<div class="col">
								{user &&
									<form>
										<label>Username</label>
										<input type="text" value={user.username} disabled />
										<hr />
									</form>
								}
							</div>
							<div class="col">
								<label style="margin-top: 3em">
									<span>Logout </span> 
								</label>
								<Link href="#" title="Logout" onClick={ this.props.handleSignOut }>
										<span class="icon icon-logout"></span>
								</Link>
							</div>
						</div>
					</div>
					<Footer {...this.props} />
				</div>
			</div>
		)
	}
}