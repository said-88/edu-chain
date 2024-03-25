import protobuf from 'protobufjs';

export interface NotifyMessage {
    title: string;
    description: string;
}

export interface FeedbackMessage {
    title: string;
    content: string;
}

export const NotificationMessage = new protobuf.Type("NotificationMessage")
    .add(new protobuf.Field("timestamp", 1, "uint64"))
    .add(new protobuf.Field("title", 2, "string"))
    .add(new protobuf.Field("description", 3, "string"));

export const FeedbackMessage = new protobuf.Type("FeedbackMessage")
    .add(new protobuf.Field("timestamp", 1, "uint64"))
    .add(new protobuf.Field("id", 2, "string"))
    .add(new protobuf.Field("title", 3, "string"))
    .add(new protobuf.Field("content", 4, "string"));
