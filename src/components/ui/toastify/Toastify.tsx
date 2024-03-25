"use client";
import { useEffect} from 'react';
import { useToast } from "@/components/ui/use-toast"
import { useWaku, useLightPush, useFilterMessages} from "@waku/react";
import { createEncoder, createDecoder} from "@waku/sdk";
import { NotificationMessage } from "@/types";

export const Toastify = () => {
    const { toast } = useToast();

    const { node } = useWaku();

      const contentTopic = "/educhain/1/toast/proto";
      const encoder = createEncoder({ contentTopic, ephemeral: true});
      const decoder = createDecoder(contentTopic);
      
      const { push } = useLightPush({ node, encoder });
      const { messages: filterMessages } = useFilterMessages({ node, decoder });

      const sendMessage = async () => {
        if (!node) return;
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
        const { errors = [] } = await push({ payload });
        if (errors.length === 0) {
          console.log("MESSAGE PUSHED");
        } else {
          console.log(errors);
        }
      }

      const decodeMessage = (msg) => {
        if (!msg.payload) return;
        const {timestamp, title, description} = NotificationMessage.decode(msg.payload);
        if (!timestamp || !title || !description) return;

        const time = new Date();
        time.setTime(Number(timestamp));

        return {
          title,
          description,
          timestamp: time
        };
      } 

      useEffect(() => {
        if (node !== undefined) {
          sendMessage();
        }
      }, [node]);

      useEffect(() => {
        filterMessages.forEach((msg) => {
          const message = decodeMessage(msg);
          console.log("Message received:", message);
          if (message) {
            toast({
              title: message.title,
              description: message.description
            });
          }
        });
      }, [filterMessages, toast]);

  return <></>
}
