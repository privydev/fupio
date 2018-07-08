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
	componentDidMount(){
		setTimeout(() => {
			if( this.props.ws){
				this.props.ws.json({type: 'popular_tags'});
			}
		}, 300);
	}
	render({}, {}) {
		return (
			<div>
				<Header {...this.props} />
				<div class="container">
					<div class="wall" style={`min-height: ${(window.innerHeight) / 7 * 5}px;`}>
						<h2>Popular Tags</h2>
						<label>People posted in</label>
                        <Onboarding {...this.props} suggested={this.props.popularTags} />
						<hr />
						
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