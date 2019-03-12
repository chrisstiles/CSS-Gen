import React from 'react';
import Sidebar from '../../Sidebar';
import GradientPicker from '../../input/GradientPicker';
import Select from '../../input/Select';
import PositionSelect from '../../input/PositionSelect';
import Toggle from '../../input/Toggle';
import AnglePicker from '../../input/AnglePicker';

class GradientInputs extends React.PureComponent {
  renderTypeSettings = () => {
    if (this.props.type === 'linear') {
      return (
        <AnglePicker 
          label="Gradient Angle"
          angle={this.props.angle}
          onChange={this.props.updateGenerator}
          name="angle"
        />
      );
    } else {
      return (
        <div>
          <div className="inputs-row">
            <Select
              name="shape"
              value={this.props.shape}
              label="Shape"
              onChange={this.props.updateGenerator}
              options={[
                { value: 'circle', label: 'Circle' },
                { value: 'ellipse', label: 'Ellipse' }
              ]}
              searchable={false}
            />
            <Select
              name="extendKeyword"
              value={this.props.extendKeyword}
              label="Extend To"
              onChange={this.props.updateGenerator}
              options={[
                { value: 'none', label: 'None' },
                { value: 'closest-side', label: 'Closest Side' },
                { value: 'closest-corner', label: 'Closest Corner' },
                { value: 'farthest-side', label: 'Farthest Side' },
                { value: 'farthest-corner', label: 'Farthest Corner' }
              ]}
              searchable={false}
            />
          </div>
          <PositionSelect
            label="Gradient Position"
            name="position"
            position={this.props.position}
            offsetX={this.props.offsetX}
            offsetY={this.props.offsetY}
            onClick={this.props.updateGenerator}
          />
        </div>
      );
    }
  }

  render() {
    return (
      <Sidebar>
        <GradientPicker 
          name="palette"
          activeId={this.props.activeId}
          palette={this.props.palette}
          onChange={this.props.updateGenerator}
        />
        <div className="divider" />
        <div className="inputs-row">
          <Select
            name="type"
            value={this.props.type}
            label="Type"
            onChange={this.props.updateGenerator}
            options={[
              { value: 'linear', label: 'Linear' },
              { value: 'radial', label: 'Radial' }
            ]}
            menuContainer="#sidebar"
            scrollWrapper="#sidebar-controls"
            searchable={false}
            className="w68"
          />
          <div className="field-wrapper right">
            <Toggle
              onChange={this.props.updateGenerator}
              checked={this.props.repeating}
              label="Repeating"
              name="repeating"
            />
          </div>
        </div>
        {this.renderTypeSettings()}
      </Sidebar>
    );
  }
}

export default GradientInputs;