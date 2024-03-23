import { createDecoder, createEncoder, LightNode} from "@waku/sdk";
import { useFilterMessages, useLightPush, useStoreMessages, useWaku  } from "@waku/react";
import { useEffect, useState } from "react";
import protobuf from "protobufjs";

interface Props {
  student: string;
  feedback: string;
}

export const Feedbackk = () => {
    const [inputMessage, setInputMessage] = useState("");
    
    const { node, error, isLoading } = useWaku<LightNode>();
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputMessage(e.target.value);
    };
    
    const contentTopic = "/edu-chain/1/feedback/proto";
    const encoder = createEncoder({ contentTopic });
    const decoder = createDecoder(contentTopic);

    // Define structure of the message
    const FeedbackMessage = new protobuf.Type("FeedbackMessage")
      .add(new protobuf.Field("student", 1, "string"))
      .add(new protobuf.Field("feedback", 2, "string"));

    const { push } = useLightPush({ node, encoder });

    const [messages, setMessages] = useState<Props[]>([]);
    const { messages: storeMessages } = useStoreMessages({ node, decoder });
    const { messages: filterMessages } = useFilterMessages({ node, decoder });

    const sendMessage = async () => {
        if (!push || inputMessage.length === 0) return;

        const student = "James Maxwell";
        const protoMessage = FeedbackMessage.create({
            student: student || "Anonymous",
            feedback: inputMessage,
        });

        // Serialize the message and push it to the network
        const payload = FeedbackMessage.encode(protoMessage).finish();
        const { recipients, errors = [] } = await push({ payload });

        if (errors.length === 0) {
            console.log(payload);
            setInputMessage("");
            console.log("MESSAGE PUSHED");
        } else {
            console.log(errors);
        }
    };

     useEffect(() => {
         if (storeMessages.length > 0) {
             const newMessages = storeMessages.map((msg) => {
                 const protoMessage = FeedbackMessage.decode(msg.payload);
                 return {
                     student: protoMessage.student,
                     feedback: protoMessage.feedback,
                 };
             });
       // Only add the message if it's not already in the state
       const uniqueMessages = newMessages.filter(
         (newMsg) => !messages.some(
             (existingMsg) => existingMsg.feedback === newMsg.feedback
         )
       );

       if (uniqueMessages.length > 0) {
         setMessages((prevMessages) => [...prevMessages, ...uniqueMessages]);
       }
         }
     }, [storeMessages]);

  return (
    <div>
      <h1>Waku React Demo</h1>
      <div className="">
        {messages.map(({student, feedback}, key) => (
          <div key={key}>
            <span>{student}</span>
            <div>{feedback}</div>
          </div>
        ))}
      </div>
      <div className="mt-3">
        <input
          type="text"
          value={inputMessage}
          onChange={handleInputChange}
          placeholder="Type your message..."
        />
        <button className="send-button" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}
