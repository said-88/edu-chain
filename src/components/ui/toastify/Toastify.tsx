"use client";
import { Button } from '@/components/ui'
import { useToast } from "@/components/ui/use-toast"
import { useWaku, useLightPush, useFilterMessages } from "@waku/react";
import { useState, useEffect } from 'react';
import { createEncoder, createDecoder } from "@waku/sdk";
import protobuf from 'protobufjs';

export const Toastify = () => {
    const { toast } = useToast();

    const { node, error, isLoading } = useWaku();
    // const [inputMessage, setInputMessage] = useState("");
    
    
    // const handleInputChange = (e) => {
      //     setInputMessage(e.target.value);
      // };
      
      const contentTopic = "/waku-react-guide/1/toast/proto";
      const encoder = createEncoder({ contentTopic });
      const decoder = createDecoder(contentTopic);
      
      const NotificationMessage = new protobuf.Type("NotificationMessage")
      .add(new protobuf.Field("timestamp", 1, "uint64"))
      .add(new protobuf.Field("title", 2, "string"))
      .add(new protobuf.Field("description", 3, "string"));
      
      const { push } = useLightPush({ node, encoder });
      const { messages: filterMessages } = useFilterMessages({ node, decoder });
      const [messages, setMessages] = useState([]);

      const sendMessage = async () => {
        if (!push) return;
        const timestamp = Date.now();
        const title = "¡¡¡Felicidades!!!";
        const description = "Ha llegado a la meta puede conseguir una beca.";
        const protoMessage = NotificationMessage.create({
          timestamp,
          title,
          description
        });
        const payload = NotificationMessage.encode(protoMessage).finish();
        const { recipients, errors = [] } = await push({ payload });
        if (errors.length === 0) {
          console.log("MESSAGE PUSHED");
        } else {
          console.log(errors);
        }
      }

    // useEffect(() => {
    //     setMessages(filterMessages.map((wakuMessage) => {
    //         if (!wakuMessage.payload) return;
    //         return ChatMessage.decode(wakuMessage.payload);
    //     }));
    // }, [filterMessages]);

    useEffect(() => {
      
      messages.forEach(message => {
        toast({
          title: message.title,
          description: message.description,
        });
      });
    }, [messages, toast]);

  return <></>
}
