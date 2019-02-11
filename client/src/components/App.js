import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { isObjectOfShape } from '../util/helpers';
import _ from 'underscore';

// CSS Styles
import '../css/general.css';

// Layout Components
import NavWindow from './NavWindow';

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

// Notifications
var addNotification;
var notificationTypes = {
  info: 'info',
  warning: 'warning',
  success: 'success',
  error: 'error'
}

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
      outputPreviewStyles: false,
      showBrowserPrefixes: false,
      loading: false
    };

    this.globalDefaults = _.extend({}, this.state);

    this.stateTypes = {
      showPreviewText: Boolean,
      outputPreviewStyles: Boolean,
      showBrowserPrefixes: Boolean,
      loading: Boolean
    };

    this.state.loading = false;
    this.state.loadingItems = [];

    addNotification = this.createNotification.bind(this);
    getGlobalState = this.getGlobalState.bind(this);
    updateGlobalState = this.updateGlobalState.bind(this);
    getGlobalDefaults = this.getGlobalDefaults.bind(this);
    getGlobalVariable = this.getGlobalVariable.bind(this);
    setGlobalVariable = this.setGlobalVariable.bind(this);
    setLoading = this.setLoading.bind(this);
    startLoading = this.startLoading.bind(this);
    finishLoading = this.finishLoading.bind(this);
  }

  componentDidMount() {
    // Add persisted global state
    const key = 'globalState';

    if (window.localStorage.hasOwnProperty(key)) {
      var previousState = window.localStorage.getItem(key);

      try {
        previousState = JSON.parse(previousState);

        if (previousState) {
          if (isObjectOfShape(previousState, this.stateTypes)) {
            this.setState(_.extend({}, this.state, previousState));
          }
        }
      } catch (e) {
        console.log(e);
      }
    }
  }

  createNotification(type, message) {
    NotificationManager[type](message, null, 4500);
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

      // Save generator styles
      window.localStorage.setItem(key, JSON.stringify(state));
    }
  }

  getGlobalVariable(name) {
    return this[name];
  }

  setGlobalVariable(value, name) {
    this[name] = value;
  }

  setLoading(loading) {
    this.setState({ loading });
  }

  startLoading(name) {
    const { loadingItems: currentLoadingItems } = this.state;
    
    if (!currentLoadingItems.includes(name)) {
      const loadingItems = currentLoadingItems.slice();
      loadingItems.push(name);

      this.setState({ loadingItems, loading: true });
    }
  }

  finishLoading(name) {
    const { loadingItems: currentLoadingItems } = this.state;
  
    if (currentLoadingItems.includes(name)) {

      const loadingItems = _.filter(currentLoadingItems, item => {
        return item !== name;
      });

      // Stop loading if everything has finished
      const loading = loadingItems.length >= 1;

      this.setState({ loadingItems, loading });
    } else {
      if (!currentLoadingItems.length) {
        this.setState({ loading: false });
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

    const className = this.state.loading ? 'app-loading' : '';

    return (
      <div className={className}>
        <NotificationContainer />
        <NavWindow />
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
  addNotification, 
  notificationTypes,
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