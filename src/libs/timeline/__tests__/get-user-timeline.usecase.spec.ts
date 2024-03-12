import { stateBuilderProvider } from '@/libs/state-builder.ts';
import {
  createTimelinesFixture,
  TimelinesFixture,
} from '@/libs/timeline/__tests__/timelines.fixture.ts';
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
    fixture.givenExistingRemoteTimeline({
      id: 'ismael-timeline-id',
      user: {
        id: 'ismael-id',
        username: 'Ismael',
        profilePicture: 'ismael.png',
        followersCount: 5,
        followingCount: 10,
      },
      messages: [
        {
          id: 'msg1-id',
          text: "Hello it's ismael",
          author: {
            id: 'ismael-id',
            username: 'Ismael',
            profilePicture: 'ismael.png',
            followersCount: 5,
            followingCount: 10,
          },
          publishedAt: '2024-02-29T18:19:00.000Z',
        },
        {
          id: 'msg2-id',
          text: "Hello it's Asma",
          author: {
            id: 'asma-id',
            username: 'Asma',
            profilePicture: 'asma.png',
            followersCount: 42,
            followingCount: 10,
          },
          publishedAt: '2024-02-29T19:18:00.000Z',
        },
      ],
    });

    const timelineRetrieving = fixture.whenRetrievingUserTimeline('ismael-id');
    fixture.thenTheTimelineOfUserShouldBeLoading('ismael-id');

    await timelineRetrieving;

    fixture.thenTheReceivedTimelineShouldBe({
      id: 'ismael-timeline-id',
      user: {
        id: 'ismael-id',
        username: 'Ismael',
        profilePicture: 'ismael.png',
        followersCount: 5,
        followingCount: 10,
      },
      messages: [
        {
          id: 'msg1-id',
          text: "Hello it's ismael",
          author: {
            id: 'ismael-id',
            username: 'Ismael',
            profilePicture: 'ismael.png',
            followersCount: 5,
            followingCount: 10,
          },
          publishedAt: '2024-02-29T18:19:00.000Z',
        },
        {
          id: 'msg2-id',
          text: "Hello it's Asma",
          author: {
            id: 'asma-id',
            username: 'Asma',
            profilePicture: 'asma.png',
            followersCount: 42,
            followingCount: 10,
          },
          publishedAt: '2024-02-29T19:18:00.000Z',
        },
      ],
    });
  });
});
