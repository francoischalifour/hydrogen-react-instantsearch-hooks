import React, {ComponentProps, ReactNode, useEffect, useRef} from 'react';
import {
  InstantSearch,
  InstantSearchSSRProvider,
  SearchBox,
  Pagination,
  useHits,
  useInstantSearch,
  // @ts-ignore Hydrogen is unable to find the InstantSearch types
} from 'react-instantsearch-hooks-web';
// @ts-ignore Hydrogen is unable to find the InstantSearch types
import type {InstantSearchServerState} from 'react-instantsearch-hooks-web';
import algoliasearch from 'algoliasearch/lite';
// @ts-ignore Hydrogen is unable to find the InstantSearch types
import {singleIndex} from 'instantsearch.js/cjs/lib/stateMappings';
// @ts-ignore Hydrogen is unable to find the InstantSearch types
import {history} from 'instantsearch.js/cjs/lib/routers';
import {Grid, ProductCard, Section} from '~/components';

import './InstantSearch.css';

const apiKey = 'f45942de4172c8021a84222d0cabadc2';
const appId = 'P4H4N903HM';
const indexName = 'hydrogen_products';
const searchClient = algoliasearch(appId, apiKey);

type SearchProps = {
  serverState?: InstantSearchServerState;
  serverUrl?: string;
  fallback: JSX.Element;
};

export function SearchPage({serverState, serverUrl, fallback}: SearchProps) {
  return (
    <InstantSearchSSRProvider {...serverState}>
      <InstantSearch
        searchClient={searchClient}
        indexName={indexName}
        routing={{
          stateMapping: singleIndex(indexName),
          router: history({
            getLocation() {
              if (typeof window === 'undefined') {
                return new URL(serverUrl!) as unknown as Location;
              }

              return window.location;
            },
          }),
        }}
      >
        <ScrollTo>
          <Section padding="x">
            <SearchBox placeholder="Search products" />
          </Section>

          <NoResultsBoundary fallback={<NoResults>{fallback}</NoResults>}>
            <Section>
              <Hits />
              <Pagination />
            </Section>
          </NoResultsBoundary>
        </ScrollTo>
      </InstantSearch>
    </InstantSearchSSRProvider>
  );
}

type NoResultsProps = {
  children: ReactNode;
};

function NoResults({children}: NoResultsProps) {
  const {indexUiState} = useInstantSearch();

  return (
    <>
      <Section>
        <p>
          No results for <q>{indexUiState.query}</q>.
        </p>
      </Section>

      {children}
    </>
  );
}

function Hits() {
  const {hits} = useHits();

  return (
    <Grid layout="products">
      {hits.map((hit) => (
        <ProductCard key={hit.objectID} product={hit} />
      ))}
    </Grid>
  );
}

type ScrollToProps = ComponentProps<'div'> & {
  children: ReactNode;
};

export function ScrollTo({children, ...props}: ScrollToProps) {
  const {use} = useInstantSearch();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return use(() => {
      return {
        onStateChange() {
          const isFiltering = document.body.classList.contains('filtering');
          const isTyping =
            document.activeElement?.tagName === 'INPUT' &&
            document.activeElement?.getAttribute('type') === 'search';

          if (isFiltering || isTyping) {
            return;
          }

          containerRef.current!.scrollIntoView();
        },
      };
    });
  }, [use]);

  return (
    <div {...props} ref={containerRef}>
      {children}
    </div>
  );
}

type NoResultsBoundaryProps = {
  children: ReactNode;
  fallback: ReactNode;
};

export function NoResultsBoundary({
  children,
  fallback,
}: NoResultsBoundaryProps) {
  const {results} = useInstantSearch();

  // The `__isArtificial` flag makes sure to not display the No Results message
  // when no hits have been returned yet.
  if (!results.__isArtificial && results.nbHits === 0) {
    return (
      <>
        {fallback}
        <div hidden>{children}</div>
      </>
    );
  }

  return <>{children}</>;
}
