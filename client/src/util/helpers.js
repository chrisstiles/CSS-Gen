import _ from 'underscore';
import tinycolor from 'tinycolor2';
import { 
	addNotification as _addNotification, 
	notificationTypes,
	getGlobalState as _getGlobalState,
	getGlobalDefaults as _getGlobalDefaults,
	updateGlobalState as _updateGlobalState,
	getGlobalVariable as _getGlobalVariable,
	setGlobalVariable as _setGlobalVariable,
	setLoading as _setLoading
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

export function getGlobalVariable(name) {
	return _getGlobalVariable(name);
}

export function setGlobalVariable(value, name) {
	return _setGlobalVariable(value, name);
}

export function setLoading(loading) {
	return _setLoading(loading);
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

export function areSameType(a, b) {
	return getType(a) === getType(b);
}

export function getType(a) {
	if (a === null) {
		return 'null';
	}

	if (a === undefined) {
		return 'undefined';
	}

	if (_.isArray(a)) {
		return 'array';
	}

	const type = typeof a;

	if (type === 'function') {
		const types = ['String', 'Number', 'Boolean', 'Array', 'Object'];
		const name = a.name;

		if (types.indexOf(name) !== -1) {
			// Passed in variable type function
			return a.name.toLowerCase(); 
		} else {
			return name;
		} 
	}

	if (a === 'object') {
		const constructorName = type.constructor.name;

		if (constructorName) {
			if (constructorName === 'Object') {
				return 'object';
			} else {
				return constructorName;
			}
		}
	}

	return type;
}

export function isArrayOfType(array, correct) {
	// If array is empty it is not of valid type
	if (!array) {
		return false;
	}

	const value = array[0];
	const type = getType(correct);

	if (type === 'object') {
		return isObjectOfShape(value, correct);
	} else if (type === 'array') {
		var isValid = true;

		_.each(array, element => {
			if (!areSameType(element, correct[0])) {
				isValid = false;
				return;
			}
		});

		return isValid;
	} else {
		return areSameType(value, correct);
	}

}

export function isObjectOfShape(object, shape) {
	if (getType(object) !== 'object') {
		return false;
	}

	var correctShape = true;

	_.each(shape, (value, key) => {
		// Object does not have this key
		if (!object.hasOwnProperty(key)) {
			correctShape = false;
			return;
		}

		// Do nothing if type is allowed to be null
		if (value === null) {
			return;
		}

		const type = getType(value);

		// Variable is child object
		if (type === 'object') {
			if (!isObjectOfShape(object[key], value)) {
				correctShape = false;
				return;
			}
		}

		// Variable is array
		if (type === 'array') {
			if (!isArrayOfType(object[key], value)) {
				correctShape = false;
				return;
			}
		}

		if (!areSameType(value, object[key])) {
			correctShape = false;
			return;
		}
	});

	return correctShape;
}

export function isValidState(state, types) {
	if (!_.isObject(state)) {
		return false;
	}

	return isObjectOfShape(state, types);
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

export function replaceTinyColors(obj) {
	var returnObject = obj;

	const objectType = getType(obj);

	if (objectType === 'array') {
		returnObject = _.map(obj, element => {
			return replaceTinyColors(element);
		});
	}

	// Object is already tinycolor
	if (objectType === 'object') {
		if (obj.toHex) {
			return hexOrRgba(obj);
		}

	  returnObject = _.mapObject(obj, (value, key) => {
	  	const type = getType(value);

	  	if (type === 'object') {
	  		if (value.toHex) {
	  			// This is a tinycolor object
	  			return hexOrRgba(value);
	  		} else {
					return replaceTinyColors(value);
	  		}
	  	} else if (type === 'array') {
	  		return _.each(value, (element, index) => {
	  			return replaceTinyColors(element);
	  		})
	  	} else {
	  		// Not a tinycolor
	  		return value;
	  	}
	  });
	}

	return returnObject;
}

export function getState(_defaultState, stateTypes, isPreview) {
	const defaultState = JSON.parse(JSON.stringify(_defaultState));
	const state = getPersistedState(defaultState, isPreview);

	if (isValidState(state, stateTypes)) {
		return JSON.parse(JSON.stringify(state));
	} else {
		return defaultState;
	}
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

export function hexOrRgba(color, alpha) {
	const { _originalInput: input = '' } = color;

	if (color === 'transparent' || (typeof input === 'string' && input.toLowerCase() === 'transparent')) {
		return 'transparent';
	}

	color = tinycolor(color);

	if (alpha !== undefined) {
		color.setAlpha(alpha);
	}

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

export function getHeaderHeight() {
	const header = document.querySelector('#header');

	if (!header) {
		return 0;
	}

	var height = header.offsetHeight;

	const toolbar = document.querySelector('#toolbar');
	if (toolbar) {
		height += toolbar.offsetHeight;
	}

	return height;
}

export function getFullHeight() {
	const headerHeight = getHeaderHeight();

	if (!headerHeight) {
		return 0;
	}

	var height = window.innerHeight - headerHeight;

	const bottomContent = document.querySelector('#bottom-content');
	if (bottomContent) {
		height -= bottomContent.offsetHeight;
	}

	// Adjust height based on main content padding
	height -= 60;

	return height;
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
	const bottomContent = document.querySelector('#bottom-content');

	// Prevent image from going behind bottom content
	if (bottomContent) {
		maxHeight -= bottomContent.offsetHeight;
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

export function sameOrChild(el1, el2) {
	if (typeof el2 === 'string') {
		el2 = document.querySelector(el2);
	}

	if (!el2) {
		return false;
	}

	// Same element
	if (el1 === el2) {
		return true;
	}

	// Child element
	return el2.contains(el1);
}

export function valueToLabel(str) {
	return str.replace(/(-|^)([^-]?)/g, function (_, prep, letter) {
		return (prep && ' ') + letter.toUpperCase();
	});
}

export function selectText(node) {
	if (document.body.createTextRange) {
		const range = document.body.createTextRange();
		range.moveToElementText(node);
		range.select();
	} else if (window.getSelection) {
		const selection = window.getSelection();
		const range = document.createRange();
		range.selectNodeContents(node);
		selection.removeAllRanges();
		selection.addRange(range);
	} else {
		console.warn("Could not select text in node: Unsupported browser.");
	}
}



