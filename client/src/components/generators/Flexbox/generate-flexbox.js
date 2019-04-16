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

  const uniqueItemStyles = [];
  const uniqueItemSelectors = [];
  const uniqueItemValues = [];

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

      // let hasUniqueValues = false;
      const uniqueValues = [];

      const childStyles = mapObject({ ...restStyles }, (_value, key) => {
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
            // const valueIndex = styles.values.indexOf(value);

            // Another child item uses this same style
            if (data.values.includes(value)) {
              data.styles = data.styles.map(style => {
                if (style.value === value) style.selector += `,\n${selector}`;
                return style;
              });
            } else {
              data.values.push(value);
              data.styles.push({ selector, value: value });
            }
          }


          const style = {};
          style[key] = value;

          uniqueValues.push(style);
          // hasUniqueValues = true;
          // console.log(key, newValue);
        }

        return value;
      });

      // console.log(uniqueValues)

      // if (hasUniqueValues) {
      // This item has some different css than the default item styles
      if (uniqueValues.length) {
        // let selector;

        // if (childIndex === 0) {
        //   selector = `.item:first-child`;
        // } else if (childIndex === childElements.length - 1) {
        //   selector = `.item:last-child`;
        // } else {
        //   selector = `.item:nth-child(${childIndex + 1})`;
        // }

        // Check if this item's styles are the same as any other 
        // child so we can combine them in the output CSS
        const styles = JSON.stringify(uniqueValues);
        const styleIndex = uniqueItemStyles.indexOf(styles);

        if (styleIndex === -1) {
          // These styles are not shared by another child item
          uniqueItemStyles.push(styles);
          uniqueItemSelectors.push(selector);
          uniqueItemValues.push(childStyles);
        } else {
          // Another child item uses the same styles, so combine the selectors
          uniqueItemSelectors[styleIndex] = `${uniqueItemSelectors[styleIndex]},\n${selector}`;
        }



        // css.push(generateCSSString(childStyles, selector));
      }

      html.push('  <div class="item"></div>');
    });

    console.log(uniqueStyles)

    if (uniqueItemSelectors.length) {
      uniqueItemSelectors.forEach((selector, index) => {
        css.push(generateCSSString(uniqueItemValues[index], selector));
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