import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { NotificationContainer, NotificationManager } from 'react-notifications';

// CSS Styles
import '../css/general.css';

// Layout Components
import NavWindow from './NavWindow';

// Generator Pages
import Home from './Home';
import BoxShadow from './generators/BoxShadow/';
import BorderRadius from './generators/BorderRadius/';
import Gradient from './generators/Gradient';

// Store generator routes
const generators = [
  { path: '/box-shadow-generator', component: BoxShadow },
  { path: '/border-radius-generator', component: BorderRadius },
  { path: '/gradient-generator', component: Gradient }
];


var addNotification;
const notificationTypes = {
  info: 'info',
  warning: 'warning',
  success: 'success',
  error: 'error'
}

class PrimaryLayout extends React.Component {
  constructor() {
    super();

    addNotification = this.createNotification.bind(this);

    // Use saved state from the last time the user used a generated
    this.previousState = null;

    if (window.localStorage) {
      const path = window.location.pathname;

      if (window.localStorage.hasOwnProperty(path)) {
        const previousState = window.localStorage.getItem(path);

        try {
          this.previousState = JSON.parse(previousState);
        } catch(e) {
          console.log(e);
        }
      }
    }
  }

  createNotification(type, message) {
    NotificationManager[type](message, null, 3700);
  }

  render() {
    return (
      <div>
        <NotificationContainer />
        <NavWindow />
        <Route exact path="/" component={Home} />
        {
          generators.map(g =>
            <Route 
              exact 
              path={g.path}
              key={g.path}
              render={props => <g.component {...props} previousState={this.previousState} />}
            />
          )
        }
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <BrowserRouter>
        <PrimaryLayout />
      </BrowserRouter>
    );
  }
}

export { addNotification, notificationTypes };

export default App;