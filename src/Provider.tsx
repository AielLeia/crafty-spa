import { AppRouter } from './router';
import { AppStore } from '@/libs/create-store.ts';
import { ChakraProvider } from '@chakra-ui/react';
import { Provider as ReduxProvider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';

export const Provider = ({
  store,
  router,
}: {
  store: AppStore;
  router: AppRouter;
}) => (
  <ReduxProvider store={store}>
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  </ReduxProvider>
);
