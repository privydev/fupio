import { h, Component } from 'preact';

import TokenInput from 'preact-token-input';
import readAndCompressImage from 'browser-image-resizer'

import Loading from '../loading';

const { putFile, getFile } = window.blockstack;

export default class CreateFeed extends Component {
    constructor(props){
        super(props)
        this.state = {
            tags: [],
            text: "",
            image: null,
            canSubmit: false
        }
    }
    onChangeTags = (event) => {
        const tags = event.value ;
        this.setState({ tags: tags });

        if(tags.length > 0){
            this.setState({canSubmit: true})
        }
        else {
            this.setState({canSubmit: false})
        }
    }
    onChangeText = (event) => {
        this.setState({ text: event.target.value });
    }
    onSubmitFeed = () => {
        let feed = {
            username: this.props.user.username,
            text: this.state.text.trim(),
            comments: [],
            rating: null,
            tags: this.state.tags.filter(tag => tag.length > 1),
            image: this.state.image,
            created: Date.now(),
            identity: this.props.user.identityAddress
        };
        this.saveFeed(feed);
        this.saveRelation(feed);
        this.setState({tags:[], text:"", image: null})
    }
    saveFeed = (feed) => {
        const options = {username: this.props.user.username, app: this.props.address, encrypt: false};
		putFile(`${feed.created}-${feed.identity}.json`, JSON.stringify(feed), options)
        .then(() => {
            this.props.ws.json({type: 'add_feed', data: feed});
            feed.tags.map((tag) => {
                this.props.followTag(tag);
            });
        })
	}
    saveRelation = (feed) => {
        const newUserSettings = this.props.userSettings;
        if(!newUserSettings.feeds){
			newUserSettings.feeds = [`${feed.created}-${feed.identity}.json`]
		} else {
            newUserSettings.feeds.unshift(`${feed.created}-${feed.identity}.json`);
        }
        this.props.updateMainState({userSettings: newUserSettings});
        putFile(`${this.props.user.identityAddress}-profile.json`, JSON.stringify(newUserSettings), {encrypt: true})
        .then(() => {
            this.props.updateMainState({ isLoading: false})
        });
    }
    handleFileSelect = (event) => {
        const cls = this;
        const file = event.target.files[0];
        const config = {
            quality: 0.5,
            maxWidth: 1280,
            maxHeight: 720,
            autoRotate: true,
            debug: true,
        }
        readAndCompressImage(file, config).then(resizedImage => {
            cls.setState({imageLoading: true})
            
            let base64data = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
            const reader = new FileReader();
            reader.readAsDataURL(resizedImage);
            reader.onloadend = function() {
                base64data = reader.result;

                const newImageFile = {
                    name: `${cls.props.user.identityAddress}_${Date.now()}_image.json`,
                    size: resizedImage.size,
                    type: resizedImage.type,
                    origin: file.name,
                    base64: base64data
                }
                const options = {username: cls.props.user.username, app: cls.props.address, decrypt: false};
                putFile(newImageFile.name, JSON.stringify(newImageFile), options).then(() => {
                    cls.setState({imageLoading: false, image: newImageFile})
                    console.log(newImageFile)
                    // getFile(newImageFile.name, {encrypt: false})
                    // .then((fileContents) => {
                    //     console.log(fileContents);
                    // });
                });
            }
        })

    }
    render({},{text, tags, imageLoading, canSubmit}) {
        return (
            <div class="createFeed">
                <form action="javascript:" onSubmit={this.onSubmitFeed}>
                    <textarea value={text} onInput={this.onChangeText} 
                        class="text" type="text" placeholder="what a lovely day.." 
                        autocomplete="off" required="required" />
                    <TokenInput value={tags} onChange={this.onChangeTags} placeholder='tags, here, like, this' 
                        autocomplete={"off"} />
                    
                    <div class="row">
                        <div class="col imageUpload">
                            <input onChange={this.handleFileSelect} type="file" accept="image/*" />
                        </div>
                        {canSubmit &&
                            <div class="col col-third">
                                {!imageLoading && canSubmit &&
                                    <input type="submit" value="create feed" />
                                }
                                {!imageLoading && !canSubmit &&
                                    <input type="submit" value="create feed" disabled />
                                }
                                {imageLoading && 
                                    <center><Loading /></center>
                                }
                            </div>
                        }
                    </div>
                </form>
            </div>
        );
    }
}
