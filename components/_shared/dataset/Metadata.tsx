import React from 'react';
import filesize from 'filesize';
import sanitizeHtml from 'sanitize-html';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import Topic from '../ui/Topic';
import SupportingFile from '../../dataset/SupportingFile';
import dateFormat from 'dateformat';
import frequencyMap from '../../../utils/frequency';
import Button from '../ui/Button';

/**
 * Metadata component receives two arguments.
 * @param {Object} descriptor A Frictionless datapackage descriptor object with the following fields:
 * {
 *  title: "Title of the data package",
 *  length: "The number of resources present in the data package"
 *  datasetSize: The combined size of the data package resources
 *  format: The format of resources in the dataset. e.g csv, json, excel
 *  created: The date the dataset was created
 *  updated: The date the dataset was last updated
 *  licence: The licence of the dataset
 *  sources: An array of the data set sources
 * }
 * @param {Array} resources A Frictionless datapackage resource array
 * @returns React Component
 */

export interface Descriptor {
  title: string;
  length: number;
  datasetSize: number;
  format: string;
  created: string;
  updated: string;
  licence: string;
  sources: Array<any>;
  accrualPeriodicity: string;
  organization: any;
  groups: Array<any>;
  notes: string;
  contact_email: string;
  contact_name: string;
  metadata_created: string;
  metadata_modified: string;
}

type Props = {
  descriptor: Descriptor;
  resources: Array<any>;
};

const Metadata: React.FC<Props> = ({ descriptor, resources }) => {
  const supportTypes = [
    'docx',
    'doc',
    'pdf',
    'xls',
    'xlsx',
    'ppt',
    'pptx',
    'jpeg',
    'jpg',
    'png',
    'gif',
  ];
  const supportFiles = resources.filter((item) =>
    supportTypes.includes(item.format.toLowerCase())
  );
  const supportFilesList = supportFiles.map((file, idx) => (
    <SupportingFile
      key={idx}
      format={file.format.toLowerCase()}
      url={file.url}
      size={filesize(file.size, { bits: true })}
      name={file.name}
      updated={file.last_modified}
    />
  ));
  const description = sanitizeHtml(descriptor.notes, {
    allowedTags: ['p', 'strong', 'b', 'em'],
  });
  return (
    <>
      <div id="key-info" className="z-0">
        <div className="mb-2">
          Published by{' '}
          <span className="font-bold">{descriptor.organization.title}</span>
        </div>
        <Topic topic={descriptor.groups[0].display_name} />
        <h2 className="text-2xl">Description</h2>
        <div className="prose mb-4">
          <ReactMarkdown>{description}</ReactMarkdown>
        </div>
        {supportFilesList.length > 0 && (
          <div className="mb-4">
            <h2 className="text-2xl">Supporting Files</h2>
            {supportFilesList}
          </div>
        )}
        <div className="mb-4">
          <h2 className="text-2xl">Additional Information</h2>
          <div className="bg-accent-light p-2 my-2">
            <span className="font-bold">Released in the Public Domain</span>
            <br />
            Data and supporting files released under the U.S. Public Domain.{' '}
            <br />
            Read more about your rights to this data under the public domain.
          </div>
          <div className="leading-7 my-2">
            <p>
              This dataset is updated{' '}
              {frequencyMap[descriptor.accrualPeriodicity]}
            </p>
            <p>
              This dataset was first created on{' '}
              {dateFormat(descriptor.metadata_created, 'longDate')}
            </p>
            <p>
              Description and additional information were last modified on{' '}
              {dateFormat(descriptor.metadata_modified, 'longDate')}
            </p>
          </div>
          <Button
            href={`mailto:${descriptor.contact_email}?subject=Question about ${descriptor.title} on data.ca.gov&body=Hello ${descriptor.contact_name},`}
            label="Contact the data steward"
            color="accent-neutral"
            textColor="gray-700"
            icon="envelope-open-text"
          />
        </div>
      </div>
    </>
  );
};

export default Metadata;
