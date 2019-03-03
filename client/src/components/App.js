import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { isObjectOfShape } from '../util/helpers';
import _ from 'underscore';
import WebFont from 'webfontloader';

// CSS Styles
import '../css/general.css';

// Generator Pages
import Home from './Home';
import Flexbox from './generators/Flexbox/';
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
let setLoading;
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
      showBrowserPrefixes: false,
      isLoading: false
    };

    this.globalDefaults = _.extend({}, this.state);

    this.stateTypes = {
      showPreviewText: Boolean,
      persistGeneratorState: Boolean,
      outputPreviewStyles: Boolean,
      showBrowserPrefixes: Boolean,
      isLoading: Boolean
    };

    this.state.isLoading = false;
    this.state.loadingItems = [];

    // Load main web font asynchronously
    WebFont.load({
      google: {
        families: ['Montserrat:400,500,600,700']
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

    // addNotification = this.createNotification.bind(this);
    getGlobalState = this.getGlobalState.bind(this);
    updateGlobalState = this.updateGlobalState.bind(this);
    getGlobalDefaults = this.getGlobalDefaults.bind(this);
    getGlobalVariable = this.getGlobalVariable.bind(this);
    setGlobalVariable = this.setGlobalVariable.bind(this);
    setLoading = this.setLoading.bind(this);
    startLoading = this.startLoading.bind(this);
    finishLoading = this.finishLoading.bind(this);
  }

  getGlobalState() {
    return this.state;
  }

  getGlobalDefaults() {
    return this.globalDefaults;
  }

  updateGlobalState(newState) {
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

  getGlobalVariable(name) {
    return this[name];
  }

  setGlobalVariable(value, name) {
    this[name] = value;
  }

  setLoading(isLoading) {
    this.setState({ isLoading });
  }

  startLoading(name) {
    const { loadingItems: currentLoadingItems } = this.state;
    
    if (!currentLoadingItems.includes(name)) {
      const loadingItems = currentLoadingItems.slice();
      loadingItems.push(name);

      this.setState({ loadingItems, isLoading: true });
    }
  }

  finishLoading(name) {
    const { loadingItems: currentLoadingItems } = this.state;
  
    if (currentLoadingItems.includes(name)) {

      const loadingItems = _.filter(currentLoadingItems, item => {
        return item !== name;
      });

      // Stop loading if everything has finished
      const isLoading = loadingItems.length >= 1;

      this.setState({ loadingItems, isLoading });
    } else {
      if (!currentLoadingItems.length) {
        this.setState({ isLoading: false });
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
          render={props => <Component globalState={this.state} />}
        />
      );
    });

    const className = this.state.isLoading ? 'app-loading' : '';
  
    return (
      <div className={className}>
        {routeComponents}
      </div>
    );
  }
}

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <PrimaryLayout />
      </BrowserRouter>
    );
  }
}

export { 
  // addNotification, 
  // notificationTypes,
  getGlobalState, 
  updateGlobalState, 
  getGlobalDefaults ,
  getGlobalVariable,
  setGlobalVariable,
  setLoading,
  startLoading,
  finishLoading
 };

export default App;