import React from 'react';
import { extend } from 'underscore';
import { getState, finishLoading } from '../../util/helpers';

function createStateObject(state, name) {
  if (state === undefined) return {};
  if (name === undefined) return state;

  const newState = {};
  newState[name] = state;

  return newState;
}

export default function createGenerator (WrappedGenerator, state, stateTypes, options = {}) {
  return class extends React.Component {
    constructor(props) {
      super(props);


      const { isDefaultPreview, mutateInitialState, ...restOptions } = options;

      this.state = getState(state, stateTypes, isDefaultPreview);
      this.options = { ...restOptions };

      if (mutateInitialState) this.state = mutateInitialState(this.state);
    }

    componentDidMount() {
      finishLoading('page');
    }

    updateGenerator = (stateOrValue, name) => {
      this.setState(createStateObject(stateOrValue, name));
    }

    updatePreview = (stateOrValue, name) => {
      const state = createStateObject(stateOrValue, name);
      this.setState({
        previewState: extend({}, this.state.previewState, state)
      });
    }

    updateDefaultPreviewState = (stateOrValue, name) => {
      const { defaultState } = this.state;
      const previewState = extend({}, defaultState.previewState, createStateObject(stateOrValue, name));
      const state = { previewState };
      this.setState({
        defaultState: extend({}, defaultState, state)
      });
    }

    resetGenerator = () => {
      let defaultState = extend(this.state.defaultState);

      // Generators can pass function to modify
      // default state before resetting generator
      const { mutateResetState } = this.options;
      if (mutateResetState) defaultState = mutateResetState(defaultState);

      this.setState(defaultState);
    }

    render() {
      const { 
        previewState, 
        defaultState, 
        ...generatorState 
      } = this.state;

      return (
        <WrappedGenerator
          generatorState={{ ...generatorState }}
          previewState={previewState}
          defaultState={defaultState}
          updateGenerator={this.updateGenerator}
          updatePreview={this.updatePreview}
          updateDefaultPreviewState={this.updateDefaultPreviewState}
          resetGenerator={this.resetGenerator}
          {...this.props}
        />
      );
    }
  }
}