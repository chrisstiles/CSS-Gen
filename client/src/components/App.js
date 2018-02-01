import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

// CSS Styles
import '../css/general.css';

// Layout Components
import NavWindow from './NavWindow';

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

const PrimaryLayout = () => (
  <div>
    <NavWindow />
    <main id="main">
      <Route exact path="/" component={Home} />
      <Route exact path="/box-shadow-generator" component={BoxShadow} />
    </main>
  </div>
)

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <PrimaryLayout />
      </BrowserRouter>
    );
  }
}

export default App;