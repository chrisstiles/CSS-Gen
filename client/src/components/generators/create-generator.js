import React from 'react';
import { extend } from 'underscore';
import { getState } from '../../util/helpers';

function createStateObject(state, name) {
  if (state === undefined) return {};
  if (name === undefined) return state;

  const newState = {};
  newState[name] = state;

  return newState;
}

export default function createGenerator (WrappedGenerator, state, stateTypes, options) {
  return class extends React.Component {
    constructor(props) {
      super(props);
      const { isDefaultPreview, mutateInitialState } = options;
      
      this.state = getState(state, stateTypes, isDefaultPreview);
      console.log(this.state)

      if (mutateInitialState) this.state = mutateInitialState(this.state);
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

    render() {
      const { previewState, defaultState, ...generatorState } = this.state;
      return (
        <WrappedGenerator
          generatorState={{ ...generatorState }}
          previewState={previewState}
          defaultState={defaultState}
          updateGenerator={this.updateGenerator}
          updatePreview={this.updatePreview}
          updateDefaultPreviewState={this.updateDefaultPreviewState}
          {...this.props}
        />
      );
    }
  }
}