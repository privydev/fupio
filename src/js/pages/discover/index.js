import { h, Component } from 'preact';

import Header from '../../components/header';
import Footer from '../../components/footer';
import Onboarding from '../../components/onboarding';

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
                        <h2>Discover</h2>
						<label>Tag Suggestions</label>
                        <Onboarding {...this.props} />
                        <hr />
					</div>
					<Footer {...this.props} />
				</div>
			</div>
		)
	}
}