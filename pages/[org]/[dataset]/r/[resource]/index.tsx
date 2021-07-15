import { GetServerSideProps } from 'next';
import { useQuery } from '@apollo/react-hooks';
import filesize from 'filesize';
import Head from 'next/head';
import { initializeApollo } from '../../../../../lib/apolloClient';
import Nav from '../../../../../components/home/Nav';
import About from '../../../../../components/resource/About';
import DataExplorer from '../../../../../components/resource/DataExplorer';
import { GET_RESOURCES_QUERY } from '../../../../../graphql/queries';
import Button from '../../../../../components/_shared/ui/Button';

const Resource: React.FC<{ variables: any }> = ({ variables }) => {
  const { data, loading } = useQuery(GET_RESOURCES_QUERY, { variables });

  if (loading) return <div>Loading</div>;
  const result = data.dataset.result;
  // Find right resource
  const resource = result.resources.find(
    (item) => item.id === variables.resource
  );
  
  return (
    <>
      <Head>
        <title>Portal | {resource.title || resource.name}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="bg-primary-background">
        <div className="container mx-auto">
          <Nav />
        </div>
      </header>
      <main className="p-6">
        <h1 className="text-3xl font-semibold text-primary mb-2">
          {resource.title || resource.name}
        </h1>
        <Button href={resource.url} icon="arrow-circle-down" label={`Download ${filesize(resource.size, {bits: true})}`} />
        <Button href="/" icon="robot" label="API" />
        <DataExplorer variables={{id: resource.id}} />
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  console.log(context)
  const apolloClient = initializeApollo();
  const variables = {
    id: context.query.dataset,
    resource: context.query.resource,
  };

  await apolloClient.query({
    query: GET_RESOURCES_QUERY,
    variables,
  });

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
      variables,
    },
  };
};

export default Resource;
