import { FakeAuthGateway } from '@/libs/auth/infra/fake-auth.gateway.ts';
import { AppStore, createTestStore } from '@/libs/create-store.ts';
import {
  stateBuilder,
  stateBuilderProvider,
  StatebuilderProvider,
} from '@/libs/state-builder.ts';
import { FakeMessageGateway } from '@/libs/timeline/infra/fake-message.gateway.ts';
import { FakeTimelineGateway } from '@/libs/timeline/infra/fake-timeline.gateway.ts';
import { StubDateProvider } from '@/libs/timeline/infra/stub-date-provider.ts';
import { Timeline } from '@/libs/timeline/models/timeline.entity.ts';
import { selectIsUserTimelineLoading } from '@/libs/timeline/slices/timelines.slice.ts';
import { getAuthUserTimeline } from '@/libs/timeline/usecases/get-auth-user-timeline.usecase.ts';
import { getUserTimeline } from '@/libs/timeline/usecases/get-user-timeline.usecase.ts';
import {
  postMessage,
  PostMessageParams,
} from '@/libs/timeline/usecases/post-message.usecase.ts';
import { expect } from 'vitest';

type ExpectedTimeline = {
  id: string;
  user: string;
  messages: {
    id: string;
    text: string;
    author: string;
    publishedAt: string;
  }[];
};

export const createTimelinesFixture = ({
  builderProvider = stateBuilderProvider(),
}: {
  builderProvider: StatebuilderProvider;
}) => {
  const authGateway = new FakeAuthGateway();
  const timelineGateway = new FakeTimelineGateway();
  const messageGateway = new FakeMessageGateway();
  let expectedStateBuilder = stateBuilder();
  const dateProvider = new StubDateProvider();
  let store: AppStore;

  return {
    givenNowIs(now: Date) {
      dateProvider.now = now;
    },

    givenAuthenticatedUserIs(user: string) {
      builderProvider.setState((builder) => builder.withAuthUser(user));
      expectedStateBuilder = expectedStateBuilder.withAuthUser(user);
    },

    givenExistingRemoteTimeline(givenTimelines: {
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

    givenTimeline(givenTimeline: Timeline) {
      builderProvider.setState((builder) =>
        builder
          .withTimeline(givenTimeline)
          .withNotLoadingTimelineOfUser(givenTimeline.user)
      );
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

    async whenUserPostMessage(newMessage: PostMessageParams) {
      store = createTestStore(
        { dateProvider, messageGateway },
        builderProvider.getState()
      );
      return store.dispatch(postMessage(newMessage));
    },

    thenTheTimelineOfUserShouldBeLoading(user: string) {
      const isUserTimelineLoading = selectIsUserTimelineLoading(
        user,
        store.getState()
      );
      expect(isUserTimelineLoading).toBe(true);
    },

    thenTheReceivedTimelineShouldBe(expectedTimeline: ExpectedTimeline) {
      this.thenTimelineShouldBe(expectedTimeline);
    },

    thenTimelineShouldBe(expectedTimeline: ExpectedTimeline) {
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

    thenMessageShouldHaveBeenPosted(expectedPostedMessage: {
      id: string;
      timelineId: string;
      text: string;
      author: string;
      publishedAt: string;
    }) {
      expect(messageGateway.lastPostedMessage).toEqual(expectedPostedMessage);
    },
  };
};

export type TimelinesFixture = ReturnType<typeof createTimelinesFixture>;
