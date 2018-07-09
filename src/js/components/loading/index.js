import { h, Component } from 'preact';

export default class Default extends Component {
    render() {
        return (
                <div class="loader" title="loading">
                    <svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                    width="20px" height="20px" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xmlSpace="preserve">
                        <path fill="#505664" d="M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z">
                            <animateTransform attributeType="xml"
                                attributeName="transform"
                                type="rotate"
                                from="0 25 25"
                                to="360 25 25"
                                dur="0.6s"
                                repeatCount="indefinite"/>
                        </path>
                    </svg>
                </div>
        );
    }
}