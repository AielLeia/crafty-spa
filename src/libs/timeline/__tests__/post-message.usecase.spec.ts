import {
  AuthFixture,
  createAuthFixture,
} from '@/libs/auth/__tests__/auth.fixture.ts';
import { stateBuilderProvider } from '@/libs/state-builder.ts';
import {
  createTimelinesFixture,
  TimelinesFixture,
} from '@/libs/timeline/__tests__/timelines.fixture.ts';
import { beforeEach, describe, test } from 'vitest';

describe('Feature: User can post a message on a timeline', () => {
  let timelinesFixture: TimelinesFixture;
  let authFixture: AuthFixture;

  beforeEach(() => {
    const testStateBuilderProvider = stateBuilderProvider();
    timelinesFixture = createTimelinesFixture({
      builderProvider: testStateBuilderProvider,
    });
    authFixture = createAuthFixture({
      builderProvider: testStateBuilderProvider,
    });
  });

  test('User can post a message on an empty timeline', async () => {
    timelinesFixture.givenNowIs(new Date('2024-03-05T10:00:00.000Z'));
    authFixture.givenAuthenticatedUserIs('Asma');
    timelinesFixture.givenTimeline({
      id: 'asma-timeline-id',
      user: 'Asma',
      messages: [],
    });

    await timelinesFixture.whenUserPostMessage({
      messageId: 'msg1-id',
      timelineId: 'asma-timeline-id',
      text: 'Hello its Asma from test',
    });

    timelinesFixture.thenMessageShouldHaveBeenPosted({
      id: 'msg1-id',
      timelineId: 'asma-timeline-id',
      text: 'Hello its Asma from test',
      author: 'Asma',
      publishedAt: '2024-03-05T10:00:00.000Z',
    });
    timelinesFixture.thenTimelineShouldBe({
      id: 'asma-timeline-id',
      user: 'Asma',
      messages: [
        {
          id: 'msg1-id',
          author: 'Asma',
          text: 'Hello its Asma from test',
          publishedAt: '2024-03-05T10:00:00.000Z',
        },
      ],
    });
  });

  test('User can post a message on his timeline already containing messages', async () => {
    timelinesFixture.givenNowIs(new Date('2024-03-05T11:00:00.000Z'));
    authFixture.givenAuthenticatedUserIs('Asma');
    timelinesFixture.givenTimeline({
      id: 'asma-timeline-id',
      user: 'Asma',
      messages: [
        {
          id: 'msg1-id',
          author: 'Asma',
          text: 'Hello its Asma from test',
          publishedAt: '2024-03-05T10:00:00.000Z',
        },
      ],
    });

    await timelinesFixture.whenUserPostMessage({
      messageId: 'msg2-id',
      timelineId: 'asma-timeline-id',
      text: 'Hello its Asma and i love to post :)',
    });

    timelinesFixture.thenMessageShouldHaveBeenPosted({
      id: 'msg2-id',
      timelineId: 'asma-timeline-id',
      text: 'Hello its Asma and i love to post :)',
      author: 'Asma',
      publishedAt: '2024-03-05T11:00:00.000Z',
    });
    timelinesFixture.thenTimelineShouldBe({
      id: 'asma-timeline-id',
      user: 'Asma',
      messages: [
        {
          id: 'msg1-id',
          author: 'Asma',
          text: 'Hello its Asma from test',
          publishedAt: '2024-03-05T10:00:00.000Z',
        },
        {
          id: 'msg2-id',
          author: 'Asma',
          text: 'Hello its Asma and i love to post :)',
          publishedAt: '2024-03-05T11:00:00.000Z',
        },
      ],
    });
  });

  test('User try to post a message but it has failed', async () => {
    timelinesFixture.givenNowIs(new Date('2024-03-05T10:00:00.000Z'));
    authFixture.givenAuthenticatedUserIs('Asma');
    timelinesFixture.givenTimeline({
      id: 'asma-timeline-id',
      user: 'Asma',
      messages: [],
    });
    timelinesFixture.givenPostMessageCanFailWithError('Cannot post message');

    await timelinesFixture.whenUserPostMessage({
      messageId: 'msg1-id',
      timelineId: 'asma-timeline-id',
      text: 'Hello its Asma from test',
    });

    timelinesFixture.thenTimelineShouldBe({
      id: 'asma-timeline-id',
      user: 'Asma',
      messages: [
        {
          id: 'msg1-id',
          author: 'Asma',
          text: 'Hello its Asma from test',
          publishedAt: '2024-03-05T10:00:00.000Z',
        },
      ],
      messageNotPosted: {
        messageId: 'msg1-id',
        errorMessage: 'Cannot post message',
      },
    });
  });
});
