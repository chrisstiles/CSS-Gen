import React from 'react';
import { propsHaveChanged } from '../util/helpers';

class Header extends React.Component {
  shouldComponentUpdate(prevProps) {
    return propsHaveChanged(prevProps, this.props);
  }

  render() {
    const headerProps = { id: 'header' };
    const { resetGenerator, children } = this.props;

    return (
      <header {...headerProps}>
        <div className="content">
          {resetGenerator ?
            <div
              className="button reset"
              onClick={resetGenerator}
            >
              Reset
          </div>
            : null}
          {children}
        </div>
      </header>
    );
  }
}

export default Header;