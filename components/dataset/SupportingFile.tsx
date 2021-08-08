import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dateFormat from 'dateformat';

const filesIcons = {
  docx: 'file-word',
  doc: 'file-word',
  xlxm: 'file-excel',
  xlsx: 'file-excel',
  xls: 'file-excel',
  pdf: 'file-pdf',
  ppt: 'file-powerpoint',
  pptx: 'file-powerpoint',
};

const SupportingFile = ({ format, url, name, size, updated }) => {
  return (
    <div>
      <FontAwesomeIcon icon={filesIcons[format]} />{' '}
      <a className="underline text-blue-600" href={url}>
        {name}
      </a>
      {' (' + size + ')'} <br />
      <span className="text-sm italic ml-4">
        File last modified on {dateFormat(updated, 'longDate')}
      </span>
    </div>
  );
};

SupportingFile.propTypes = {
  format: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  size: PropTypes.string.isRequired,
  updated: PropTypes.string.isRequired,
};

export default SupportingFile;
