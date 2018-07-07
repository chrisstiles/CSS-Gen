import React from 'react';
import ColorStopsHolder from './ColorStopsHolder';
import Palette from './Palette';
import ColorPicker from '../ColorPicker';
import Slider from '../Slider';
import { sidebarControlsWidth, hexToRgb, getColorObject } from '../../../util/helpers';

const HALF_STOP_WIDTH = 5;

const toState = (palette) => ({
  palette: palette.map((c, i) => {
    const stop = ({ id: i + 1, ...c });

    if (typeof stop.color === 'string' && stop.color.indexOf('#') !== -1) {
      const hex = stop.color;
      stop.color = {
        hex: hex,
        rgb: hexToRgb(hex)
      };
    }

    if (stop.color.rgb && stop.color.rgb.a === undefined) {
      stop.color.rgb.a = 1;
    }

    return stop;
  }),
  activeId: 1,
  activeElement: null,
  pointX: null
});

const fromState = (palette) => {
  const compare = ({ pos: pos1 }, { pos: pos2 }) => pos1 - pos2;
  const sortedPalette = palette.sort(compare);
  return sortedPalette.map(({ pos, color }) => {
    if (!pos.toFixed) {
      console.log(pos)
    } else {
      pos = pos.toFixed(3)
    }

    return {
      pos: pos,
      color: getColorObject(color)
    };
    // return ({ pos: pos.toPrecision(3), color })
  });
}

class GradientPicker extends React.Component {
  constructor(props) {
    super(props);

    const palette = props.palette;
    this.state = { ...toState(palette) };

    this.getWidth = this.getWidth.bind(this);
    this.setWidth = this.setWidth.bind(this);
    this.handlePosChange = this.handlePosChange.bind(this);
    this.handleAddColor = this.handleAddColor.bind(this);
    this.handleActivate = this.handleActivate.bind(this);
    this.handleDeleteColor = this.handleDeleteColor.bind(this);
    this.handleSelectColor = this.handleSelectColor.bind(this);
    this.handleOpacityChange = this.handleOpacityChange.bind(this);

    this.state.width = this.getWidth();
  }

  componentDidMount() {
    window.addEventListener('resize', this.setWidth, false);
  }

  componentWillUnmount(){
    window.removeEventListener('resize', this.setWidth, false);
  }

  componentWillReceiveProps(newProps) {
    const palette = newProps.palette;
    this.setState({ ...toState(palette) });
  }

  getWidth() {
    return this.props.width !== undefined ? this.props.width : sidebarControlsWidth();
  }

  setWidth() {
    const width = this.getWidth();
    this.setState({ width });
  }

  get width1() {
    return this.state.width + 1;
  }

  get nextId() {
    return Math.max(...this.state.palette.map(c => c.id)) + 1
  }

  get activeStop() {
    return this.state.palette.find(s => s.id === this.state.activeId)
  }

  get mapStateToStops() {
    const activeId = this.state.activeId
    const pointX = this.state.pointX
    return this.state.palette.map(c => ({
      ...c,
      pos: this.width1 * c.pos - HALF_STOP_WIDTH,
      isActive: c.id === activeId,
      pointX
    }))
  }

  renderColorPicker() {
    const { children } = this.props
    const color = getColorObject(this.activeStop.color);

    const props = {
      color: color,
      onChange: this.handleSelectColor
    }
    if (!children) {
      return (
        <div className="field-wrapper align-right">
          <ColorPicker
            className="no-title"
            returnColorObject={true}
            ref={colorPicker => { this.colorPicker = colorPicker }}
            { ...props } 
          />
        </div>
      );
    }
    const child = React.Children.only(children)
    return React.cloneElement(child, props)
  }

  notifyChange(palette) {
    // console.log(fromState(palette))
    this.props.onChange(fromState(palette), this.props.name)
    // this.props.onChange(palette, this.props.name);
  }

  handleActivate(activeId, activeElement) {
    this.setState({ activeId, activeElement })
  }

  handleDeleteColor(id) {
    if (this.state.palette.length < 3) return
    const palette = this.state.palette.filter(c => c.id !== id)
    const activeId = palette.reduce((a, x) => x.pos < a.pos ? x : a, palette[0]).id
    this.setState({ palette, activeId })
    this.notifyChange(palette)
  }

  handlePosChange({ id, pos }) {
    const palette = this.state.palette.map(c =>
      id === c.id ? { ...c, pos: (pos + HALF_STOP_WIDTH) / this.width1 } : { ...c }
    )
    this.setState({ palette })
    this.notifyChange(palette)
  }

  handleAddColor({ pos, pointX }) {
    const color = this.activeStop.color
    const entry = { id: this.nextId, pos: pos / this.width1, color }
    const palette = [...this.state.palette, entry]
    this.setState({ palette, pointX })
    this.notifyChange(palette)
  }

  handleSelectColor(color) {
    let { palette, activeId } = this.state;

    palette = palette.map(c => {

      if (activeId === c.id) {
        const { hex, rgb } = color;
        c.color = { hex, rgb };
      }

      return c;
    });


    this.setState({ palette });
    this.notifyChange(palette);
  }

  handleOpacityChange(value) {
    let { palette, activeId } = this.state;

    this.activeStop.color.rgb.a = value;

    this.setState({ palette });
    this.notifyChange(palette);
  }

  componentWillReceiveProps({ palette: next }) {
    const { palette: current } = this.props
    const length = Math.min(next.length, current.length)
    for (let i = 0; i < length; i++) {
      if (next[i].pos !== current[i].pos || next[i].color !== current[i].color) {
        this.setState({ ...toState(next) })
        return
      }
    }
  }

  render() {
    const drop = 50;
    const width = this.state.width;
    const height = this.props.height !== undefined ? this.props.height : 40;
    const min = -HALF_STOP_WIDTH;
    const max = this.width1 - HALF_STOP_WIDTH;

    return (
      <div>
        <div className="inputs-row">
          <Palette width={width} height={height} palette={this.state.palette} />
          <ColorStopsHolder
            width={ width }
            stops={ this.mapStateToStops }
            limits={{ min, max, drop }}
            onPosChange={this.handlePosChange}
            onAddColor={this.handleAddColor}
            onActivate={this.handleActivate}
            onDeleteColor={this.handleDeleteColor}
          />
        </div>
        <div className="divider" />
        <div className="section-title">Gradient Stop Settings</div>
        <div className="inputs-row">
          <Slider
            title="Opacity"
            name="opacity"
            onChange={this.handleOpacityChange}
            value={this.activeStop.color.rgb.a}
            min={0}
            max={1}
            step={.01}
          />
          {this.renderColorPicker()}
        </div>
      </div>
    )
  }
}


export default GradientPicker
