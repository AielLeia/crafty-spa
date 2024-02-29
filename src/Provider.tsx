import { router } from './router';
import { ChakraProvider } from '@chakra-ui/react';
import { RouterProvider } from 'react-router-dom';

export const Provider = () => (
  <ChakraProvider>
    <RouterProvider router={router} />
  </ChakraProvider>
);
