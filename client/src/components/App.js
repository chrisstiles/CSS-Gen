import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import _ from 'underscore';

// CSS Styles
import '../css/general.css';

// Layout Components
import NavWindow from './NavWindow';

// Generator Pages
import Home from './Home';
import BoxShadow from './generators/BoxShadow/';
import BorderRadius from './generators/BorderRadius/';
import Gradient from './generators/Gradient';
import Filter from './generators/Filter';

// Routes
const routes = [
  { path: '/', component: Home },
  { path: '/box-shadow-generator', component: BoxShadow },
  { path: '/border-radius-generator', component: BorderRadius },
  { path: '/gradient-generator', component: Gradient },
  { path: '/filter-generator', component: Filter },
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
var getGlobalState, getGlobalDefaults, updateGlobalState;

class PrimaryLayout extends React.Component {
  constructor() {
    super();

    // Global state
    this.state = {
      showPreviewText: true,
      outputPreviewStyles: false
    }

    this.globalDefaults = _.extend({}, this.state);

    // Add persisted global state
    const key = 'globalState';

    if (window.localStorage.hasOwnProperty(key)) {
      var previousState = window.localStorage.getItem(key);

      try {
        previousState = JSON.parse(previousState);

        if (previousState) {
          this.state = _.extend(this.state, previousState);
        }
      } catch(e) {
        console.log(e);
      }
    }

    addNotification = this.createNotification.bind(this);
    getGlobalState = this.getGlobalState.bind(this);
    updateGlobalState = this.updateGlobalState.bind(this);
    getGlobalDefaults = this.getGlobalDefaults.bind(this);
  }

  createNotification(type, message) {
    NotificationManager[type](message, null, 3700);
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

    return (
      <div>
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

export { addNotification, notificationTypes, getGlobalState, updateGlobalState, getGlobalDefaults };

export default App;