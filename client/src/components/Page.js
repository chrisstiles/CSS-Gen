import React from 'react';
import Navigation from './Navigation';
import { startLoading, finishLoading } from '../util/helpers';

class Page extends React.Component {
  componentDidMount() {
    document.title = this.props.title || 'CSS-Gen';
    finishLoading('page');
  }

  componentWillUnmount() {
    startLoading('page');
  }

  render() {
    const { className, noSidebar, children } = this.props;
    const wrapperProps = { id: 'page-wrapper' };
    if (className) wrapperProps.className = className;

    const contentProps = { id: 'page-content' };
    if (noSidebar) contentProps.className = 'no-sidebar';

    return (
      <div {...wrapperProps}>
        <Navigation />
        <main {...contentProps}>
          {children}
        </main>
      </div>
    );
  }
}

export default Page;