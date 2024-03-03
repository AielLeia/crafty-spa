import { Provider } from '@/Provider.tsx';
import { createTestStore } from '@/libs/create-store.ts';
import { stateBuilder } from '@/libs/state-builder.ts';
import { FakeTimelineGateway } from '@/libs/timeline/infra/fake-timeline.gateway.ts';
import { createRouter } from '@/router.tsx';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('Get auth user timeline', () => {
  it('displays the authenticated user timeline on the home page', async () => {
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

    const store = createTestStore(
      {
        timelineGateway,
      },
      stateBuilder().withAuthUser('Alice').build()
    );

    const router = createRouter({ store });

    render(<Provider store={store} router={router} />);

    expect(await screen.findByText("Hello it's bob")).toBeInTheDocument();
    expect(await screen.findByText("Hello it's Alice")).toBeInTheDocument();
  });
});
