import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import { isObjectOfShape } from '../util/helpers';
import WebFont from 'webfontloader';
import LoadingSpinner from './LoadingSpinner';
import { NotificationContainer } from 'react-notifications';
import _ from 'underscore';

// CSS Styles
import '../css/general.css';

// Generator Pages
import Home from './Home';
import Flexbox from './generators/Flexbox/';
import Transform from './generators/Transform/';
import BoxShadow from './generators/BoxShadow/';
import BorderRadius from './generators/BorderRadius/';
import Gradient from './generators/Gradient';
import Filter from './generators/Filter';
import Triangle from './generators/Triangle';
import TextShadow from './generators/TextShadow';

// Routes
const routes = [
  { path: '/', component: Home },
  { path: '/flexbox-generator', component: Flexbox },
  { path: '/transform-generator', component: Transform },
  { path: '/box-shadow-generator', component: BoxShadow },
  { path: '/border-radius-generator', component: BorderRadius },
  { path: '/gradient-generator', component: Gradient },
  { path: '/filter-generator', component: Filter },
  { path: '/triangle-generator', component: Triangle },
  { path: '/text-shadow', component: TextShadow }
];

// Global State
let getGlobalState;
let getGlobalDefaults;
let updateGlobalState; 
let getGlobalVariable;
let setGlobalVariable;
let startLoading;
let finishLoading;

class PrimaryLayout extends React.Component {
  constructor() {
    super();

    // Global state
    this.state = {
      showPreviewText: true,
      persistGeneratorState: true,
      showTooltips: true,
      outputPreviewStyles: false,
      showBrowserPrefixes: false
    };

    this.globalDefaults = _.extend({}, this.state);

    this.stateTypes = {
      showPreviewText: Boolean,
      persistGeneratorState: Boolean,
      outputPreviewStyles: Boolean,
      showBrowserPrefixes: Boolean
    };

    this.loadingStartTimes = {};
    this.loadingItems = [];

    // Load main web font asynchronously
    WebFont.load({
      google: {
        families: ['Montserrat:400,500,600,700,900']
      },
      classes: false
    });

    // Add persisted global state
    if (window.localStorage) {
      const key = 'globalState';

      if (window.localStorage.hasOwnProperty(key)) {
        let previousState = window.localStorage.getItem(key);

        try {
          previousState = JSON.parse(previousState);

          if (previousState) {
            if (isObjectOfShape(previousState, this.stateTypes)) {
              _.extend(this.state, previousState);
            }
          }
        } catch (e) {
          console.log(e);
        }
      }
    }

    getGlobalState = this.getGlobalState.bind(this);
    updateGlobalState = this.updateGlobalState.bind(this);
    getGlobalDefaults = this.getGlobalDefaults.bind(this);
    getGlobalVariable = this.getGlobalVariable.bind(this);
    setGlobalVariable = this.setGlobalVariable.bind(this);
    startLoading = this.startLoading.bind(this);
    finishLoading = this.finishLoading.bind(this);
  }

  componentDidMount() {
    document.addEventListener('touchmove', this.handleTouchmove, { passive: false });
    document.addEventListener('touchend', this.handleTouchend);
  }

  componentWillUnmount() {
    document.removeEventListener('touchmove', this.handleTouchmove);
    document.removeEventListener('touchend', this.handleTouchend);
  }

  handleTouchmove = e => {
    if (this.touchmoveDisabled) e.preventDefault();
  }

  handleTouchend = () => {
    this.touchmoveDisabled = false;
  }

  getGlobalState = () => {
    return this.state;
  }

  getGlobalDefaults = () => {
    return this.globalDefaults;
  }

  updateGlobalState = (newState) => {
    const state = _.extend({}, this.state, newState);
    this.setState(state);

    // Persist global state
    if (window.localStorage) {
      const key = 'globalState';

      // Save global state
      window.localStorage.setItem(key, JSON.stringify(state));

      // If persistGeneratorState key is false and not undefined
      // we clear all persisted generator state, but keep global state
      if (newState.persistGeneratorState === false) {
        const globalState = window.localStorage.getItem(key);
        window.localStorage.clear();
        window.localStorage.setItem(key, globalState);
      }
    }
  }

  getGlobalVariable = (name) => {
    return this[name];
  }

  setGlobalVariable = (value, name) => {
    this[name] = value;
  }

  startLoading = (name) => {
    if (!this.loadingItems.includes(name)) {
      this.loadingItems.push(name);

      if (!this.loadingStartTimes[name]) {
        this.loadingStartTimes[name] = new Date();
      }
    }

    if (this.loadingItems.length) {
      document.body.classList.add('loading');
      document.body.classList.add(`${name}-loading`);
    }
  }

  finishLoading = (name) => {
    if (this.loadingItems.includes(name)) {

      this.loadingItems = _.filter(this.loadingItems, item => {
        return item !== name;
      });
    }

    if (this.loadingStartTimes[name]) {
      // If the loading time is long enough for the user to see the spinner
      // but too short to see any animation we artificially add delay
      let delay = 0;
      
      const loadingEnd = new Date();
      const difference = loadingEnd.getTime() - this.loadingStartTimes[name].getTime();
      const minDiff = 60;
      const maxDiff = 350;

      if (difference >= minDiff && difference <= maxDiff) {
        const minDelay = 350;
        const maxDelay = 600;
        delay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
      }

      this.loadingStartTimes[name] = null;

      setTimeout(() => {
        document.body.classList.remove(`${name}-loading`);

        if (!this.loadingItems.length) {
          document.body.classList.remove('loading');
        }
      }, delay);
    } else {
      if (!this.loadingItems.length) {
        document.body.classList.remove('loading');
      }
    }
  }

  render() {
    const routeComponents = routes.map(({ path, component: Component }) => {
      return (
        <Route
          exact
          path={path}
          key={path}
          render={() => <Component globalState={this.state} />}
        />
      );
    });
  
    return routeComponents;
  }
}

class App extends React.Component {
  renderLoadingSpinner = () => {
    const spinner = (
      <div id="loading-wrapper">
        <LoadingSpinner />
      </div>
    );

    return ReactDOM.createPortal(spinner, document.body);
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          {this.renderLoadingSpinner()}
          <PrimaryLayout />
          <NotificationContainer />
        </div>
      </BrowserRouter>
    );
  }
}

export { 
  getGlobalState, 
  updateGlobalState, 
  getGlobalDefaults ,
  getGlobalVariable,
  setGlobalVariable,
  startLoading,
  finishLoading
 };

export default App;