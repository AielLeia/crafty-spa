import { stateBuilderProvider } from '@/libs/state-builder.ts';
import {
  createTimelinesFixture,
  TimelinesFixture,
} from '@/libs/timeline/__tests__/timelines.fixture.ts';
import { buildUser } from '@/libs/users/__tests__/user.builder.ts';
import { beforeEach, describe, test } from 'vitest';

describe("Feature: Retrieving users's timeline", () => {
  let fixture: TimelinesFixture;

  beforeEach(() => {
    const testStateBuilderProvider = stateBuilderProvider();
    fixture = createTimelinesFixture({
      builderProvider: testStateBuilderProvider,
    });
  });

  test('User can see his timeline', async () => {
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

    fixture.givenExistingRemoteTimeline({
      id: 'ismael-timeline-id',
      user: ismael,
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

    const timelineRetrieving = fixture.whenRetrievingUserTimeline('ismael-id');
    fixture.thenTheTimelineOfUserShouldBeLoading('ismael-id');

    await timelineRetrieving;

    fixture.thenTheReceivedTimelineShouldBe({
      id: 'ismael-timeline-id',
      user: ismael,
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
