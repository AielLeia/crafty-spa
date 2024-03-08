import { FakeAuthGateway } from '@/libs/auth/infra/fake-auth.gateway.ts';
import { AppStore, createTestStore } from '@/libs/create-store.ts';
import {
  stateBuilder,
  stateBuilderProvider,
  StatebuilderProvider,
} from '@/libs/state-builder.ts';
import { FailingMessageGateway } from '@/libs/timeline/infra/failing-message.gateway.ts';
import { FakeMessageGateway } from '@/libs/timeline/infra/fake-message.gateway.ts';
import { FakeTimelineGateway } from '@/libs/timeline/infra/fake-timeline.gateway.ts';
import { StubDateProvider } from '@/libs/timeline/infra/stub-date-provider.ts';
import { MessageGateway } from '@/libs/timeline/models/message.gateway.ts';
import { selectIsUserTimelineLoading } from '@/libs/timeline/slices/timelines.slice.ts';
import { getAuthUserTimeline } from '@/libs/timeline/usecases/get-auth-user-timeline.usecase.ts';
import { getUserTimeline } from '@/libs/timeline/usecases/get-user-timeline.usecase.ts';
import {
  postMessage,
  PostMessageParams,
} from '@/libs/timeline/usecases/post-message.usecase.ts';
import { expect } from 'vitest';

type Timeline = {
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
  let messageGateway: MessageGateway = new FakeMessageGateway();
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
          .withTimeline({
            id: givenTimeline.id,
            user: givenTimeline.user,
            messages: givenTimeline.messages.map((msg) => msg.id),
          })
          .withMessages(givenTimeline.messages)
          .withNotLoadingTimelineOfUser(givenTimeline.user)
      );
    },

    givenPostMessageCanFailWithError(givenErrorMessaqe: string) {
      messageGateway = new FailingMessageGateway(givenErrorMessaqe);
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

    thenTheReceivedTimelineShouldBe(expectedTimeline: Timeline) {
      this.thenTimelineShouldBe(expectedTimeline);
    },

    thenTimelineShouldBe(
      expectedTimeline: Timeline & {
        messageNotPosted?: { messageId: string; errorMessage: string };
      }
    ) {
      let expectedState = stateBuilder(builderProvider.getState())
        .withTimeline({
          id: expectedTimeline.id,
          user: expectedTimeline.user,
          messages: expectedTimeline.messages.map((msg) => msg.id),
        })
        .withNotLoadingTimelineOfUser(expectedTimeline.user)
        .withMessages(expectedTimeline.messages);

      if (expectedTimeline.messageNotPosted) {
        expectedState = expectedState.withMessageNotPosted(
          expectedTimeline.messageNotPosted
        );
      }

      expect(store.getState()).toEqual(expectedState.build());
    },

    thenMessageShouldHaveBeenPosted(expectedPostedMessage: {
      id: string;
      timelineId: string;
      text: string;
      author: string;
      publishedAt: string;
    }) {
      expect((messageGateway as FakeMessageGateway).lastPostedMessage).toEqual(
        expectedPostedMessage
      );
    },
  };
};

export type TimelinesFixture = ReturnType<typeof createTimelinesFixture>;
