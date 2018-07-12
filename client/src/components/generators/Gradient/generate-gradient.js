import { hexOrRgba } from '../../../util/helpers';

class Gradient {
	constructor(settings) {
		const { 
			palette, 
			type = 'linear', 
			repeating = false,
			shape = 'ellipse',
			extendKeyword = 'none',
			position = 'center'
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
	  this.position = position;

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

		this.styles = styles;
	}

	generateCSS() {
		const { background } = this.styles;
		// Flat background as fallback
		var css = `background: ${this.palette[0].color};`;

		// Add gradient CSS
		css += ` background: ${background};`

		this.css = css;
	}
}

function generateGradient(settings) {
	return new Gradient(settings);
}

export default generateGradient;