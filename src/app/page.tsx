"use client";
import { LightNodeProvider, useFilterMessages, useWaku } from "@waku/react";
import { createEncoder, createDecoder } from "@waku/sdk";
import protobuf from 'protobufjs';
import { Alert } from "@/components/ui";
import { useEffect, useState } from "react";
import { JsonRpcProvider, ethers } from 'ethers';


export default function Home() {

  const [messages, setMessages] = useState([]);
  const { node, error, isLoading } = useWaku();

  const contractAddress = 'your_contract_address';
  const contractABI: never[] = [];

  async function getMessages() {
    // Create a provider
    const provider = new JsonRpcProvider('https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID');

    // Create a new instance of the contract
    const contract = new ethers.Contract(contractAddress, contractABI, provider);

    const messages = await contract.getMessages();
    setMessages(messages);
  }

  const contentTopic = "/waku-react-guide/1/chat/proto";
  const encoder = createEncoder({ contentTopic });
  const decoder = createDecoder(contentTopic);

  const ChatMessage = new protobuf.Type("ChatMessage")
    .add(new protobuf.Field("timestamp", 1, "uint64"))
    .add(new protobuf.Field("message", 2, "string"));

  const NODE_OPTIONS = { defaultBootstrap: true };
  // const { messages: filterMessages } = useFilterMessages({ node, decoder });

  useEffect(() => {
    getMessages();
  });

  return (
    <LightNodeProvider options={NODE_OPTIONS}>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <Alert />
      </main>
    </LightNodeProvider>
  );
}
