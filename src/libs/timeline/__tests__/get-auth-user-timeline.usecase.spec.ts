import { FakeAuthGateway } from '@/libs/auth/infra/fake-auth.gateway.ts';
import { AppStore, createStore } from '@/libs/create-store.ts';
import { stateBuilder } from '@/libs/state-builder.ts';
import { FakeTimelineGateway } from '@/libs/timeline/infra/fake-timeline.gateway.ts';
import { selectIsUserTimelineLoading } from '@/libs/timeline/slices/timelines.slice.ts';
import { getAuthUserTimeline } from '@/libs/timeline/usecases/get-auth-user-timeline.usecase.ts';
import { describe, expect, test } from 'vitest';

describe("Feature: Retrieving authenticated user's timeline", () => {
  test('User is authenticated and can see her timeline', async () => {
    givenAuthenticatedUserIs('Alice');
    givenExistingTimeline({
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

    const timelineRetrieving = whenRetrievingAuthenticatedUserTimeline();
    thenTheTimelineOfUserShouldBeLoading('Alice');

    await timelineRetrieving;

    thenTheReceivedTimelineShouldBe({
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
  });
});

const authGateway = new FakeAuthGateway();
const timelineGateway = new FakeTimelineGateway();
let testStateBuilder = stateBuilder();
let store: AppStore;

function givenAuthenticatedUserIs(user: string) {
  authGateway.authUser = user;
  testStateBuilder = testStateBuilder.withAuthUser(user);
}

function givenExistingTimeline(givenTimelines: {
  id: string;
  user: string;
  messages: { id: string; text: string; author: string; publishedAt: string }[];
}) {
  timelineGateway.timelinesByUser.set(givenTimelines.user, givenTimelines);
}

async function whenRetrievingAuthenticatedUserTimeline() {
  store = createStore(
    { timelineGateway, authGateway },
    testStateBuilder.build()
  );
  await store.dispatch(getAuthUserTimeline());
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
    .withAuthUser(expectedTimeline.user)
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
