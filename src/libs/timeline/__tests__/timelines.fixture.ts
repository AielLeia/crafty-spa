import { FakeAuthGateway } from '@/libs/auth/infra/fake-auth.gateway.ts';
import { AppStore, createTestStore } from '@/libs/create-store.ts';
import {
  stateBuilder,
  stateBuilderProvider,
  StatebuilderProvider,
} from '@/libs/state-builder.ts';
import { FakeTimelineGateway } from '@/libs/timeline/infra/fake-timeline.gateway.ts';
import { selectIsUserTimelineLoading } from '@/libs/timeline/slices/timelines.slice.ts';
import { getAuthUserTimeline } from '@/libs/timeline/usecases/get-auth-user-timeline.usecase.ts';
import { getUserTimeline } from '@/libs/timeline/usecases/get-user-timeline.usecase.ts';
import { expect } from 'vitest';

export const createTimelinesFixture = ({
  builderProvider = stateBuilderProvider(),
}: {
  builderProvider: StatebuilderProvider;
}) => {
  const authGateway = new FakeAuthGateway();
  const timelineGateway = new FakeTimelineGateway();
  let expectedStateBuilder = stateBuilder();
  let store: AppStore;

  return {
    givenAuthenticatedUserIs(user: string) {
      builderProvider.setState((builder) => builder.withAuthUser(user));
      expectedStateBuilder = expectedStateBuilder.withAuthUser(user);
    },

    givenExistingTimeline(givenTimelines: {
      id: string;
      user: string;
      messages: {
        id: string;
        text: string;
        author: string;
        publishedAt: string;
      }[];
    }) {
      timelineGateway.timelinesByUser.set(givenTimelines.user, givenTimelines);
    },

    async whenRetrievingUserTimeline(userId: string) {
      store = createTestStore(
        { timelineGateway, authGateway },
        builderProvider.getState()
      );
      await store.dispatch(getUserTimeline({ userId }));
    },

    async whenRetrievingAuthenticatedUserTimeline() {
      store = createTestStore(
        { timelineGateway, authGateway },
        builderProvider.getState()
      );
      await store.dispatch(getAuthUserTimeline());
    },

    thenTheTimelineOfUserShouldBeLoading(user: string) {
      const isUserTimelineLoading = selectIsUserTimelineLoading(
        user,
        store.getState()
      );
      expect(isUserTimelineLoading).toBe(true);
    },

    thenTheReceivedTimelineShouldBe(expectedTimeline: {
      id: string;
      user: string;
      messages: {
        id: string;
        text: string;
        author: string;
        publishedAt: string;
      }[];
    }) {
      const expectedState = stateBuilder(builderProvider.getState())
        .withTimeline({
          id: expectedTimeline.id,
          user: expectedTimeline.user,
          messages: expectedTimeline.messages.map((msg) => msg.id),
        })
        .withNotLoadingTimelineOfUser(expectedTimeline.user)
        .withMessages(expectedTimeline.messages)
        .build();

      expect(store.getState()).toEqual(expectedState);
    },
  };
};

export type TimelinesFixture = ReturnType<typeof createTimelinesFixture>;
