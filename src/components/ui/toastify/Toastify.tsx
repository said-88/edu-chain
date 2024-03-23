"use client";
import { useToast } from "@/components/ui/use-toast"
import { useWaku, useLightPush, useFilterMessages, useContentPair } from "@waku/react";
import { useState, useEffect, use } from 'react';
import { createEncoder, createDecoder, createLightNode, waitForRemotePeer } from "@waku/sdk";
import protobuf from 'protobufjs';

export const Toastify = () => {
    const { toast } = useToast();

    const { node } = useWaku();

      const contentTopic = "/educhain/1/toast/proto";
      const encoder = createEncoder({ contentTopic, ephemeral: true});
      const decoder = createDecoder(contentTopic);
      
      const NotificationMessage = new protobuf.Type("NotificationMessage")
      .add(new protobuf.Field("timestamp", 1, "uint64"))
      .add(new protobuf.Field("title", 2, "string"))
      .add(new protobuf.Field("description", 3, "string"));
      
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
          timestamp: time,
          title,
          description
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

      // useEffect(() => {
      //   setMessages(filterMessages.map((wakuMessage) => {
      //     if (!wakuMessage.payload) return;
      //     return NotificationMessage.decode(wakuMessage.payload);
      // }));
      // }, [filterMessages]);
    
    //  useEffect(() => {
    //    messages.forEach(message => {
    //      toast({
    //        title: message.title,
    //       description: message.description,
    //      });
    //    });
    //  }, [messages, toast]);

  return <></>
}
