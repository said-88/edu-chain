import { Button } from '@/components/ui'
import { useToast } from "@/components/ui/use-toast"
import { useWaku, useLightPush, useFilterMessages } from "@waku/react";
import { useState, useEffect } from 'react';
import { createEncoder, createDecoder } from "@waku/sdk";
import protobuf from 'protobufjs';

export const Toastify = () => {
    const { toast } = useToast()

    // const { node, error, isLoading } = useWaku();
    // const [inputMessage, setInputMessage] = useState("");
    // const [messages, setMessages] = useState([]);

    // const { messages: filterMessages } = useFilterMessages({ node, decoder });
    
    // const handleInputChange = (e) => {
    //     setInputMessage(e.target.value);
    // };

    // const contentTopic = "/waku-react-guide/1/toast/proto";
    // const encoder = createEncoder({ contentTopic });
    // const decoder = createDecoder(contentTopic);

    // const ChatMessage = new protobuf.Type("ChatMessage")
    // .add(new protobuf.Field("timestamp", 1, "uint64"))
    // .add(new protobuf.Field("message", 2, "string"));

    // const sendMessage = async () => {

    // }

    // useEffect(() => {
    //     setMessages(filterMessages.map((wakuMessage) => {
    //         if (!wakuMessage.payload) return;
    //         return ChatMessage.decode(wakuMessage.payload);
    //     }));
    // }, [filterMessages]);

  return (
    <Button
    variant="outline"
    onClick={() => {
      toast({
        title: "¡¡¡Felicidades!!!",
        description: "Ha llegado a la meta puede conseguir una beca.",
      })
    }}
  >
    Show Toast
  </Button>
  )
}
