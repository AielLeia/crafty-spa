export type PostMessageBody = {
  id: string;
  timelineId: string;
  text: string;
  author: string;
  publishedAt: string;
};

export interface MessageGateway {
  postMessage(messageBody: PostMessageBody): Promise<void>;
}
