import _ from 'underscore';
import { defaultPreviewState, defaultPreviewStateTypes } from '../components/Preview';
import tinycolor from 'tinycolor2';
import { NotificationManager } from 'react-notifications';
import { 
	getGlobalState as _getGlobalState,
	getGlobalDefaults as _getGlobalDefaults,
	updateGlobalState as _updateGlobalState,
	getGlobalVariable as _getGlobalVariable,
	setGlobalVariable as _setGlobalVariable,
	startLoading as _startLoading,
	finishLoading as _finishLoading
} from '../components/App';

export function addNotification(type, message) {
	NotificationManager[type](message, null, 4500);
}

export function getNotificationTypes() {
	return {
		info: 'info',
		warning: 'warning',
		success: 'success',
		error: 'error'
	};
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

export function startLoading(name) {
	return _startLoading(name);
}

export function finishLoading(name) {
	return _finishLoading(name);
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
		// Do nothing if type is allowed to be null
		if (value === null) {
			return;
		}
		
		// Object does not have this key
		if (!object.hasOwnProperty(key)) {
			correctShape = false;
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

export function getPersistedState(defaultState) {
	if (!window.localStorage || !getGlobalState().persistGeneratorState) {
    return defaultState;
  }

  // Generator specific state
	const path = window.location.pathname;
	
	if (window.localStorage.hasOwnProperty(path)) {
    let previousState = window.localStorage.getItem(path);

    try {
			previousState = JSON.parse(previousState);
			
			// Only use a persisted state if it is recent
			const timestamp = previousState.timestamp;
			const daysLimit = 365;

			if (timestamp) {
				const today = new Date();
				const timeDifference = Math.abs(today.getTime() - timestamp);
				const dayDifference = Math.ceil(timeDifference / (1000 * 3600 * 25));

				if (dayDifference > daysLimit) {
					return defaultState;
				}
			}

      if (previousState) {
				const { generatorState = {}, previewState = {} } = previousState;
				previousState = { ...generatorState, previewState: { ...previewState }  };
        // Loop through previous state and only add ones 
				// of the values of same type as default state
				return extendSameTypes(_.extend({}, defaultState), previousState);
      }
    } catch(e) {
      console.log(e);
    }
	}
	
  return defaultState;
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

export function getState(_defaultState, _stateTypes, isDefaultPreview) {
	if (!_defaultState.previewState) {
		_defaultState.previewState = {};
		_stateTypes.previewState = {};
	}

	if (isDefaultPreview) {
		const previewState = _.extend({}, defaultPreviewState, _defaultState.previewState);
		_defaultState.previewState = previewState;

		const previewStateTypes = _.extend({}, defaultPreviewStateTypes, _stateTypes.previewState);
		_stateTypes.previewState = previewStateTypes;
	}

	if (!_defaultState.previewState.canvasColor) {
		_defaultState.previewState.canvasColor = 'transparent';
		_stateTypes.previewState.canvasColor = String;
	}

	const defaultState = _.extend({}, _defaultState);
	const stateTypes = _.extend({}, _stateTypes);
	const state = getPersistedState(defaultState);

	if (isValidState(state, stateTypes)) {
		return { ...JSON.parse(JSON.stringify(state)), defaultState };
	} else {
		return { ...defaultState, defaultState };
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

export function generateCSSString(css, selector, defaults = {}) {
	const cssString = [];
	const indent = selector ? '  ' : '';

	_.each(css, (value, key) => {
		if ((value || value === 0) && defaults[key] !== value) {
			key = jsToCss(key);
			const property = `${indent}${key}: ${value};`;
			cssString.push(property);
		}
	});

	if (selector && cssString.length) {
		cssString.unshift(`${selector} {`);
		cssString.push('}\n');
	}

	return cssString.join('\n');
}

export function stripZeroUnits(str) {
	return str.replace(/\b0px/g, '0');
}

export function formatCode(code, language = 'css') {
	code = code.trim();
	const isCSS = language.toLowerCase() === 'css';

	if (isCSS) {
		code = stripZeroUnits(code);

		// CSS does not contain any selectors
		// so we can left justify everything
		if (!code.includes('{')) {
			return code.replace(/^\s+/mg, '');
		}
	}

	// Shift each line over to normalize indentation
	let lines = code.split('\n');

	// Find the number of indents lines are shifted by
	const closingTag = isCSS ? '}' : '</';
	const closingTagTest = new RegExp(`\\s+${closingTag}`)
	let tabShift = 0;

	for (let i = 1; i < lines.length; i++) {
		if (lines[i].match(closingTagTest)) {
			tabShift = lines[i].match(/\s/g).length;
			break;
		}
	}

	if (!tabShift) {
		return code;
	}

	lines = lines.map(line => {
		const tabs = line.match(/^(\s)+/);

		if (!tabs) {
			return line;
		}

		line = line.trim();

		const newTabCount = tabs[0].length - tabShift;
		if (newTabCount <= 0) {
			return line;
		}

		const tabString = new Array(newTabCount + 1).join(' ');

		return tabString + line;
	});

	return lines.join('\n');
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
      return 204;
    } else {
      return 244;
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

	const bottomContent = document.querySelector('#bottom-content-wrapper');
	if (bottomContent) {
		height -= bottomContent.offsetHeight;
	}

	// Adjust height based on main content padding
	height -= 60;

	return height;
}

// Returns a Promise that resolves with the image dimensions
export function getNaturalImageSize(src) {
  return new Promise((resolve, reject) => {
    let image = new Image();
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

export function getImageSize(width, height) {
	const canvas = document.querySelector('#canvas');
	if (!canvas) return { width, height };

	const rect = canvas.getBoundingClientRect();
	const offset = 30;
	const minWidth = 80;
	const minHeight = 80;
	const maxWidth = rect.width - (offset * 2);
	const maxHeight = rect.height - (offset * 2);

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
}

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

export function clone(obj) {
	return JSON.parse(JSON.stringify(obj));
}

export function clearSelection() {
	if (window.getSelection) { 
		window.getSelection().removeAllRanges(); 
	} else if (document.selection) { 
		document.selection.empty(); 
	}
}

export function isSameOrChild(child, parent) {
	return child === parent || parent.contains(child);
}

export function getBorderColor(backgroundColor, defaultColor = null) {
	if (backgroundColor === 'transparent') backgroundColor = '#fdfdfd';
	const color = tinycolor(backgroundColor).clone();
	
	if (color) {
		const luminance = color.getLuminance();
		const brightness = color.getBrightness();

		if (luminance < .58 && brightness < 200) {
			return color.setAlpha(.3).toRgbString();
		}
	}

	return defaultColor;
}

// Checks any props besides children have changed
export function propsHaveChanged(prevProps, currentProps) {
	const { children: prevChildren, ...prev } = prevProps;
	const { children: currentChildren, ...current } = currentProps;
	return !_.isEqual({ ...prev }, { ...current });
}

export function disabledTouchmove() {
	setGlobalVariable(true, 'touchmoveDisabled');
}

export function enableTouchmove() {
	setGlobalVariable(false, 'touchmoveDisabled');
}

export function getEventPosition(e) {
	let x, y;

	if (e.type.toLowerCase().includes('touch')) {
		const target = e.targetTouches[0];
		x = target.clientX;
		y = target.clientY;
	} else {
		x = e.clientX;
		y = e.clientY;
	}

	return { x, y };
}


