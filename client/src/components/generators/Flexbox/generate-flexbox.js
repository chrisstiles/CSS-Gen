import { each } from 'underscore';
import { generateCSSString } from '../../../util/helpers';

export default function generate({ containerStyles, itemStyles, childElements }, defaultState) {
  const html = [];
  const css = [];

  const { display, flexWrap, ...containerDefaults } = defaultState.containerStyles;
  css.push(generateCSSString(containerStyles, '.container', {
    flexWrap: 'nowrap',
    ...containerDefaults
  }));

  const itemCSS = generateCSSString(itemStyles, '.item', defaultState.itemStyles);
  if (itemCSS) css.push(itemCSS);

  const uniqueStyles = {};

  if (childElements.length) {
    childElements.forEach((child, childIndex) => {
      const { id, ...restStyles } = child;

      let selector;

      if (childIndex === 0) {
        selector = `.item:first-child`;
      } else if (childIndex === childElements.length - 1) {
        selector = `.item:last-child`;
      } else {
        selector = `.item:nth-child(${childIndex + 1})`;
      }

      each({ ...restStyles }, (_value, key) => {
        // We only output items for individual items
        // if their values are different than the default
        const value = itemStyles[key] === _value ? null : _value;

        if (value) {
          if (!uniqueStyles.hasOwnProperty(key)) {
            uniqueStyles[key] = {
              styles: [{ selector, value }],
              values: [value]
            }
          } else {
            const data = uniqueStyles[key];

            if (data.values.includes(value)) {
              // Another child item uses this same style
              data.styles = data.styles.map(style => {
                if (style.value === value) style.selector += `,\n${selector}`;
                return style;
              });
            } else {
              // This is the first child item with this style
              data.values.push(value);
              data.styles.push({ selector, value: value });
            }
          }
        }
      });

      html.push('  <div class="item"></div>');
    });
    
    // Group selectors that have similar styles
    if (Object.keys(uniqueStyles).length) {
      const selectorStyles = {};

      each(uniqueStyles, (data, property) => {
        data.styles.forEach(({ selector, value }) => {
          if (!selectorStyles.hasOwnProperty(selector)) {
            selectorStyles[selector] = {};
          }

          selectorStyles[selector][property] = value;
        });
      });

      const selectorGroups = Object.keys(selectorStyles).sort((a, b) => {
        const last = '.item:last-child';
        if (a.indexOf(last) === 0) {
          return 1;
        }

        if (b.indexOf(last) === 0) {
          return -1;
        }

        if (a < b) {
          return -1;
        }

        if (a > b) {
          return 1;
        }

        return 0;
      });

      selectorGroups.forEach((selectors) => {
        css.push(generateCSSString(selectorStyles[selectors], selectors));
      });
    }

    html.unshift('<div class="container">');
    html.push('</div>');

  } else {
    html.push('<div class="container"></div>');
  }

  return [
    { language: 'css', code: css.join('\n') },
    { language: 'html', code: html.join('\n') }
  ];
}