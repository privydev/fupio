import React, { Component } from 'react';
import { isUserSignedIn } from 'blockstack';

export default class Signin extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { handleSignIn } = this.props;

    return (
      <div className="container">
        <h1 className="landing-heading">Fupio</h1>
        <p>Dead simple microblogging application</p>
        <button className="action_button" onClick={ handleSignIn.bind(this) }>
          Sign In with Blockstack
        </button>
      </div>
    );
  }
}
