import React from 'react';
import NavWindow from './NavWindow';
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
    const pageProps = { id: 'page-wrapper' };

    const wrapperClassName = [];
    if (className) wrapperClassName.push(className);
    if (noSidebar) wrapperClassName.push('no-sidebar');
    if (wrapperClassName.length) pageProps.className = wrapperClassName.join(' ');

    return (
      <div {...pageProps}>
        <NavWindow />
        {children}
      </div>
    );
  }
}

export default Page;