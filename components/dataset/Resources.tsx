/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/display-name */
import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { ErrorMessage } from '../_shared';
import { GET_RESOURCES_QUERY } from '../../graphql/queries';
import filesize from 'filesize';
import Button from '../_shared/ui/Button';
import Link from 'next/link';
import dateFormat from 'dateformat';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tab } from '@headlessui/react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const Resources: React.FC<{ variables: any }> = ({ variables }) => {
  const { loading, error, data } = useQuery(GET_RESOURCES_QUERY, {
    variables,
    // Setting this value to true will make the component rerender when
    // the "networkStatus" changes, so we are able to know if it is fetching
    // more data
    notifyOnNetworkStatusChange: true,
  });

  if (error) return <ErrorMessage message="Error loading dataset." />;
  if (loading) return <div>Loading</div>;

  const [copied, setCopied] = useState(false);
  const [value, setValue] = useState('');
  const { result } = data.dataset;
  const dataTypes = [
    'csv',
    'kml',
    'geojson',
    'xml',
    'shapefile',
    'json',
    'zip',
    'ogc wms',
    'ogc wfs',
    'rdf',
    'wms',
    'txt',
    'shp',
    'gzip',
    'tar',
  ];
  const dataFiles = result.resources.filter((item) =>
    dataTypes.includes(item.format.toLowerCase())
  );
  const dataFilesList = dataFiles.map((file, idx) => {
    const apiLink = `https://data.ca.gov/api/3/action/datastore_search?resource_id=${file.id}&limit=5`;
    const apiLink2 = `https://data.ca.gov/api/3/action/datastore_search_sql?sql=SELECT * from "${file.id}" LIMIT 5`;
    const apiLink3 = `https://data.ca.gov/datastore/odata3.0/${file.id}`;
    const name =
      file.name === file.format || file.name === 'Shapefile'
        ? result.title + ' ' + file.name
        : file.name;
    return (
      <div key={idx} className="mb-2">
        <div>
          [{file.format}]{' '}
          <a className="underline text-blue-600" href={file.url}>
            <FontAwesomeIcon icon={'arrow-circle-down'} /> {name}
          </a>{' '}
          {file.size > 0 && '(' + filesize(file.size, { bits: true }) + ')'}
        </div>
        <div className="text-sm italic">
          File last modified on {dateFormat(file.last_modified, 'longDate')}
        </div>
        <div>
          <Link
            href={`/@${result.organization.name}/${result.name}/r/${file.id}`}
            passHref
          >
            <Button
              icon="eye"
              label="Preview"
              color="primary"
              textColor="white"
            />
          </Link>
          <Button icon="robot" label="API" color="primary" textColor="white">
            <div className="w-full p-2 bg-white">
              <Tab.Group>
                <Tab.List className="flex p-1 space-x-1 bg-yellow-100 bg-opacity-90">
                  <Tab className="w-full py-2.5 text-sm leading-5 font-medium text-blue-700 focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60 bg-white shadow">
                    Simple Query
                  </Tab>
                  <Tab className="w-full py-2.5 text-sm leading-5 font-medium text-blue-700 focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60">
                    SQL Query
                  </Tab>
                  <Tab className="w-full py-2.5 text-sm leading-5 font-medium text-blue-700 focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60">
                    OData
                  </Tab>
                </Tab.List>
                <Tab.Panels>
                  <Tab.Panel>
                    <p>
                      {
                        'Use the simple query web API to retrieve data with a set of basic parameters. Start by copying the endpoint below.'
                      }
                    </p>
                    <p className="font-bold">{'API Endpoint'}</p>
                    <div className="flex items-center">
                      <input
                        className="w-full bg-gray-200 appearance-none border-2 border-gray-200 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-accent-bright"
                        defaultValue={apiLink}
                        readOnly
                        onClick={(e) =>
                          (e.target as HTMLInputElement).select()
                        }
                        onFocus={(e) =>
                          (e.target as HTMLInputElement).select()
                        }
                      />
                      <CopyToClipboard
                        text={value}
                        onCopy={() => {
                          setValue(apiLink);
                          setCopied(true);
                        }}
                      >
                        <Button
                          icon="copy"
                          label="Copy"
                          color="primary"
                          textColor="white"
                          className="flex-shrink-0 w-24 py-2 last:mr-0"
                        />
                      </CopyToClipboard>
                    </div>
                    <a
                      className="underline text-blue-600"
                      href="https://docs.ckan.org/en/latest/maintaining/datastore.html#ckanext.datastore.logic.action.datastore_search"
                    >
                      {'Read the documentation'}
                    </a>
                  </Tab.Panel>
                  <Tab.Panel>
                    {'Get started below'}
                    <div className="flex items-center">
                      <input
                        className="w-full bg-gray-200 appearance-none border-2 border-gray-200 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-accent-bright"
                        defaultValue={apiLink2}
                        readOnly
                      />
                      <CopyToClipboard
                        text={value}
                        onCopy={() => {
                          setValue(apiLink2);
                          setCopied(true);
                        }}
                      >
                        <Button
                          icon="copy"
                          label="Copy"
                          color="primary"
                          textColor="white"
                          className="flex-shrink-0 w-24 py-2 last:mr-0"
                        />
                      </CopyToClipboard>
                    </div>
                    {'And more...'}
                  </Tab.Panel>
                  <Tab.Panel>
                    {'Get started below'}
                    <div className="flex items-center">
                      <input
                        className="w-full bg-gray-200 appearance-none border-2 border-gray-200 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-accent-bright"
                        defaultValue={apiLink3}
                        readOnly
                      />
                      <CopyToClipboard
                        text={value}
                        onCopy={() => {
                          setValue(apiLink3);
                          setCopied(true);
                        }}
                      >
                        <Button
                          icon="copy"
                          label="Copy"
                          color="primary"
                          textColor="white"
                          className="flex-shrink-0 w-24 py-2 last:mr-0"
                        />
                      </CopyToClipboard>
                    </div>
                    {'And more...'}
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>
            </div>
          </Button>
        </div>
      </div>
    );
  });

  return (
    <div className="mb-4">
      <h2 className="text-2xl">Data Files</h2>
      {dataFilesList}
    </div>
  );
};

export default Resources;
