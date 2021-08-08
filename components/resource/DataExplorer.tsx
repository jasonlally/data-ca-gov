import { useState, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { ErrorMessage } from '../_shared';
import { GET_DATASTORE_QUERY } from '../../graphql/queries';
import { Table } from '../_shared';

const DataExplorer: React.FC<{ variables: any; heightOffset: number }> = ({
  variables,
  heightOffset,
}) => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(100);
  const [resourceID] = useState(variables.id);
  variables.limit = perPage;
  variables.offset = perPage * (page - 1);

  const { loading, error, data, fetchMore } = useQuery(GET_DATASTORE_QUERY, {
    variables,
    // Setting this value to true will make the component rerender when
    // the "networkStatus" changes, so we are able to know if it is fetching
    // more data
    notifyOnNetworkStatusChange: true,
  });

  const requestData = (p, pp) => {
    setPage(p);
    setPerPage(pp);

    fetchMore({
      variables: {
        limit: perPage,
        offset: perPage * (page - 1),
      },
    });
  };

  const columns = useMemo(() => {
    if (loading || error) return [];
    return data.datastore.result.fields.map((field) => {
      return { Header: field.id, accessor: field.id };
    });
  }, [loading, error, data]);

  const rows = useMemo(() => {
    if (loading || error) return [];
    return data.datastore.result.records;
  }, [loading, error, data]);

  if (error) return <ErrorMessage message="Error loading dataset." />;

  const total =
    data && data.datastore.result.total > 0
      ? Math.ceil(data.datastore.result.total / perPage)
      : 0;

  const style = {
    height: 'calc(100vh - ' + heightOffset + 'px - 3rem)',
  };

  return (
    <div className="relative overflow-auto" style={style}>
      <Table
        loading={loading}
        columns={columns}
        data={rows}
        setPage={setPage}
        setPerPage={setPerPage}
        perPage={perPage}
        currentPage={page}
        totalPages={total}
        requestData={requestData}
      />
    </div>
  );
};

export default DataExplorer;
