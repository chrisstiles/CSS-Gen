import React from 'react';

class Header extends React.Component {
  shouldComponentUpdate() {
    if (!this.initialized) {
      this.initialized = true;
      return true;
    }

    return false;
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