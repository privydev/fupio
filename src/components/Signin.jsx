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
        <div className="row index">
            <div className="col col-third padding-top">
                <h1 className="logo padding-top">Fupio</h1>
                <p>Dead simple decentralized microblogging application.</p>
                <button className="action_button" onClick={ handleSignIn.bind(this) }>
                  Sign In with Blockstack
                </button>
            </div>
            <div className="col text-right">
              <canvas id="c" width="500" height="500"></canvas>
            </div>
        </div>
      </div>
    );
  }
}
