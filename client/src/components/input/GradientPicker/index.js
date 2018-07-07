import React from 'react';
import GradientBuilder from './GradientBuilder';
import ColorPicker from '../ColorPicker';
import { sidebarControlsWidth } from '../../../util/helpers';

const defaultPalette = [
  { pos: 0.00, color: '#000000' },
  { pos: 1.00, color: '#343434' }
];

// const Wrapped

class GradientPicker extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.getWidth = this.getWidth.bind(this);
    this.setWidth = this.setWidth.bind(this);

    this.state = {
      width: this.getWidth()
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.setWidth, false);
  }

  componentWillUnmount(){
    window.removeEventListener('resize', this.setWidth, false);
  }

  getWidth() {
    return this.props.width !== undefined ? this.props.width : sidebarControlsWidth();
  }

  setWidth() {
    const width = this.getWidth();
    this.setState({ width });
  }

  handleChange(palette) {
    this.props.onChange(palette, this.props.name);
  }

  render() {
    const height = this.props.height !== undefined ? this.props.height : 40;
    const palette = this.props.palette || defaultPalette;

    return (
      <GradientBuilder {...{
        width: this.state.width,
        height: height,
        palette: palette,
        onPaletteChange: this.handleChange
      }} />
    );
  }
}

export default GradientPicker;