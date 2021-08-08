import React from 'react';
import PropTypes from 'prop-types';

/**
 * Displays the total search result
 * @param {object} props
 * {
 *  count: The total number of search results
 * }
 * @returns React Component
 */
const Total = ({ count, modifier }) => {
  let text = count;
  if (modifier) {
    text = count + ' ' + modifier;
  }
  return <div className="inline-block">{text}</div>;
};

Total.propTypes = {
  count: PropTypes.number.isRequired,
  modifier: PropTypes.string,
};

export default Total;
