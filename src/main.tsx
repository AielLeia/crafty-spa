import { Provider } from './Provider.tsx';
import { FakeAuthGateway } from '@/libs/auth/infra/fake-auth.gateway.ts';
import { FakeStorageAuthGateway } from '@/libs/auth/infra/fake-storage-auth.gateway.ts';
import { createStore } from '@/libs/create-store.ts';
import { users } from '@/libs/fake-data.ts';
import { FakeDataTimelineGateway } from '@/libs/timeline/infra/fake-data-timeline.gateway.ts';
import { FakeMessageGateway } from '@/libs/timeline/infra/fake-message.gateway.ts';
import { RealDateProvider } from '@/libs/timeline/infra/real-date-provider.ts';
import { FakeDataUserGateway } from '@/libs/users/infra/fake-data-user.gateway.ts';
import { createRouter } from '@/router.tsx';
import React from 'react';
import ReactDOM from 'react-dom/client';

const fakeAuthGateway = new FakeAuthGateway(500);
fakeAuthGateway.willSucceedForGoogleAuthForUser = [...users.values()][0].id;
fakeAuthGateway.willSucceedForGithubAuthForUser = [...users.values()][1].id;

const authGateway = new FakeStorageAuthGateway(fakeAuthGateway);

const timelineGateway = new FakeDataTimelineGateway();

const messageGateway = new FakeMessageGateway();

const userGateway = new FakeDataUserGateway();

const dateProvider = new RealDateProvider();

const store = createStore({
  timelineGateway,
  authGateway,
  messageGateway,
  userGateway,
  dateProvider,
});

const router = createRouter({ store });

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store} router={router} />
  </React.StrictMode>
);
