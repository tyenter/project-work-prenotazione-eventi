import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { AuthProvider } from './context/AuthProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from './hooks/useAuth';
import type { MyRouterContext } from './routes/__root';

const router = createRouter({ routeTree, context: {} as MyRouterContext });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function Providers() {
  const {accessToken, setAccessToken} = useAuth()
  const context: MyRouterContext = {accessToken,setAccessToken}

  const [queryClient] = React.useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
        staleTime: 5 * 60 * 1000,
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} context={context} />
    </QueryClientProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
    <AuthProvider>
      <Providers/>
    </AuthProvider>
  // </React.StrictMode>
);


