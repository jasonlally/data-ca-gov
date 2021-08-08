import { GetServerSideProps } from 'next';
import { useQuery } from '@apollo/client';
import filesize from 'filesize';
import Head from 'next/head';
import { initializeApollo } from '../../../../../lib/apolloClient';
import Nav from '../../../../../components/home/Nav';
import About from '../../../../../components/resource/About';
import DataExplorer from '../../../../../components/resource/DataExplorer';
import { GET_RESOURCES_QUERY } from '../../../../../graphql/queries';
import Button from '../../../../../components/_shared/ui/Button';
import { useRef, useState, useEffect } from 'react';
import debounce from 'lodash.debounce';

const Resource: React.FC<{ variables: any }> = ({ variables }) => {
  const { data, loading } = useQuery(GET_RESOURCES_QUERY, { variables });
  const headerEl = useRef(null);
  const previewHeadEl = useRef(null);
  const [relativeHeight, setRelativeHeight] = useState(0);

  useEffect(() => {
    const debouncedHandleResize = debounce(function handleResize() {
      if (
        headerEl != null &&
        headerEl.current != null &&
        previewHeadEl != null &&
        previewHeadEl.current != null
      ) {
        setRelativeHeight(
          headerEl.current.offsetHeight + previewHeadEl.current.offsetHeight
        );
      }
      window.addEventListener('resize', debouncedHandleResize);
      return (_) => {
        window.removeEventListener('resize', debouncedHandleResize);
      };
    }, 1000);

    debouncedHandleResize();
  });

  if (loading) return <div>Loading</div>;
  const result = data.dataset.result;
  // Find right resource
  const resource = result.resources.find(
    (item) => item.id === variables.resource
  );

  return (
    <>
      <Head>
        <title>California Open Data | {resource.title || resource.name}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="bg-primary-background" ref={headerEl}>
        <div className="container mx-auto">
          <Nav />
        </div>
      </header>
      <main className="p-6">
        <div id="resource-preview-head" ref={previewHeadEl}>
          <h1 className="text-4xl font-semibold text-primary mb-2 inline-block mr-2 align-middle">
            {resource.title || resource.name}
          </h1>
          <Button
            className="align-middle"
            href={resource.url}
            color="primary"
            textColor="white"
            icon="arrow-circle-down"
            label={`Download ${filesize(resource.size, { bits: true })}`}
          />
          <Button
            className="align-middle"
            href="/"
            color="primary"
            textColor="white"
            icon="robot"
            label="API"
          />
        </div>
        <DataExplorer
          variables={{ id: resource.id }}
          heightOffset={relativeHeight}
        />
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
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
