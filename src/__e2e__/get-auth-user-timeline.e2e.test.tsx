import { Provider } from '@/Provider.tsx';
import { createTestStore } from '@/libs/create-store.ts';
import { stateBuilder } from '@/libs/state-builder.ts';
import { FakeTimelineGateway } from '@/libs/timeline/infra/fake-timeline.gateway.ts';
import { buildUser } from '@/libs/users/__tests__/user.builder.ts';
import { createRouter } from '@/router.tsx';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('Get auth users timeline', () => {
  it('displays the authenticated users timeline on the home page', async () => {
    const asma = buildUser({ id: 'asma-id' });
    const ismael = buildUser({ id: 'ismael-id' });
    const timelineGateway = new FakeTimelineGateway(1000);
    timelineGateway.timelinesByUser.set(asma.id, {
      id: 'alice-timeline-id',
      user: asma,
      messages: [
        {
          id: 'msg1-id',
          text: "Hello it's ismael",
          author: ismael,
          publishedAt: '2024-02-29T18:19:00.000Z',
        },
        {
          id: 'msg2-id',
          text: "Hello it's Asma",
          author: ismael,
          publishedAt: '2024-02-29T19:18:00.000Z',
        },
      ],
    });

    const store = createTestStore(
      {
        timelineGateway,
      },
      stateBuilder().withAuthUser('asma-id').build()
    );

    const router = createRouter({ store });

    render(<Provider store={store} router={router} />);

    expect(await screen.findByText("Hello it's ismael")).toBeInTheDocument();
    expect(await screen.findByText("Hello it's Asma")).toBeInTheDocument();
  });
});
