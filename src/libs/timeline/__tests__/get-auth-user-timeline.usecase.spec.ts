import {
  AuthFixture,
  createAuthFixture,
} from '@/libs/auth/__tests__/auth.fixture.ts';
import { stateBuilderProvider } from '@/libs/state-builder.ts';
import {
  createTimelinesFixture,
  TimelinesFixture,
} from '@/libs/timeline/__tests__/timelines.fixture.ts';
import { buildUser } from '@/libs/users/__tests__/user.builder.ts';
import { beforeEach, describe, test } from 'vitest';

describe("Feature: Retrieving authenticated users's timeline", () => {
  let fixture: TimelinesFixture;
  let authFixture: AuthFixture;

  beforeEach(() => {
    const testStateBuilderProvider = stateBuilderProvider();
    fixture = createTimelinesFixture({
      builderProvider: testStateBuilderProvider,
    });
    authFixture = createAuthFixture({
      builderProvider: testStateBuilderProvider,
    });
  });

  test('User is authenticated and can see her timeline', async () => {
    const ismael = buildUser({
      id: 'ismael-id',
      username: 'Ismael',
      profilePicture: 'ismael.png',
    });
    const asma = buildUser({
      id: 'asma-id',
      username: 'Asma',
      profilePicture: 'asma.png',
    });

    authFixture.givenAuthenticatedUserIs('asma-id');
    fixture.givenExistingRemoteTimeline({
      id: 'asma-timeline-id',
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
          author: asma,
          publishedAt: '2024-02-29T19:18:00.000Z',
        },
      ],
    });

    const timelineRetrieving =
      fixture.whenRetrievingAuthenticatedUserTimeline();
    fixture.thenTheTimelineOfUserShouldBeLoading('asma-id');

    await timelineRetrieving;

    fixture.thenTheReceivedTimelineShouldBe({
      id: 'asma-timeline-id',
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
          author: asma,
          publishedAt: '2024-02-29T19:18:00.000Z',
        },
      ],
    });
  });
});
