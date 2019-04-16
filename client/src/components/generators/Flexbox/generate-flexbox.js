import { mapObject } from 'underscore';
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

  if (childElements.length) {
    childElements.forEach((child, index) => {
      const { id, ...restStyles } = child;

      let hasUniqueValues = false;
      const childStyles = mapObject({ ...restStyles }, (value, key) => {
        // We only output items for individual items
        // if their values are different than the default
        const newValue = itemStyles[key] === value ? null : value;
        if (newValue) hasUniqueValues = true;
        return newValue;
      });

      if (hasUniqueValues) {
        let selector;

        if (index === 0) {
          selector = `.item:first-child`;
        } else if (index === childElements.length - 1) {
          selector = `.item:last-child`;
        } else {
          selector = `.item:nth-child(${index + 1})`;
        }

        css.push(generateCSSString(childStyles, selector));
      }

      html.push('  <div class="item"></div>');
    });

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