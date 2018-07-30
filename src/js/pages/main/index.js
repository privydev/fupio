import { h, Component } from 'preact';

import Wall from '../wall';
import Home from '../home';

export default class Default extends Component {
	constructor(props){
		super(props)
	}
	render() {
		return this.props.user ? <Wall {...this.props} /> : <Home {...this.props} />
	}
}
