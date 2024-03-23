import { createDecoder, createEncoder, createLightNode, waitForRemotePeer } from "@waku/sdk";
import protobuf from "protobufjs";

export const Feedback = async () => {
    const node = await createLightNode({ defaultBootstrap: true });
    await node.start();
    console.log("Node started");

    await waitForRemotePeer(node);
    console.log("Remote peer connected");

    const contentTopic = "/edu-chain/1/feedback/proto";

    const encoder = createEncoder({
        contentTopic,
        ephemeral: true,
    });

    const decoder = createDecoder(contentTopic);

        // Define structure of the message
    const FeedbackMessage = new protobuf.Type("FeedbackMessage")
        .add(new protobuf.Field("student", 1, "string"))
        .add(new protobuf.Field("feedback", 2, "string"));

    const protoMessage = FeedbackMessage.encode({
        student: "Daniel",
        feedback: "I really liked the course",
    });

    const serializedMessage = FeedbackMessage.encode(protoMessage).finish();

    // Send the message using Light Push
    await node.lightPush.send(encoder, {
        payload: serializedMessage,
    });
    console.log("Message sent");


    
  return (
    <div>Feedback</div>
  )
}
