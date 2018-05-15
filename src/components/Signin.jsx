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
        <div className="row">
          <div className="column column-padding-top">
            <h1 className="logo">Fupio</h1>
            <p>Dead simple decentralized microblogging application.</p>
            <button className="action_button" onClick={ handleSignIn.bind(this) }>
              Sign In with Blockstack
            </button>
          </div>
          <div className="column column-padding-top">
            <img src="/watermelon.png" width="100%"/>
          </div>
        </div>
      </div>
    );
  }
}
