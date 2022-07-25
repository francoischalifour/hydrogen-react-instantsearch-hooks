import {HydrogenRouteProps, useLocalization, useQuery} from '@shopify/hydrogen';
import {
  getServerState,
  type InstantSearchServerState,
  // @ts-ignore Hydrogen is unable to find the InstantSearch types
} from 'react-instantsearch-hooks-server';

import {Layout, NoResultRecommendations} from '~/components/index.server';
import {SearchPage} from '~/components/search/SearchPage.client';

export default function Search({request}: HydrogenRouteProps) {
  const serverUrl = request.normalizedUrl;
  const {data: serverState} = useQuery<InstantSearchServerState>(
    serverUrl,
    async () =>
      getServerState(
        <SearchPage serverUrl={serverUrl} fallback={<NoResults />} />,
      ),
  );

  return (
    <Layout>
      <SearchPage
        serverState={serverState}
        serverUrl={serverUrl}
        fallback={<NoResults />}
      />
    </Layout>
  );
}

function NoResults() {
  const {
    language: {isoCode: languageCode},
    country: {isoCode: countryCode},
  } = useLocalization();

  return (
    <NoResultRecommendations country={countryCode} language={languageCode} />
  );
}
