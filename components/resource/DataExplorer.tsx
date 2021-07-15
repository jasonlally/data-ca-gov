import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { ErrorMessage } from '../_shared';
import { GET_DATASTORE_QUERY } from '../../graphql/queries';
import { Table } from '../_shared';

const DataExplorer: React.FC<{ variables: any }> = ({ variables }) => {
  const { loading, error, data } = useQuery(GET_DATASTORE_QUERY, {
    variables,
    // Setting this value to true will make the component rerender when
    // the "networkStatus" changes, so we are able to know if it is fetching
    // more data
    notifyOnNetworkStatusChange: true,
  });
  
  const columns = React.useMemo(() => {
    if (loading || error) return null;
    return data.datastore.result.fields.map(field => {
      return {Header: field.id, accessor: field.id}
    })
  },[loading, error, data]);

  const rows = React.useMemo(() => {
    if (loading || error) return null;
    return data.datastore.result.records;
  }, [loading, error, data]);

  if (error) return <ErrorMessage message="Error loading dataset." />;
  if (loading) return <div>Loading</div>;

  return <Table columns={columns} data={rows} />;
};

export default DataExplorer;
