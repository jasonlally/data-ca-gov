import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { initializeApollo } from '../lib/apolloClient';
import SearchForm from '../components/search/Form';
import { GET_TOTAL_COUNT_QUERY, SEARCH_QUERY } from '../graphql/queries';
import { loadNamespaces } from './_app';
import useTranslation from 'next-translate/useTranslation';
import NavBar from '../components/home/Nav';
import Total from '../components/_shared/Total';
import RecentDataset from '../components/home/Recent';

const Home: React.FC<{ variables: any; locale: any; locales: any }> = ({
  variables,
  locale,
  locales,
}) => {
  const { t } = useTranslation();
  return (
    <>
      <Head>
        <title>{t(`common:title`)}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="bg-primary-background">
        <div className="container mx-auto">
          <NavBar />
        </div>
      </header>
      <main>
        <section className="flex justify-center items-center flex-col pt-20 pb-20 lg:flex-row bg-primary">
          <div className="container mx-auto">
            <div>
              <h1 className="text-md font-bold mb-3 w-4/5 text-white">
                Search{' '}
                <span className="text-accent-bright">
                  <Total variables={variables} />
                </span>{' '}
                datasets from the State of California
              </h1>
              <SearchForm />
            </div>
          </div>
        </section>
        <section>
          <div className="container mx-auto">
            <RecentDataset />
          </div>
        </section>
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  locales,
}) => {
  const apolloClient = initializeApollo();
  await apolloClient.query({
    query: SEARCH_QUERY,
    variables: {
      sort: 'metadata_created desc',
      rows: 3,
    },
  });

  const variables = {};
  await apolloClient.query({
    query: GET_TOTAL_COUNT_QUERY,
    variables,
  });

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
      _ns: await loadNamespaces(['common'], locale),
      locale,
      locales,
      variables,
    },
  };
};

export default Home;
