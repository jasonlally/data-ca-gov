import { useQuery } from '@apollo/client';
import { ErrorMessage } from '.';
import { GET_TOTAL_COUNT_QUERY } from '../../graphql/queries';
import ItemTotal from './search/Total';

const Total: React.FC<{ variables: any; modifier?: string }> = ({
  variables,
  modifier,
}) => {
  const { loading, error, data } = useQuery(GET_TOTAL_COUNT_QUERY, {
    variables,
    // Setting this value to true will make the component rerender when
    // the "networkStatus" changes, so we are able to know if it is fetching
    // more data
    notifyOnNetworkStatusChange: true,
  });

  if (error) return <ErrorMessage message="Error loading search results." />;
  if (loading) return <div>Loading</div>;

  const { result } = data.search;

  return <ItemTotal count={result.count} modifier={modifier} />;
};

export default Total;
