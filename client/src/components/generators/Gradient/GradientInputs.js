import React from 'react';
import GradientPicker from '../../input/GradientPicker';

class GradientInputs extends React.Component {
  constructor(props) {
    super(props);
    
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(value, name) {
    var state = {};
    state[name] = value;
    this.props.owner.setState(state);
  }

  render() {
    const styles = this.props.styles;

    return (
      <GradientPicker 
        name="palette"
        palette={styles.palette}
        onChange={this.handleChange}
      />
    );
  }
}

export default GradientInputs;