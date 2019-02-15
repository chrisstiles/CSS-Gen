import React from 'react';
import Page from '../../Page';
import { isEqual } from 'underscore';

class Generator extends React.Component {
  componentDidMount() {
    this.loggedLocalStorageError = false;
    this.persistStateTimer = null;
  }

  persistState = () => {
    // Use a timer to prevent this from being called too often
    clearTimeout(this.persistStateTimer);
    this.persistStateTimer = setTimeout(() => {
      if (window.localStorage) {
        const { generatorState, globalState } = this.props;

        if (
          !isEqual(this.prevGlobalState, globalState) ||
          !isEqual(this.prevGeneratorState, generatorState)
        ) {
          this.prevGlobalState = globalState;
          this.prevGeneratorState = generatorState;

          const path = window.location.pathname;
          const state = { 
            generatorState: this.prevGeneratorState,
            timestamp: (new Date().getTime())
          };

          // Store in localStorage if there is enough space
          try {
            window.localStorage.setItem(path, JSON.stringify(state));
            this.loggedLocalStorageError = false;
          } catch (e) {
            if (e.code === 22 && !this.loggedLocalStorageError) {
              this.loggedLocalStorageError = true;
              const globalState = window.localStorage.getItem('globalState');
              window.localStorage.clear();
              window.localStorage.setItem('globalState', globalState);
              console.log('Data not persisted, exceeds localStorage quota. Clearing...');
            }
          }
        }
      }
    }, 400);
  }

  componentDidUpdate() {
    this.persistState();
  }

  render() {
    const { title, className, children } = this.props;
  
    const pageClassName = ['generator'];
    if (className) pageClassName.push(className);
    
    const pageProps = { 
      title, 
      className: pageClassName.join(' ')
    };

    return (
      <Page {...pageProps}>
        {children}
      </Page>
    );
  }
}

export default Generator;