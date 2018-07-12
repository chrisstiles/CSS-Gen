import { hexOrRgba } from '../../../util/helpers';

class Gradient {
	constructor(palette, type = 'linear', repeating = false) {
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

		switch (this.type) {
			case 'linear':
				gradientCSS += 'to left';
				break;
			case 'radial':
				gradientCSS += 'circle at center';
				break;
			default:
				break;
		}

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

function generateGradient(palette, type = 'linear', repeating = false) {
	return new Gradient(palette, type, repeating);
}

export default generateGradient;