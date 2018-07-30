
import {h, render} from 'preact';
import App from './app.js';
import 'preact/devtools';

const main = () => {
  render(<App />, document.body);
};

document.addEventListener('DOMContentLoaded', main);