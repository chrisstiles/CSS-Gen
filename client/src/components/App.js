import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

// Generator Pages
import Home from './Home';
import BoxShadow from './BoxShadow';

// import autoprefixer from 'autoprefixer';
// import postcss from 'postcss';

// postcss([ autoprefixer ]).process('display:flex').then(function (result) {
//     result.warnings().forEach(function (warn) {
//         console.warn(warn.toString());
//     });
//     console.log(result);
// });


class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/box-shadow-generator" component={BoxShadow} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;