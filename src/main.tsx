import { Provider } from './Provider.tsx';
import { FakeAuthGateway } from '@/libs/auth/infra/fake-auth.gateway.ts';
import { createStore } from '@/libs/create-store.ts';
import { FakeTimelineGateway } from '@/libs/timeline/infra/fake-timeline.gateway.ts';
import { createRouter } from '@/router.tsx';
import React from 'react';
import ReactDOM from 'react-dom/client';

const authGateway = new FakeAuthGateway();
authGateway.authUser = 'Alice';

const timelineGateway = new FakeTimelineGateway(1000);
timelineGateway.timelinesByUser.set(authGateway.authUser, {
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
