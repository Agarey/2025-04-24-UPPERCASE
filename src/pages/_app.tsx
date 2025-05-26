import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Header from '@/components/Header';
import { ThemeProvider } from '@/utils/theme';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useHeaderSearch } from '@/hooks/useHeaderSearch';

import '../styles/globals.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 600_000,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

export default function MyApp({ Component, pageProps }: AppProps) {
  const user = useCurrentUser();
  const { query, setQuery, runSearch } = useHeaderSearch();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <div className="page-container">
          <Header
            value={query}
            onValueChange={setQuery}
            onSearch={runSearch}
            user={user}
          />
          <Component {...pageProps} />
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
