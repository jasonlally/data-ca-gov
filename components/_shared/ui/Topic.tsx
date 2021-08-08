import React from 'react';
import PropTypes from 'prop-types';
import Button from './Button';

const topicsIcons = {
  'Natural Resources': 'seedling',
  Water: 'water',
  'COVID-19': 'virus',
  'Health & Human Services': 'first-aid',
  'Economy and Demographics': 'book',
  Government: 'landmark',
  Transportation: 'bus-alt',
};

const Topic = ({ topic }) => (
  <Button
    href="/"
    label={topic}
    color="transparent"
    textColor="primary"
    icon={topicsIcons[topic]}
    className="border-2 border-primary"
  />
);

Topic.propTypes = {
  topic: PropTypes.string.isRequired,
};

export default Topic;
