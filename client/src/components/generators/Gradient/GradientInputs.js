import React from 'react';
import GradientPicker from '../../input/GradientPicker';

class GradientInputs extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    console.log('change');
  }

  render() {
    return (
      <GradientPicker {...{
        width: 250,
        height: 40,
        palette: [
          { pos: 0.00, color: '#eef10b' },
          { pos: 0.49, color: '#d78025' },
          { pos: 0.72, color: '#d0021b' },
          { pos: 1.00, color: '#7e20cf' }
        ],
        onPaletteChange: this.handleChange
      }} />
    );
  }
}

export default GradientInputs;