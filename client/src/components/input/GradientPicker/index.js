import React from 'react';
import ColorStopsHolder from './ColorStopsHolder';
import Palette from './Palette';
import tinycolor from 'tinycolor2';
import ColorPicker from '../ColorPicker';
import Slider from '../Slider';
import { sidebarControlsWidth, hexOrRgba } from '../../../util/helpers';

const HALF_STOP_WIDTH = 5;

const toState = (palette, _activeId = 1, activeElement) => {
  let activeId = null;
  
  const state = {
    palette: palette.map((c, i) => {
      const prevId = c.id;
      const id = i + 1;
      const stop = ({ ...c, id, pos: Number(c.pos).toPrecision(3) });

      if (activeId === null) {
        if (activeElement && activeElement.pos === stop.pos) {
          activeId = id;
        } else if (prevId === _activeId) {
          activeId = id;
        }
      }

      return stop;
    })
  }

  state.palette = state.palette.sort(({ pos: pos1, color }, { pos: pos2 }) => {
    return ((pos1 < pos2) ? -1 : ((pos1 > pos2) ? 1 : 0));
  });

  state.activeId = activeId !== null ? activeId : 1;

  return state;
}

class GradientPicker extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = { width: sidebarControlsWidth() };
  }

  componentDidMount() {
    window.addEventListener('resize', this.setWidth, false);
    this.setWidth();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setWidth, false);
  }

  setWidth = () => {
    const width = sidebarControlsWidth();
    this.setState({ width });
  }

  get width1() {
    return this.state.width + 1;
  }

  get nextId() {
    return Math.max(...this.props.palette.map(c => c.id)) + 1;
  }

  get activeStop() {
    let stop = this.props.palette.find(s => s.id === this.props.activeId);

    if (!stop) {
      stop = this.props.palette[0];
    }

    return stop;
  }

  get mapStateToStops() {
    const activeId = this.props.activeId;
    const pointX = this.props.pointX;
    return this.props.palette.map(c => ({
      ...c,
      pos: this.width1 * c.pos - HALF_STOP_WIDTH,
      isActive: c.id === activeId,
      pointX
    }))
  }

  renderColorPicker = () => {
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
            {...props}
          />
        </div>
      );
    }
    const child = React.Children.only(children)
    return React.cloneElement(child, props)
  }

  handleChange = (palette, activeId = this.props.activeId, pointX = this.props.pointX) => {
    this.props.onChange({ ...toState(palette, activeId), pointX });
  }

  handleActivate = (activeId) => {
    this.props.onChange({ activeId });
  }

  handleDeleteColor = (id) => {
    if (this.props.palette.length < 3) return
    const palette = this.props.palette.filter(c => c.id !== id)
    const activeId = palette.reduce((a, x) => x.pos < a.pos ? x : a, palette[0]).id
    this.handleChange(palette, activeId)
  }

  handlePosChange = ({ id, pos }) => {
    const palette = this.props.palette.map(c => {
      if (id === c.id) {
        const pointX = Number(((Number(pos) + HALF_STOP_WIDTH) / this.width1).toPrecision(3));
        c.pos = pointX;
      }

      return c;
    })

    this.props.onChange({ palette });
  }

  handleAddColor = ({ pos, pointX }) => {
    const { color } = this.activeStop;
    const entry = { id: this.nextId, pos: pos / this.width1, color };
    const palette = [...this.props.palette, entry];

    this.handleChange(palette, entry.id, pointX);
  }

  handleSelectColor = (color) => {
    let { palette, activeId } = this.props;

    palette = palette.map(c => {

      if (activeId === c.id) {
        c.color = hexOrRgba(color);
      }

      return c;
    });

    this.handleChange(palette);
  }

  handleOpacityChange = (value) => {
    let { palette, activeId } = this.props;

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
          <Palette width={width} height={height} palette={this.props.palette} />
          <ColorStopsHolder
            width={width}
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