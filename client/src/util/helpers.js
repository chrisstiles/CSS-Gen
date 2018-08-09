import _ from 'underscore';
import tinycolor from 'tinycolor2';
import { 
	addNotification as _addNotification, 
	notificationTypes,
	getGlobalState as _getGlobalState,
	getGlobalDefaults as _getGlobalDefaults,
	updateGlobalState as _updateGlobalState
} from '../components/App';

export function addNotification(type, message) {
	_addNotification(type, message);
}

export function getNotificationTypes() {
	return notificationTypes;
}

export function getGlobalState() {
	return _getGlobalState();
}

export function getGlobalDefaults() {
	return _getGlobalDefaults();
}

export function updateGlobalState(state) {
	_updateGlobalState(state);
}

export function getDefaultState(defaultState) {
	const defaults = {
		width: 300,
		height: 300,
		dragX: 0,
		dragY: 0,
		backgroundColor: '#ffffff',
    hasResized: false
	};

	return _.extend({}, defaults, defaultState);
}

export function getPersistedState(defaultState) {
  var state = _.extend({}, defaultState);

  if (!window.localStorage) {
    return state;
  }

  // Generator specific state
  const path = window.location.pathname;

  if (window.localStorage.hasOwnProperty(path)) {
    var previousState = window.localStorage.getItem(path);

    try {
      previousState = JSON.parse(previousState);

      if (previousState) {
        state = _.extend(state, previousState);
      }
    } catch(e) {
      console.log(e);
    }
  }

  return state;
}

export function cssToJs(name) {
  var split = name.split('-');
  var output = "";
  for (var i = 0; i < split.length; i++) {
    if (i > 0 && split[i].length > 0 && !(i === 1 && split[i] === 'ms')) {
      split[i] = split[i].substr(0, 1).toUpperCase() + split[i].substr(1);
    }

    output += split[i];
  }
  
  return output;
}

export function jsToCss(name) {
	return name.replace(/([A-Z])/g, '-$1').toLowerCase();
}

export function numberInConstraints(num, min = null, max = null) {
	const hasMin = min !== null && min !== undefined;
	const hasMax = max !== null && max !== undefined;

	// No minimum or maximum
	if (!hasMin && !hasMax) {
		return num;
	}

	// Has minimum but no maximum
	if (hasMin && !hasMax) {
		if (num > min) {
			return num;
		} else {
			return min;
		}
	}

	// Has maximum but no minimum
	if (hasMax && !hasMin) {
		if (num < max) {
			return num;
		} else {
			return max;
		}
	}

	// Has both minimum and maximum
  if (num > max) {
    return max;
  } else if (num < min) {
    return min;
  } else {
    return num;
  }
}

export function generateCSSString(css) {
	var cssString = '';

	_.each(css, (value, key) => {
		if (value) {
			key = jsToCss(key);
			cssString += ` ${key}: ${value};`;
		}
	});

	return cssString.trim();
}

export function sidebarControlsWidth() {
  const sidebarControls = document.getElementById('sidebar-controls');

  if (sidebarControls) {
    const computedStyle = getComputedStyle(sidebarControls);
    const paddingLeft = parseFloat(computedStyle.paddingLeft);
    const paddingRight = parseFloat(computedStyle.paddingRight);

    return sidebarControls.offsetWidth - paddingLeft - paddingRight;
  } else {
    const windowWidth = window.innerWidth;

    if (windowWidth <= 1250) {
      return 244;
    } else {
      return 284;
    }
  }
}

export function hexToRgb(hex) {
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
  	return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
    a: 1
  } : null;
}

export function getColorString(color) {
	if (!color) {
		return '';
	}

	if (typeof color === 'string') {
		return color;
	}

	if (!color.rgb && color.hex) {
		return color.hex;
	}

	if (color.hex && color.rgb.a === 1) {
		return color.hex;
	}

	const colorObject = color.rgb ? color.rgb : color;
	const { r, g, b, a } = colorObject;

	if (a === undefined) {
		return `rgb(${r}, ${g}, ${b})`;
	} else {
		return `rgba(${r}, ${g}, ${b}, ${a})`;
	}
}

export function getColorObject(color) {
	if (!color) {
		return '';
	}

	if (typeof color === 'string') {
		return color;
	}

	if (color.hex && color.rgb.a === 1) {
		return color.hex;
	}

	return color.rgb;
}

export function hexOrRgba(color) {
	color = tinycolor(color);

	if (color.getAlpha() === 1) {
		return color.toHexString();
	} else {
		return color.toRgbString();
	}
}

export function removeDuplicates(array, key) {
	const newArray = [];
	const values = []; 

	array.forEach((element, index) => {
	  if (values.indexOf(element[key]) === -1) {
	    newArray.push(element);
	    values.push(element[key]);
	  }
	});

	return newArray;
}

export function radToDeg(rad) {
	return rad * (180 / Math.PI);
}

export function createSelection(field, start, end) {
  if( field.createTextRange ) {
    var selRange = field.createTextRange();
    selRange.collapse(true);
    selRange.moveStart('character', start);
    selRange.moveEnd('character', end);
    selRange.select();
    field.focus();
  } else if( field.setSelectionRange ) {
    field.focus();
    field.setSelectionRange(start, end);
  } else if( typeof field.selectionStart !== 'undefined' ) {
    field.selectionStart = start;
    field.selectionEnd = end;
    field.focus();
  }
}

// Returns a Promise that resolves with the image dimensions
export function getNativeImageSize(src) {
  return new Promise(resolve => {
    const image = new Image();
    image.src = src;
    image.onload = () => {
      const { width, height } = image;
      resolve({ width, height });
    }
  });
}

export function getImageSize(width, height, wrapper) {
	wrapper = wrapper || document.querySelector('#generator-wrapper');

	if (!wrapper) {
		return { width, height };
	}

	const rect = wrapper.getBoundingClientRect();
	const maxWidth = rect.width;
	const maxHeight = window.innerHeight - rect.top - 30;

	if (width <= maxWidth && height <= maxHeight) {
		return { width, height };
	}

	if (maxWidth >= maxHeight) {
		height = height * maxWidth / width;
		width = maxWidth;
	} else {
		width = width * maxHeight / height;
		height = maxHeight;
	}

	return { width, height };
}








