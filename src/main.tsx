import { Provider } from './Provider.tsx';
import { FakeAuthGateway } from '@/libs/auth/infra/fake-auth.gateway.ts';
import { FakeStorageAuthGateway } from '@/libs/auth/infra/fake-storage-auth.gateway.ts';
import { createStore } from '@/libs/create-store.ts';
import { FakeTimelineGateway } from '@/libs/timeline/infra/fake-timeline.gateway.ts';
import { createRouter } from '@/router.tsx';
import React from 'react';
import ReactDOM from 'react-dom/client';

const fakeAuthGateway = new FakeAuthGateway(500);
fakeAuthGateway.willSucceedForGoogleAuthForUser = 'Alice';
fakeAuthGateway.willSucceedForGithubAuthForUser = 'Bob';

const authGateway = new FakeStorageAuthGateway(fakeAuthGateway);

const timelineGateway = new FakeTimelineGateway(1000);
timelineGateway.timelinesByUser.set('Alice', {
  id: 'alice-timeline-id',
  user: 'Alice',
  messages: [
    {
      id: 'msg1-id',
      text: "Hello it's bob",
      author: 'Bob',
      publishedAt: '2024-02-29T18:19:00.000Z',
    },
    {
      id: 'msg2-id',
      text: "Hello it's Alice",
      author: 'Alice',
      publishedAt: '2024-02-29T19:18:00.000Z',
    },
  ],
});

timelineGateway.timelinesByUser.set('Bob', {
  id: 'bob-timeline-id',
  user: 'Bob',
  messages: [
    {
      id: 'msg3-id',
      text: "Hello it's bob from bob",
      author: 'Bob',
      publishedAt: '2024-02-29T18:19:00.000Z',
    },
    {
      id: 'msg4-id',
      text: "Hello it's Alice from bob",
      author: 'Alice',
      publishedAt: '2024-02-29T19:18:00.000Z',
    },
  ],
});

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
