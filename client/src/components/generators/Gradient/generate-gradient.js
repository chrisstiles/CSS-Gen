import { hexOrRgba } from '../../../util/helpers';
import tinycolor from 'tinycolor2';


class Gradient {
	constructor(settings) {
		var { 
			palette, 
			type = 'linear', 
			repeating = false,
			shape = 'ellipse',
			extendKeyword = 'none',
			position = 'center',
			positionX = 0,
			positionY = 0
		} = settings;

		// Palette must have at least 2 stops
		if (!Array.isArray(palette) || palette.length < 2) {
			console.error('Gradient must have at least 2 stops');
			return;
		}

		// Sort based on x position of stops
		var sortedPalette = palette.sort(({ pos: pos1, color }, { pos: pos2 }) => {
	    return ((pos1 <= pos2) ? -1 : ((pos1 > pos2) ? 1 : 0));
	  });

	  // Set either hex or rgba based on alpha value
	  sortedPalette = sortedPalette.map(({ pos, color }) => {
	  	return { 
	  		color: hexOrRgba(color),
	  		pos: Number(pos).toPrecision(3) 
	  	};
	  });

	  this.palette = sortedPalette;

	  // Linear, repeating linear, radial or repeating radial
	  this.type = type;
	  this.property = `${type}-gradient`;

	  // Save radial specific CSS
	  this.shape = shape;
	  this.extendKeyword = extendKeyword;

	  // Radial gradient position
	  const singlePosition = ['top', 'right', 'bottom', 'left'].indexOf(position) !== -1;
	  
	  // Add x and y adjustments to position
	  var positionAdjusted = false;
	  if (['center', 'top', 'bottom'].indexOf(position) === -1 && positionX) {
	  	position = position.replace('left', `left ${positionX}px`);
	  	position = position.replace('right', `right ${positionX}px`);
	  	positionAdjusted = true;
	  }

	  if (['center', 'left', 'right'].indexOf(position) === -1 && positionY) {
	  	position = position.replace('top', `top ${positionY}px`);
	  	position = position.replace('bottom', `bottom ${positionY}px`);
	  	positionAdjusted = true;
	  }

	  if (positionAdjusted && singlePosition) {
	  	position = `center ${position}`;
	  }

	  this.position = position;
	  this.positionX = positionX;
	  this.positionY = positionY;

	  // Add repeating if necessary
	  if (repeating) {
	  	this.property = `repeating-${this.property}`;
	  }

	  // Generate styles Object
	  this.generateStyles(sortedPalette);

	  // Generate CSS String
	  this.generateCSS();
	}

	generateStyles(palette = this.palette) {
		const styles = {};
		
		// Gradient
		var gradientCSS = `${this.property}(`;

		if (this.type === 'linear') {
			// Linear gradients
			gradientCSS += 'to left';
		} else {
			// Radial gradients
			gradientCSS += `${this.shape}`;

			if (this.extendKeyword !== 'none') {
				gradientCSS += ` ${this.extendKeyword}`;
			}

			// Add position
			gradientCSS += ` at ${this.position}`;
		}

		// Add color stops
		palette.forEach(stop => {
			const pos = `${Math.round(stop.pos * 100)}%`; 
			gradientCSS += `, ${stop.color} ${pos}`;
		});

		gradientCSS += ')';

		styles.background = gradientCSS;

		// Add fallback for old versions of IE
		const startColor = tinycolor(this.palette[0].color).toHexString();
		const endColor = tinycolor(this.palette[this.palette.length - 1].color).toHexString();
		styles.filter = `progid:DXImageTransform.Microsoft.gradient( startColorstr='${startColor}', endColorstr='${endColor}',GradientType=1 )`;

		// Save styles object
		this.styles = styles;
	}

	generateCSS() {
		const { background, filter } = this.styles;
		// Flat background as fallback
		var css = `background: ${this.palette[0].color};`;

		// Add gradient CSS
		css += ` background: ${background};`

		// Add fallback for old versions of IE
		css += ` filter: ${filter}`;

		this.css = css;
	}
}

function generateGradient(settings) {
	return new Gradient(settings);
}

export default generateGradient;