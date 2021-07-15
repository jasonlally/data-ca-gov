import { useMemo } from 'react';
import getConfig from 'next/config';
import { ApolloClient } from 'apollo-client';
import {
  InMemoryCache,
  NormalizedCache,
  NormalizedCacheObject,
} from 'apollo-cache-inmemory';
import { RestLink } from 'apollo-link-rest';
import { faCloudDownloadAlt } from '@fortawesome/free-solid-svg-icons';

let apolloClient:
  | ApolloClient<NormalizedCache>
  | ApolloClient<NormalizedCacheObject>;

const restLink = new RestLink({
  uri: getConfig().publicRuntimeConfig.DMS + '/api/3/action/',
  endpoints: {
    wordpress: `https://public-api.wordpress.com/rest/v1.1/sites/${getConfig().publicRuntimeConfig.CMS
      }/posts/slug:`,
    'wordpress-posts': `https://public-api.wordpress.com/rest/v1.1/sites/${getConfig().publicRuntimeConfig.CMS
      }/posts/`,
  },
  typePatcher: {
    Search: (data: any): any => {
      if (data.result != null) {
        data.result.__typename = 'SearchResponse';

        if (data.result.results != null) {
          data.result.results = data.result.results.map((item) => {
            if (item.organization != null) {
              item.organization.__typename = 'Organization';
            }
            item.organization = processOrganizationResult(item.organization);
            return { __typename: 'Package', ...item };
          });
        }
      }
      return data;
    },
    Response: (data: any): any => {
      if (data.result != null) {
        data.result.__typename = 'Package';
        if (data.result.organization != null) {
          data.result.organization.__typename = 'Organization';
          data.result.organization = processOrganizationResult(data.result.organization);
        }

        if (data.result.resources != null) {
          data.result.resources = data.result.resources.map((item) => {
            return { __typename: 'Resource', ...item };
          });
        }

        if (data.result.groups != null) {
          data.result.groups = data.result.groups.map((item) => {
            return { __typename: 'Group', ...item };
          });
        }
      }
      return data;
    },
    Data: (data: any): any => {
      if (data.result != null) {
        data.result.__typename = 'Data';
        if (data.result._links != null) {
          data.result._links.__typename = 'Links'
        }
      }
      return data;
    }
  },
});

function processOrganizationResult(organization) {
  organization.title = organization.title.replace("California", "").trim();
  if (organization.image_url != null) {
    organization.image_url = "https://data.ca.gov/uploads/group/" + organization.image_url;
  }
  return organization;
}

function createApolloClient() {
  return new ApolloClient({
    link: restLink,
    cache: new InMemoryCache(),
  });
}

export function initializeApollo(
  initialState = null
): ApolloClient<NormalizedCache> | ApolloClient<NormalizedCacheObject> {
  const _apolloClient:
    | ApolloClient<NormalizedCache>
    | ApolloClient<NormalizedCacheObject> =
    apolloClient ?? createApolloClient();

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    _apolloClient.cache.restore(initialState);
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient;
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

export function useApollo(
  initialState = null
): ApolloClient<NormalizedCache> | ApolloClient<NormalizedCacheObject> {
  const store = useMemo(() => initializeApollo(initialState), [initialState]);
  return store;
}
