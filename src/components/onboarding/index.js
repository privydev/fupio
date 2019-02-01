import { h, Component } from 'preact';
import TagButton from '../tagButton';

export default class Default extends Component {
	constructor(props) {
		super(props);
	}
	render({ suggested }) {
		return (
			<div class="onboarding feed text-center">
				{suggested && suggested.map((tag) => (
					<TagButton tag={tag} {...this.props} />
				))}
			</div>
		);
	}
}
