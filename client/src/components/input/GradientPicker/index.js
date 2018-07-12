import React from 'react';
import ColorStopsHolder from './ColorStopsHolder';
import Palette from './Palette';
import tinycolor from 'tinycolor2';
import ColorPicker from '../ColorPicker';
import Slider from '../Slider';
import Select from '../Select';
import Toggle from '../Toggle';
import { sidebarControlsWidth } from '../../../util/helpers';

const HALF_STOP_WIDTH = 5;

const toState = (palette, activeId = 1, activeElement = null) => ({
  palette: palette.map((c, i) => {
    const stop = ({ id: i + 1, ...c });
    const color = tinycolor(stop.color);
    stop.color = color;
    return stop;
  }),
  activeId: activeId,
  activeElement: activeElement,
  pointX: null
});


class GradientPicker extends React.Component {
  constructor(props) {
    super(props);

    this.state = { ...toState(props.palette) };

    this.getWidth = this.getWidth.bind(this);
    this.setWidth = this.setWidth.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.handleRepeatingChange = this.handleRepeatingChange.bind(this);
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

  componentWillReceiveProps ({ palette: next }) {
    const { palette: current } = this.props;
    const length = Math.min(next.length, current.length);
    const activeId = this.state.activeId <= next.length ? this.state.activeId : 1;

    for (let i = 0; i < length; i++) {
      if (next[i].pos !== current[i].pos || next[i].color !== current[i].color) {
        this.setState({ ...toState(next, activeId) });
        return;
      }
    }
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
    return Math.max(...this.state.palette.map(c => c.id)) + 1;
  }

  get activeStop() {
    return this.state.palette.find(s => s.id === this.state.activeId);
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

  handleChange(value) {
    this.props.onChange(value, this.props.name);
  }

  handleTypeChange(value) {
    this.props.onChange(value, 'type');
  }

  handleRepeatingChange(value) {
    this.props.onChange(value, 'repeating');
  }

  handleActivate(activeId, activeElement) {
    this.setState({ activeId, activeElement });
  }

  handleDeleteColor(id) {
    if (this.state.palette.length < 3) return
    const palette = this.state.palette.filter(c => c.id !== id)
    const activeId = palette.reduce((a, x) => x.pos < a.pos ? x : a, palette[0]).id
    this.setState({ palette, activeId })
    this.handleChange(palette)
  }

  handlePosChange({ id, pos }) {
    const palette = this.state.palette.map(c =>
      id === c.id ? { ...c, pos: (pos + HALF_STOP_WIDTH) / this.width1 } : { ...c }
    )

    this.setState({ palette });
    this.handleChange(palette);
  }

  handleAddColor({ pos, pointX }) {
    const color = this.activeStop.color;
    const entry = { id: this.nextId, pos: pos / this.width1, color };
    const palette = [...this.state.palette, entry];

    this.setState({ palette, pointX });
    this.handleChange(palette);
  }

  handleSelectColor(color) {
    let { palette, activeId } = this.state;

    palette = palette.map(c => {

      if (activeId === c.id) {
        c.color = tinycolor(color);
      }

      return c;
    });

    this.handleChange(palette);
  }

  handleOpacityChange(value) {
    let { palette, activeId } = this.state;

    palette = palette.map(c => {

      if (activeId === c.id) {
        c.color.setAlpha(value);
      }

      return c;
    });

    this.handleChange(palette);
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
          <Select
            name="type"
            value={this.props.type}
            label="Gradient Type"
            onChange={this.handleTypeChange}
            options={[
              { value: 'linear', label: 'Linear' },
              { value: 'radial', label: 'Radial' }
            ]}
            menuContainer="#sidebar"
            scrollWrapper="#sidebar-controls"
            searchable={false}
          />
          <div className="field-wrapper right">
            <Toggle
              onChange={this.handleRepeatingChange}
              checked={this.props.repeating}
              label="Repeating"
              name="repeating"
            />
          </div>
        </div>
        <div className="divider" />
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
            value={this.activeStop.color.getAlpha()}
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
