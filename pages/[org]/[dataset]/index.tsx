import { GetServerSideProps } from 'next';
import { useQuery } from '@apollo/client';
import Head from 'next/head';
import { initializeApollo } from '../../../lib/apolloClient';
import Nav from '../../../components/home/Nav';
import About from '../../../components/dataset/About';
import Resources from '../../../components/dataset/Resources';
import {
  GET_DATASET_QUERY,
  GET_RESOURCES_QUERY,
} from '../../../graphql/queries';

const Dataset: React.FC<{ variables: any }> = ({ variables }) => {
  const { data, loading } = useQuery(GET_DATASET_QUERY, { variables });
  if (loading) return <div>Loading</div>;
  const { result } = data.dataset;

  return (
    <>
      <Head>
        <title>California Open Data | {result.title || result.name}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="bg-primary-background">
        <div className="container mx-auto">
          <Nav />
        </div>
      </header>
      <main className="p-6">
        <div className="container mx-auto">
          <h1 className="text-3xl font-semibold text-primary mb-0">
            {result.title || result.name}
          </h1>
          <div className="flex flex-wrap -mx-2 overflow-hidden">
            <div className="mb-2 px-2 w-1/2 overflow-hidden z-0">
              <About variables={variables} />
            </div>
            <div className="mb-2 px-2 w-1/2 z-0">
              <Resources variables={variables} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const apolloClient = initializeApollo();
  const variables = {
    id: context.query.dataset,
  };

  await apolloClient.query({
    query: GET_DATASET_QUERY,
    variables,
  });

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

export default Dataset;
