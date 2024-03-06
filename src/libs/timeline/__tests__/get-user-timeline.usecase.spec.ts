import { stateBuilderProvider } from '@/libs/state-builder.ts';
import {
  createTimelinesFixture,
  TimelinesFixture,
} from '@/libs/timeline/__tests__/timelines.fixture.ts';
import { beforeEach, describe, test } from 'vitest';

describe("Feature: Retrieving user's timeline", () => {
  let fixture: TimelinesFixture;

  beforeEach(() => {
    const testStateBuilderProvider = stateBuilderProvider();
    fixture = createTimelinesFixture({
      builderProvider: testStateBuilderProvider,
    });
  });

  test('User can see his timeline', async () => {
    fixture.givenExistingRemoteTimeline({
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

    const timelineRetrieving = fixture.whenRetrievingUserTimeline('Bob');
    fixture.thenTheTimelineOfUserShouldBeLoading('Bob');

    await timelineRetrieving;

    fixture.thenTheReceivedTimelineShouldBe({
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
