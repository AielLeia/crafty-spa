import { FakeAuthGateway } from '@/libs/auth/infra/fake-auth.gateway.ts';
import { createStore } from '@/libs/create-store.ts';
import { FakeTimelineGateway } from '@/libs/timeline/infra/fake-timeline.gateway.ts';
import { getAuthUserTimeline } from '@/libs/timeline/usecases/get-auth-user-timeline.usecase.ts';
import { describe, expect, test } from 'vitest';

describe("Feature: Retrieving authenticated user's timeline", () => {
  test('Example: Alice is authenticated and can see her timeline', async () => {
    givenAuthenticatedUserIs('Alice');
    givenExistingTimeline({
      user: 'Alice',
      messages: [
        {
          text: "Hello it's bob",
          author: 'Bob',
          publishedAt: '2024-02-29T18:19:00.000Z',
        },
        {
          text: "Hello it's Alice",
          author: 'Alice',
          publishedAt: '2024-02-29T19:18:00.000Z',
        },
      ],
    });

    await whenRetrievingAuthenticatedUserTimeline();

    thenTheReceivedTimelineShouldBe({
      user: 'Alice',
      messages: [
        {
          text: "Hello it's bob",
          author: 'Bob',
          publishedAt: '2024-02-29T18:19:00.000Z',
        },
        {
          text: "Hello it's Alice",
          author: 'Alice',
          publishedAt: '2024-02-29T19:18:00.000Z',
        },
      ],
    });
  });
});

const authGateway = new FakeAuthGateway();
const timelineGateway = new FakeTimelineGateway();
const store = createStore({ authGateway, timelineGateway });

function givenAuthenticatedUserIs(user: string) {
  authGateway.authUser = user;
}

function givenExistingTimeline(givenTimelines: {
  user: string;
  messages: { text: string; author: string; publishedAt: string }[];
}) {
  timelineGateway.timelinesByUser.set('Alice', givenTimelines);
}

async function whenRetrievingAuthenticatedUserTimeline() {
  await store.dispatch(getAuthUserTimeline());
}

function thenTheReceivedTimelineShouldBe(expectedTimeline: {
  user: string;
  messages: { text: string; author: string; publishedAt: string }[];
}) {
  const authUserTimeline = store.getState();
  expect(authUserTimeline).toEqual(expectedTimeline);
}
