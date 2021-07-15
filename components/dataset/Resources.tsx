/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/display-name */
import { useQuery } from '@apollo/react-hooks';
import { ErrorMessage } from '../_shared';
import { GET_RESOURCES_QUERY } from '../../graphql/queries';
import filesize from 'filesize';
import Button from '../_shared/ui/Button';
import Link from 'next/link';


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

  const { result } = data.dataset;
  console.log(result)
  const dataTypes = ['csv', 'kml', 'geojson', 'xml', 'shapefile', 'json', 'zip', 'ogc wms']
  let dataFiles = result.resources.filter(item => dataTypes.includes(item.format.toLowerCase()))
  const dataFilesList = dataFiles.map((file, idx) => {
    return (
    <div key={idx} className="mb-2">
      <div>[{file.format}] <a className="underline" href={file.url}>{file.name}</a> ({filesize(file.size, {bits: true})})</div>
      <div>
        <Link href={`/@${result.organization.name}/${result.name}/r/${file.id}`} passHref>
          <Button icon="eye" label="Preview" />
        </Link>
        <Button href={file.url} icon="arrow-circle-down" label="Download" />
        <Button href="/" icon="robot" label="API" />
      </div>
    </div>)
  })

  return (
    <div className="mb-4">
      <h2 className="text-2xl">Data Files</h2>
      {dataFilesList}
    </div>
  );
};

export default Resources;
