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
import en from 'javascript-time-ago/locale/en'
TimeAgo.locale(en)
const timeAgo = new TimeAgo('en-US')

import Sockette from 'sockette';

const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';
const feedFileName = 'fupio-feeds-test.json';
const profileFileName = 'fupio-profile-test.json';

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
      newFeedText: "",
      feeds: [],
      feedIndex: 0,
      isLoading: false,
      displayError: false,
      ws: null,
  	};
  }
  initConnection(identity) {
    const url = `ws://127.0.0.1:38746?token=${identity}`;
    const wsConnection = new Sockette(url, {
      timeout: 5e3,
      maxAttempts: 10,
      onopen: e => console.log('Connected!', e),
      onmessage: e => console.log('Received:', {type: e.type, data: e.data}),
      onreconnect: e => console.log('Reconnecting...', e),
      onmaximum: e => console.log('Stop Attempting!', e),
      onclose: e => console.log('Closed!', e),
      onerror: e => console.log('Error:', e)
    });
    this.setState({ws: wsConnection});
  }
  componentDidMount() {
    // this.fetchData()

    let userData = loadUserData()
    this.loadProfile(userData)
    this.initConnection(userData.identityAddress);
  }

  loadProfile(userData) {
    console.log(userData)
  }

  handleNewFeedTextChange(event) {
    this.setState({
      newFeedText: event.target.value
    })
  }

  handleNewFeedTagChange(event) {
    this.setState({
      newFeedTags: event.target.value
    })
  }

  handleNewFeedSubmit(event) {
    if (this.state.newFeedText.length>0) {
      this.saveNewFeed(this.state.newFeedText, this.state.newFeedTags)
      this.setState({ newFeedText: "" })
      this.setState({ newFeedTags: "" })
      this.setState({ displayError: false })
    } else {
      this.setState({ displayError: "Not enough characters" })
    }

    this.state.ws.json({ type: 'get_blockchain'});
  }

  saveNewFeed(feedText, feedTags) {
    let feeds = this.state.feeds

    let feed = {
      id: this.state.feedIndex++,
      text: feedText.trim(),
      tags: feedTags.split(','),
      created_at: Date.now()
    }

    feeds.unshift(feed)
    const options = { encrypt: false }
    putFile(feedFileName, JSON.stringify(feeds), options)
      .then(() => {
        this.setState({
          feeds: feeds
        })
      })
    delete feed['text'];
    this.state.ws.json({ type: 'add_feed', data: feed});
  }

  fetchData() {
    if (this.isLocal()) {
      this.setState({ isLoading: true })
      const options = { decrypt: false, zoneFileLookupURL: 'https://core.blockstack.org/v1/names/' }
      getFile(feedFileName, options)
        .then((file) => {
          var feeds = JSON.parse(file || '[]')
          this.setState({
            person: new Person(loadUserData().profile),
            username: loadUserData().username,
            feedIndex: feeds.length,
            feeds: feeds,
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

      getFile(feedFileName, options)
        .then((file) => {
          var feeds = JSON.parse(file || '[]')
          this.setState({
            feedIndex: feeds.length,
            feeds: feeds
          })
        })
        .catch((error) => {
          console.log('could not fetch feeds')
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
              <div className="col brand">
                  <h1 className="logo">Fupio</h1>
              </div>
              <div className="col profile text-right">
                    <img src={ person.avatarUrl() ? person.avatarUrl() : avatarFallbackImage }
                          className="img-rounded avatar"
                    />
                    <div className="username">
                          {this.isLocal() &&
                            <a href="#" onClick={ handleSignOut.bind(this) }>Logout</a>
                          }   
                    </div>
              </div>
            </div>


            {this.isLocal() &&
              <div className="new">
                  {this.state.displayError && 
                    <p className="error">{this.state.displayError}</p>
                  }
                  <div className="right">
                    <div>
                      <input value={this.state.newFeedText}
                        onChange={e => this.handleNewFeedTextChange(e)}
                        placeholder="What's on your mind?"
                      />
                      <input value={this.state.newFeedTags}
                        onChange={e => this.handleNewFeedTagChange(e)}
                        placeholder="Tags, here.."
                      />
                    </div>
                    <div>
                      <button
                        className="btn btn-primary right"
                        onClick={e => this.handleNewFeedSubmit(e)}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
              </div>
            }

            <div>
                {this.state.isLoading && <center>Loading...</center>}
                {this.state.feeds.map((feed) => (
                    <article key={feed.id}>
                      <p>{feed.text}</p>
                      {feed.tags && 
                        <p>{feed.tags}</p>
                      }
                      <time>{timeAgo.format(feed.created_at)}</time>
                    </article>
                ))}
            </div>
            
      </div> : null
    );
  }
}
