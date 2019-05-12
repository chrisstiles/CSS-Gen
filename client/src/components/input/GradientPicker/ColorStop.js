import React from 'react';
import ReactDOM from 'react-dom';
import { getEventPosition, disabledTouchmove } from '../../../util/helpers';

class ColorStop extends React.Component {
  constructor () {
    super();
    
    this.state = {
      posStart: 0,
      dragging: false
    };
  }

  componentDidMount() {
    // Start dragging right after adding new stop.
    // pointX is the cursor position when new stop has been created.
    const { pointX } = this.props.stop;
    if (pointX) this.activate(pointX);
  }

  activate(pointX) {
    this.setState({ posStart: pointX, dragging: true });
    this.props.onActivate(this.props.stop.id);
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
    document.addEventListener('touchmove', this.handleMouseMove, false);
    document.addEventListener('touchend', this.handleMouseUp, { passive: false });
  }

  deactivate() {
    this.setState({ dragging: false });
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
    document.removeEventListener('touchmove', this.handleMouseMove);
    document.removeEventListener('touchend', this.handleMouseUp);
  }

  handleMouseDown = e => {
    e.preventDefault();
    e.stopPropagation();
    disabledTouchmove();
    document.body.classList.add('dragging');

    if (!e.button) this.activate(getEventPosition(e).x);
  }

  handleMouseMove = e => {
    if (!this.state.dragging) return;

    const { x: clientX, y: clientY } = getEventPosition(e);

    if (clientX === undefined || clientY === undefined) return;

    const { limits, onDeleteColor, onPosChange, stop: { id, pos } } = this.props;

    // Remove stop
    const top = ReactDOM.findDOMNode(this).getBoundingClientRect().top;
    if (Math.abs(clientY - top) > limits.drop) {
      this.deactivate();
      onDeleteColor(id);
      return;
    }

    // Limit movements
    const offset = pos - this.state.posStart;
    const newPos = Math.max(Math.min(offset + clientX, limits.max), limits.min)
    this.setState({ posStart: newPos - offset })
    onPosChange({ id, pos: newPos })
  }

  handleMouseUp = () => {
    this.deactivate();
    document.body.classList.remove('dragging');
  }

  render () {
    const { pos, color, isActive } = this.props.stop
    return (
      <div 
        className={ isActive ? 'cs active' : 'cs' }
        style={{ left: pos }}
        ref={el => { this.el = el }}
        onMouseDown={this.handleMouseDown}
        onTouchStart={this.handleMouseDown}
      >
        <div style={{ backgroundColor: color }} />
      </div>
    )
  }
}

export default ColorStop
