import React from 'react';
import ColorStopsHolder from './ColorStopsHolder';
import Palette from './Palette';
import tinycolor from 'tinycolor2';
import ColorPicker from '../ColorPicker';
import Slider from '../Slider';
import { sidebarControlsWidth, hexOrRgba } from '../../../util/helpers';
import _ from 'underscore';

const HALF_STOP_WIDTH = 5;

const toState = (palette, _activeId = 1, activeElement) => {
  let activeId = null;

  const state = {
    palette: palette.map((c, i) => {
      const id = i + 1;
      const stop = ({ id, pos: Number(c.pos).toPrecision(3), ...c });
      if (activeId === null) {
        if (activeElement && activeElement.pos === stop.pos) {
          activeId = id;
        } else if (id === _activeId) {
          activeId = id;
        }
      }

      return stop;
    })
  }

  state.activeId = activeId !== null ? activeId : state.palette[0].id;

  return state;
};

class GradientPicker extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = { ...toState(props.palette) };

    this.setWidth = this.setWidth.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handlePosChange = this.handlePosChange.bind(this);
    this.handleAddColor = this.handleAddColor.bind(this);
    this.handleActivate = this.handleActivate.bind(this);
    this.handleDeleteColor = this.handleDeleteColor.bind(this);
    this.handleSelectColor = this.handleSelectColor.bind(this);
    this.handleOpacityChange = this.handleOpacityChange.bind(this);

    this.state.width = sidebarControlsWidth();
  }

  componentDidMount() {
    window.addEventListener('resize', this.setWidth, false);
  }

  componentWillUnmount(){
    window.removeEventListener('resize', this.setWidth, false);
  }

  // componentDidUpdate(prevProps, prevState) {
  //   let newState = null;

  //   if (this.props.activeId !== this.state.activeId) {
  //     newState = { activeId: this.props.activeId }
  //   }

  //   if (!_.isEqual(this.props.palette, prevProps.palette)) {
  //     newState = _.extend({}, newState, { ...toState(this.props.palette, this.props.activeId) });
  //     // console.log(this.props.palette, newState.palette)
  //     // newState = _.extend({}, newState, { palette: this.props.palette });
  //   }

  //   if (newState) this.setState(newState);
  // }

  static getDerivedStateFromProps(newProps, state) {
    if (!_.isEqual(newProps.palette, state.prevPalette)) {
      const next = newProps.palette;
      const current = state.prevPalette || state.palette;
      const length = Math.min(next.length, current.length);
      const activeId = state.activeId <= next.length ? state.activeId : state.palette[0].id;

      let newState = next;

      for (let i = 0; i < length; i++) {
        if (next[i].pos !== current[i].pos || next[i].color !== current[i].color) {
          newState = { ...toState(next, activeId) };
          break;
        }
      }

      const prevPalette = newState.palette;
      newState.prevPalette = prevPalette;

      return newState;
    }

    return state.palette;
  }

  setWidth() {
    const width = sidebarControlsWidth();
    this.setState({ width });
  }

  get width1() {
    return this.state.width + 1;
  }

  get nextId() {
    return Math.max(...this.state.palette.map(c => c.id)) + 1;
  }

  get activeStop() {
    let stop = this.state.palette.find(s => s.id === this.state.activeId);

    if (!stop) {
      stop = this.state.palette[0];
    }

    return stop;
  }

  get mapStateToStops() {
    const activeId = this.state.activeId;
    const pointX = this.state.pointX;
    return this.state.palette.map(c => ({
      ...c,
      pos: this.width1 * c.pos - HALF_STOP_WIDTH,
      isActive: c.id === activeId,
      pointX
    }))
  }

  renderColorPicker() {
    const { children } = this.props
    const props = {
      color: this.activeStop.color,
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

  handleChange(palette, activeId = this.state.activeId) {
    const sortedPalette = palette.sort(({ pos: pos1, color }, { pos: pos2 }) => {
      return ((pos1 < pos2) ? -1 : ((pos1 > pos2) ? 1 : 0));
    });

    // console.log({ ...toState(sortedPalette, activeId) })

    this.props.onChange({ ...toState(sortedPalette, activeId) });
  }

  handleActivate(activeId) {
    // this.setState({ activeId });
    // console.log('here')
    this.props.onChange({ activeId });
  }

  handleDeleteColor(id) {
    if (this.state.palette.length < 3) return
    const palette = this.state.palette.filter(c => c.id !== id);
    const activeId = palette.reduce((a, x) => x.pos < a.pos ? x : a, palette[0]).id;
    console.log(palette, activeId)
    // console.log(palette, activeId)
    // this.setState({ palette, activeId });
    // console.log(palette, activeId)
    // this.setState({ activeId });
    this.handleChange(palette, activeId);
  }

  handlePosChange({ id, pos }) {
    const palette = this.state.palette.map(c => {
      if (id === c.id) {
        const xPosition = Number(((Number(pos) + HALF_STOP_WIDTH) / this.width1).toPrecision(3));
        c.pos = xPosition;
      }

      return c;
    })

    // this.setState({ palette });
    this.handleChange(palette);
  }

  handleAddColor({ pos, pointX }) {
    const { color } = this.activeStop;
    const activeId = this.nextId;
    const entry = { id: activeId, pos: pos / this.width1, color };
    const palette = [...this.state.palette, entry];

    this.setState({ pointX });
    this.handleChange(palette, activeId);
  }

  handleSelectColor(color) {
    let { palette, activeId } = this.state;

    palette = palette.map(c => {

      if (activeId === c.id) {
        c.color = hexOrRgba(color);
      }

      return c;
    });

    this.handleChange(palette);
  }

  handleOpacityChange(value) {
    let { palette, activeId } = this.state;

    palette = palette.map(c => {

      if (activeId === c.id) {
        c.color = hexOrRgba(tinycolor(c.color).setAlpha(value / 100));
      }

      return c;
    });

    this.handleChange(palette);
  }

  render() {
    const drop = 50;
    const width = this.state.width;
    const height = 40;
    const min = -HALF_STOP_WIDTH;
    const max = this.width1 - HALF_STOP_WIDTH;

    const opacity = Math.round(Number(tinycolor(this.activeStop.color).getAlpha().toFixed(2)) * 100);
    
    return (
      <div>
        <div className="inputs-row gradient-wrapper">
          <Palette width={width} height={height} palette={this.state.palette} />
          <ColorStopsHolder
            width={ width }
            stops={this.mapStateToStops}
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
            value={opacity}
            min={0}
            max={100}
            step={1}
            appendString="%"
          />
          {this.renderColorPicker()}
        </div>
      </div>
    )
  }
}


export default GradientPicker
