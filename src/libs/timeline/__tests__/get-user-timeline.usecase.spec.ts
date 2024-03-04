import { FakeAuthGateway } from '@/libs/auth/infra/fake-auth.gateway.ts';
import { AppStore, createStore } from '@/libs/create-store.ts';
import { stateBuilder } from '@/libs/state-builder.ts';
import { FakeTimelineGateway } from '@/libs/timeline/infra/fake-timeline.gateway.ts';
import { selectIsUserTimelineLoading } from '@/libs/timeline/slices/timelines.slice.ts';
import { getUserTimeline } from '@/libs/timeline/usecases/get-user-timeline.usecase.ts';
import { describe, expect, test } from 'vitest';

describe("Feature: Retrieving user's timeline", () => {
  test('User can see his timeline', async () => {
    givenExistingTimeline({
      id: 'bob-timeline-id',
      user: 'Bob',
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

    const timelineRetrieving = whenRetrievingUserTimeline('Bob');
    thenTheTimelineOfUserShouldBeLoading('Bob');

    await timelineRetrieving;

    thenTheReceivedTimelineShouldBe({
      id: 'bob-timeline-id',
      user: 'Bob',
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
  });
});

const authGateway = new FakeAuthGateway();
const timelineGateway = new FakeTimelineGateway();
let testStateBuilder = stateBuilder();
let store: AppStore;

function givenExistingTimeline(givenTimelines: {
  id: string;
  user: string;
  messages: { id: string; text: string; author: string; publishedAt: string }[];
}) {
  timelineGateway.timelinesByUser.set(givenTimelines.user, givenTimelines);
}

async function whenRetrievingUserTimeline(userId: string) {
  store = createStore(
    { timelineGateway, authGateway },
    testStateBuilder.build()
  );
  await store.dispatch(getUserTimeline({ userId }));
}

function thenTheTimelineOfUserShouldBeLoading(user: string) {
  const isUserTimelineLoading = selectIsUserTimelineLoading(
    user,
    store.getState()
  );
  expect(isUserTimelineLoading).toBe(true);
}

function thenTheReceivedTimelineShouldBe(expectedTimeline: {
  id: string;
  user: string;
  messages: { id: string; text: string; author: string; publishedAt: string }[];
}) {
  const expectedState = stateBuilder()
    .withTimeline({
      id: expectedTimeline.id,
      user: expectedTimeline.user,
      messages: expectedTimeline.messages.map((msg) => msg.id),
    })
    .withNotLoadingTimelineOfUser(expectedTimeline.user)
    .withMessages(expectedTimeline.messages)
    .build();

  expect(store.getState()).toEqual(expectedState);
}
