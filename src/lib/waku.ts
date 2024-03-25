"use client";
import { Dispatch, SetStateAction } from "react";
import type { RelayNode } from "@waku/interfaces";
import { Protocols } from "@waku/interfaces";
import { waitForRemotePeer, createLightNode, createDecoder, createEncoder, LightNode } from '@waku/sdk';
import { bytesToHex, hexToBytes } from "@waku/utils/bytes";
import type { DecodedMessage } from "@waku/message-encryption";
import { FeedbackMessage, NotificationMessage } from "@/types";

export const PublicKeyContentTopic = "/eth-pm/1/public-key/proto";
export const PrivateMessageContentTopic = "/eth-pm/1/private-message/proto";

export const contentTopic = "/educhain/1/toast/proto";
const encoder = createEncoder({ contentTopic, ephemeral: true });
const decoder = createDecoder(contentTopic);

export const createNode = async () => {
    // Create and start a Light Node
  const node = await createLightNode({ defaultBootstrap: true });
  await node.start();
  await waitForRemotePeer(node);
  return node;
}

// pushNotification
export const pushNotification = async (node: LightNode, title: string, description: string) => {
  // Create a Notification Message
  const protoMessage = NotificationMessage.create({
    timestamp: Date.now(),
    title,
    description
  });

  // Encode the message
  const serializedMessage = NotificationMessage.encode(protoMessage).finish();

  // Push the message
  await node.lightPush.send(encoder, { payload: serializedMessage });
}

// suscribeNotification
export const subscribeNotification = async (node: LightNode, callback: any) => {
  
  // What to do with the message
  const _callback = async (msg: DecodedMessage) => {
    if (!msg.payload) return;
    console.log("Message received:", msg);
    
    const notificationObj = NotificationMessage.decode(msg.payload);
    console.log("Notification received:", notificationObj);
  };
  // Create a Filter subscription
  const subscription = await node.filter.createSubscription();
  // Subscribe to content topics and process new message
  await subscription.subscribe([decoder], _callback);
}

// pushFeedback
export const pushFeedback = async (node: LightNode, title: string, content: string) => {
  // Create a Feedback Message
  const protoMessage = FeedbackMessage.create({
    timestamp: Date.now(),
    title,
    content
  });

  // Encode the message
  const serializedMessage = FeedbackMessage.encode(protoMessage).finish();

  // Push the message
  await node.lightPush.send(encoder, { payload: serializedMessage });
}

// suscribeFeedback
export const subscribeFeedback = async (node: LightNode, callback: any) => {
  
  // What to do with the message
  const _callback = async (msg: DecodedMessage) => {
    if (!msg.payload) return;
    console.log("Message received:", msg);
    
    const feedbackObj = FeedbackMessage.decode(msg.payload);
    console.log("Feedback received:", feedbackObj);
  };
  // Create a Filter subscription
  const subscription = await node.filter.createSubscription();
  // Subscribe to content topics and process new message
  await subscription.subscribe([decoder], _callback);
}

export function handlePublicKeyMessage(
  myAddress: string | undefined,
  setter: Dispatch<SetStateAction<Map<string, Uint8Array>>>,
  msg: DecodedMessage
) {
  console.log("Public Key Message received:", msg);
  if (!msg.payload) return;
  const publicKeyMsg = PublicKeyMessage.decode(msg.payload);
  if (!publicKeyMsg) return;
  if (myAddress && equals(publicKeyMsg.ethAddress, hexToBytes(myAddress)))
    return;

  const res = validatePublicKeyMessage(publicKeyMsg);
  console.log("Is Public Key Message valid?", res);

  if (res) {
    setter((prevPks: Map<string, Uint8Array>) => {
      prevPks.set(
        bytesToHex(publicKeyMsg.ethAddress),
        publicKeyMsg.encryptionPublicKey
      );
      return new Map(prevPks);
    });
  }
}

export async function handlePrivateMessage(
  setter: Dispatch<SetStateAction<Message[]>>,
  address: string,
  wakuMsg: DecodedMessage
) {
  console.log("Private Message received:", wakuMsg);
  if (!wakuMsg.payload) return;
  const privateMessage = PrivateMessage.decode(wakuMsg.payload);
  if (!privateMessage) {
    console.log("Failed to decode Private Message");
    return;
  }
  if (!equals(privateMessage.toAddress, hexToBytes(address))) return;

  const timestamp = wakuMsg.timestamp ? wakuMsg.timestamp : new Date();

  console.log("Message decrypted:", privateMessage.message);
  setter((prevMsgs: Message[]) => {
    const copy = prevMsgs.slice();
    copy.push({
      text: privateMessage.message,
      timestamp: timestamp,
    });
    return copy;
  });
}