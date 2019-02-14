import React from 'react';
import Page from '../../Page';

class Generator extends React.Component {
  render() {
    const { title, className, children } = this.props;
    const pageProps = { title };
    if (className) pageProps.className = className;

    return (
      <Page {...pageProps}>
        {children}
      </Page>
    );
  }
}

export default Generator;