import { Provider } from './Provider.tsx';
import { FakeAuthGateway } from '@/libs/auth/infra/fake-auth.gateway.ts';
import { FakeStorageAuthGateway } from '@/libs/auth/infra/fake-storage-auth.gateway.ts';
import { createStore } from '@/libs/create-store.ts';
import { users } from '@/libs/fake-data.ts';
import { FakeDataTimelineGateway } from '@/libs/timeline/infra/fake-data-timeline.gateway.ts';
import { createRouter } from '@/router.tsx';
import React from 'react';
import ReactDOM from 'react-dom/client';

const fakeAuthGateway = new FakeAuthGateway(500);
fakeAuthGateway.willSucceedForGoogleAuthForUser = [...users.values()][0];
fakeAuthGateway.willSucceedForGithubAuthForUser = [...users.values()][1];

const authGateway = new FakeStorageAuthGateway(fakeAuthGateway);

const timelineGateway = new FakeDataTimelineGateway();

const store = createStore({
  timelineGateway,
  authGateway,
});

const router = createRouter({ store });

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store} router={router} />
  </React.StrictMode>
);
