import React from 'react';
import { propsHaveChanged } from '../util/helpers';

class Header extends React.Component {
  shouldComponentUpdate(prevProps) {
    return propsHaveChanged(prevProps, this.props);
  }

  render() {
    const headerProps = { id: 'header' };
    const { defaultState, updateGenerator, children } = this.props;

    return (
      <header {...headerProps}>
        <div className="content">
          {defaultState && updateGenerator ?
            <div
              className="button reset"
              onClick={() => { updateGenerator(defaultState) }}
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