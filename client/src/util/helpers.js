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

export function updateGlobalState(stateOrValue, name) {
	// Can pass either state object or single key value pair
	const state = _.extend({}, stateOrValue);

	if (name) {
		state[name] = stateOrValue;
	}

	_updateGlobalState(state);
}

export function extendSameTypes(object1, object2) {
  const newObject = _.extend({}, object1, object2);

  _.each(newObject, (value, key) => {
    const defaultValue = object1[key];

    if (typeof value !== typeof defaultValue) {
      newObject[key] = defaultValue;
      return;
    }
    
  });

  return newObject;
}

export function getPersistedState(defaultState, isPreview) {
  var state = _.extend({}, defaultState);

  if (!window.localStorage) {
    return state;
  }

  // Generator specific state
  var path = window.location.pathname;

  if (window.localStorage.hasOwnProperty(path)) {
    var previousState = window.localStorage.getItem(path);

    try {
    	if (isPreview) {
    		previousState = JSON.parse(previousState).previewState;
    	} else {
    		previousState = JSON.parse(previousState).generatorState;
    	}

      if (previousState) {
        // Loop through previous state and only add ones 
        // of the values of same type as default state
        state = extendSameTypes(state, previousState);

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
  return new Promise((resolve, reject = () => {}) => {
    var image = new Image();
    image.src = src;

    image.onload = () => {
      const { width, height } = image;
      image = null;
      resolve({ width, height });
    }

  	image.onerror = () => {
  		reject('Error loading image');
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
	var maxHeight = window.innerHeight - rect.top - 30;
  const minWidth = 80;
  const minHeight = 80;
	const presetBar = document.querySelector('#preset-bar');

	// Prevent image from going behind preset bar
	if (presetBar) {
	  maxHeight -= presetBar.offsetHeight;
	}

  // Image already fits within space without resizing
	if (width <= maxWidth && width >= minWidth && height <= maxHeight && height >= maxHeight) {
		return { width, height };
	}

  // Image is too small, enlarge
  if (width < minWidth || height < minHeight) {
    if (width >= height) {
      height = Math.round(height * minWidth / width);
      width = minWidth;

      // If resized image is not tall enough resize again 
      if (height < minHeight) {
        width = Math.round(width * minHeight / height);
        height = minHeight;
      }
    } else {
      width = Math.round(width * minHeight / height);
      height = minHeight;

      // Image resized image is not wide enough resize again
      if (width < minWidth) {
        height = Math.round(height * minWidth / width);
        width = minWidth;
      }
    }
  }

  // Image is too large, shrink down
  if (width > maxWidth || height > maxHeight) {
    if (maxWidth >= maxHeight) {
      height = Math.round(height * maxWidth / width);
      width = maxWidth;

      // If resized image is tall resize again
      if (height > maxHeight) {
        width = Math.round(width * maxHeight / height);
        height = maxHeight;
      }
    } else {
      width = Math.round(width * maxHeight / height);
      height = maxHeight;

      // If resized image is too wide resize again
      if (width > maxWidth) {
        height = Math.round(height * maxWidth / width);
        width = maxWidth;
      }
    }
  }

	return { width, height };
}

export function bytesToSize(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return 'n/a';
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
  if (i === 0) return bytes + ' ' + sizes[i];
  return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
};







