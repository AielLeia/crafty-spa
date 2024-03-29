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
import { User } from '@/libs/users/models/user.entity.ts';
import { expect } from 'vitest';

type UserDsl = User;

type TimelineDsl = {
  id: string;
  user: UserDsl;
  messages: {
    id: string;
    text: string;
    author: UserDsl;
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

    givenExistingRemoteTimeline(givenTimelines: TimelineDsl) {
      timelineGateway.timelinesByUser.set(
        givenTimelines.user.id,
        givenTimelines
      );
    },

    givenTimeline(givenTimeline: TimelineDsl) {
      builderProvider.setState((builder) =>
        builder
          .withTimeline({
            id: givenTimeline.id,
            user: givenTimeline.user.id,
            messages: givenTimeline.messages.map((msg) => msg.id),
          })
          .withMessages(
            givenTimeline.messages.map((m) => ({ ...m, author: m.author.id }))
          )
          .withUsers([
            givenTimeline.user,
            ...givenTimeline.messages.map((m) => m.author),
          ])
          .withNotLoadingTimelineOfUser(givenTimeline.user.id)
      );
    },

    givenPostMessageCanFailWithError(givenErrorMessaqe: string) {
      messageGateway = new FailingMessageGateway(givenErrorMessaqe);
    },

    givenMessageHasFailedToBePosted({
      messageId,
      error,
    }: {
      messageId: string;
      error: string;
    }) {
      builderProvider.setState((builder) =>
        builder.withMessageNotPosted({ messageId, errorMessage: error })
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

    thenTheReceivedTimelineShouldBe(expectedTimeline: TimelineDsl) {
      this.thenTimelineShouldBe(expectedTimeline);
    },

    thenTimelineShouldBe(
      expectedTimeline: TimelineDsl & {
        messageNotPosted?: Partial<{ messageId: string; errorMessage: string }>;
      }
    ) {
      let expectedState = stateBuilder(builderProvider.getState())
        .withTimeline({
          id: expectedTimeline.id,
          user: expectedTimeline.user.id,
          messages: expectedTimeline.messages.map((msg) => msg.id),
        })
        .withNotLoadingTimelineOfUser(expectedTimeline.user.id)
        .withUsers([
          expectedTimeline.user,
          ...expectedTimeline.messages.map((m) => m.author),
        ])
        .withMessages(
          expectedTimeline.messages.map((m) => ({ ...m, author: m.author.id }))
        );

      expectedState =
        expectedTimeline.messageNotPosted === undefined
          ? expectedState.withMessageNotMessagesHavingFailedToBePosted()
          : expectedState.withMessageNotPosted(
              expectedTimeline.messageNotPosted
            );

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
