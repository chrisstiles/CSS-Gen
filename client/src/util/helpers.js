import _ from 'underscore';

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
		key = jsToCss(key);
		cssString += ` ${key}: ${value};`;
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