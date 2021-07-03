/* eslint-disable react/display-name */
import { useQuery } from '@apollo/react-hooks';
import { ErrorMessage } from '../_shared';
import { GET_RESOURCES_QUERY } from '../../graphql/queries';
import { ResourceInfo } from 'portal';

const About: React.FC<{ variables: any }> = ({ variables }) => {
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
  const resource = result.resources.find(
    (item) => item.name === variables.resource
  );

  return <ResourceInfo resources={[resource]} />;
};

export default About;
