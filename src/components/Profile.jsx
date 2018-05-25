import React, { Component } from 'react';
import {
  isSignInPending,
  loadUserData,
  Person,
  getFile,
  putFile,
  lookupProfile
} from 'blockstack';

import TimeAgo from 'javascript-time-ago'

// Load locale-specific relative date/time formatting rules.
import en from 'javascript-time-ago/locale/en'

// Add locale-specific relative date/time formatting rules.
TimeAgo.locale(en)

// Create relative date/time formatter.
const timeAgo = new TimeAgo('en-US')

const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';
const statusFileName = 'statuses.json'

export default class Profile extends Component {
  constructor(props) {
  	super(props);

  	this.state = {
  	  person: {
  	  	name() {
          return 'Anonymous';
        },
  	  	avatarUrl() {
  	  	  return avatarFallbackImage;
  	  	},
  	  },
      username: "",
      newStatus: "",
      statuses: [],
      statusIndex: 0,
      isLoading: false,
      displayError: false
  	};
  }

  componentDidMount() {
    this.fetchData()
    
    let userData = loadUserData()
    let blockstackIdentityToken = userData.identityAddress
    console.log(blockstackIdentityToken)

  }

  handleNewStatusChange(event) {
    this.setState({
      newStatus: event.target.value
    })
  }

  handleNewStatusSubmit(event) {
    if (this.state.newStatus.length>0) {
      this.saveNewStatus(this.state.newStatus)
      this.setState({ newStatus: "" })
      this.setState({ displayError: false })
    } else {
      this.setState({ displayError: "Not enough characters" })
    }
  }

  saveNewStatus(statusText) {
    let statuses = this.state.statuses

    let status = {
      id: this.state.statusIndex++,
      text: statusText.trim(),
      created_at: Date.now()
    }

    statuses.unshift(status)
    const options = { encrypt: false }
    putFile(statusFileName, JSON.stringify(statuses), options)
      .then(() => {
        this.setState({
          statuses: statuses
        })
      })
  }

  fetchData() {
    if (this.isLocal()) {
      this.setState({ isLoading: true })
      const options = { decrypt: false, zoneFileLookupURL: 'https://core.blockstack.org/v1/names/' }
      getFile(statusFileName, options)
        .then((file) => {
          var statuses = JSON.parse(file || '[]')
          this.setState({
            person: new Person(loadUserData().profile),
            username: loadUserData().username,
            statusIndex: statuses.length,
            statuses: statuses,
          })
        })
        .finally(() => {
          this.setState({ isLoading: false })
        })
    } else {
      const username = this.props.match.params.username
      this.setState({ isLoading: true })

      lookupProfile(username)
        .then((profile) => {
          this.setState({
            person: new Person(profile),
            username: username
          })
        })
        .catch((error) => {
          console.log('could not resolve profile')
        })

      const options = { username: username, decrypt: false, zoneFileLookupURL: 'https://core.blockstack.org/v1/names/'}

      getFile(statusFileName, options)
        .then((file) => {
          var statuses = JSON.parse(file || '[]')
          this.setState({
            statusIndex: statuses.length,
            statuses: statuses
          })
        })
        .catch((error) => {
          console.log('could not fetch statuses')
        })
        .finally(() => {
          this.setState({ isLoading: false })
        })
    }
  }

  isLocal() {
    return this.props.match.params.username ? false : true
  }

  render() {
    const { handleSignOut } = this.props;
    const { person } = this.state;
    const { username } = this.state;

    return (
      !isSignInPending() && person ?
      <div className="container">

            <div className="row navigation">
                <div className="column brand">
                  <h1 className="logo">Fupio</h1>
                </div>
                <div className="column profile">
                  <div className="avatar-section">
                      <img
                        src={ person.avatarUrl() ? person.avatarUrl() : avatarFallbackImage }
                        className="img-rounded avatar"
                      />
                      <div className="username">
                        {/* <h1>
                          <span id="heading-name">{ person.name() ? person.name()
                            : 'Nameless Person' }</span>
                        </h1>
                        <br /> */}
                        {this.isLocal() &&
                          <a href="#" onClick={ handleSignOut.bind(this) }>Logout</a>
                        }
                        {/* <small>{username}</small>
                        <br /> */}
                        
                      </div>
                  </div>
                </div>
            </div>

            {this.isLocal() &&
              <div className="row">
                <div className="column">
                  {this.state.displayError && 
                    <p className="error">{this.state.displayError}</p>
                  }
                  <div className="new-status">
                    <div>
                      <input className="input-status"
                        value={this.state.newStatus}
                        onChange={e => this.handleNewStatusChange(e)}
                        placeholder="What's on your mind?"
                      />
                    </div>
                    <div>
                      <button
                        className="btn btn-primary"
                        onClick={e => this.handleNewStatusSubmit(e)}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                  
                </div>
              </div>
            }

            <div className="row">
              <div className="column">
                {this.state.isLoading && <span>Loading...</span>}
                {this.state.statuses.map((status) => (
                    <article key={status.id}>
                      <p>{status.text}</p>
                      <time>{timeAgo.format(status.created_at)}</time>
                    </article>
                    )
                )}
              </div>
            </div>
            
      </div> : null
    );
  }
}
