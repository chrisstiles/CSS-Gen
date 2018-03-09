import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { NotificationContainer, NotificationManager } from 'react-notifications';

// CSS Styles
import '../css/general.css';

// Layout Components
import NavWindow from './NavWindow';

// Generator Pages
import Home from './Home';
import BoxShadow from './generators/BoxShadow';


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
        <Route exact path="/box-shadow-generator" component={BoxShadow} />
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

export { addNotification, notificationTypes };

export default App;