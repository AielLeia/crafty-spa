import {
  MessageGateway,
  PostMessageBody,
} from '@/libs/timeline/models/message.gateway.ts';

export class FakeMessageGateway implements MessageGateway {
  postMessageCount = 0;
  lastPostedMessage!: PostMessageBody;

  postMessage(messageBody: PostMessageBody): Promise<void> {
    this.lastPostedMessage = messageBody;

    return this.postMessageCount++ % 2 === 0
      ? Promise.resolve()
      : Promise.reject(new Error('Cannot send message. Please retry later'));
  }
}
