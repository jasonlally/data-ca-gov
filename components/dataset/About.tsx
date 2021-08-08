import { useQuery } from '@apollo/client';
import { ErrorMessage } from '../_shared';
import { GET_DATAPACKAGE_QUERY } from '../../graphql/queries';
import Metadata from '../_shared/dataset/Metadata';

const About: React.FC<{ variables: any }> = ({ variables }) => {
  const { loading, error, data } = useQuery(GET_DATAPACKAGE_QUERY, {
    variables,
    // Setting this value to true will make the component rerender when
    // the "networkStatus" changes, so we are able to know if it is fetching
    // more data
    notifyOnNetworkStatusChange: true,
  });

  if (error) return <ErrorMessage message="Error loading dataset." />;
  if (loading) return <div>Loading</div>;

  const { result } = data.dataset;
  return <Metadata descriptor={result} resources={result.resources} />;
};

export default About;
