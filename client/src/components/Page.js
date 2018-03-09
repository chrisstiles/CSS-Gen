import React from 'react';
import Header from './Header';

class Page extends React.Component {
  constructor(props) {
    super(props);

    document.title = props.title;

    this.renderToolbar = this.renderToolbar.bind(this);
  }

  renderToolbar() {
    if (this.props.toolbar !== undefined) {
      return this.props.toolbar;
    }
  }

  render() {
    return (
      <div>
        <Header title={this.props.heading} />
        {this.props.toolbar}
        <main id="main">
          {this.props.children}
        </main>
      </div>
    );
  }
}

export default Page;