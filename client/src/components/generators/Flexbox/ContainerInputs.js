import React from 'react';
import Select from '../../input/Select';
// import ButtonSelect from '../../input/ButtonSelect';
import _ from 'underscore';
import { valueToLabel } from '../../../util/helpers';

class ContainerInputs extends React.Component {
  render() {
    const inputComponents = _.map(inputs, ({ name, options, ...props }) => {
      // Set options object
      options = _.map(options, value => {
        if (_.isObject(value)) {
          return value;
        }

        return { value, label: valueToLabel(value) }
      });
      // console.log(this.props[name])
      return (
        <Select
          name={name}
          key={name}
          value={this.props[name]}
          options={options}
          onChange={this.props.onChange}
          {...props}
        />
      );
    });

    return (
      <div>
        {inputComponents}
      </div>
    );
  }
}

export default ContainerInputs;

const inputs = [
  {
    name: 'flexDirection',
    label: 'Flex Direction',
    options: ['row', 'column', 'row-reverse', 'column-reverse']
  },
  {
    name: 'flexWrap',
    label: 'Flex Wrap',
    options: [{ label: 'No Wrap', value: 'nowrap'}, 'wrap', 'wrap-reverse']
  },
  {
    name: 'justifyContent',
    label: 'Justify Content',
    options: [
      'normal', 'center', 'start', 'end', 'flex-start', 'flex-end', 'left',
      'right', 'space-between', 'space-around', 'space-evenly', 'stretch'
    ]
  },
  {
    name: 'alignItems',
    label: 'Align Items',
    options: [
      'normal', 'stretch', 'center', 'end', 'flex-start', 'flex-end', 
      'flex-start', 'self-start', 'self-end', 'baseline'
    ]
  },
  {
    name: 'alignContent',
    label: 'Align Content',
    options: [
      'center', 'start', 'end', 'flex-start', 'flex-end', 'normal',
      'baseline', 'space-between', 'space-around', 'space-evenly', 'stretch'
    ]
  }
];