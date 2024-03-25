"use client";
import {
    Book,
    Code2,
    CornerDownLeft,
    LifeBuoy,
    Mic,
    Paperclip,
    Settings,
    Settings2,
    Share,
    SquareTerminal,
    SquareUser,
    Triangle,
  } from "lucide-react"
  import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } from "@/components/ui/drawer/drawer"
  import { Label, Textarea, Input, Button,
    TooltipProvider,
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui"
import { useEffect, useState } from "react"
import { FeedbackMessage } from "@/types"
import { useFilterMessages, useLightPush, useStoreMessages, useWaku } from "@waku/react";
import { createDecoder, createEncoder } from "@waku/sdk";

export const Feedback = () => {
  const { node } = useWaku();
  const [inputMessage, setInputMessage] = useState("");
  const [feedbackMessage, setFeedbackMessages] = useState("");
  
  const contentTopic = "/educhain/1/feedback/proto";
  const encoder = createEncoder({ contentTopic });
  const decoder = createDecoder(contentTopic);

  const handleTAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFeedbackMessages(e.target.value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
  };

  const { push } = useLightPush({ node, encoder });
  const { messages: filterMessages } = useFilterMessages({ node, decoder });
  const { messages: storeMessages } = useStoreMessages({ node, decoder });

  const sendFeedback = async ({ title, content}: FeedbackMessage) => {
    if (!node) return;
    if (!push || feedbackMessage.length === 0) return;
    const id = Math.random().toString(36).substring(7);
    const timestamp = Date.now();
    const protoMessage = FeedbackMessage.create({
      timestamp,
      id,
      title,
      content
    });
    const payload = FeedbackMessage.encode(protoMessage).finish();
    const { errors = [] } = await push({ payload });
    if (errors.length === 0) {
      setInputMessage("");
      setFeedbackMessages("");
      console.log("FEEDBACK PUSHED");
    } else {
      console.log(errors);
    }
  }

    const decodeFeedbackMessage = (msg) => {
     if (!msg.payload) return;
     const {id, timestamp, title, content} = FeedbackMessage.decode(msg.payload);
     if (!id || !timestamp || !title || !content) return;

     const time = new Date();
     time.setTime(Number(timestamp));

     return {
       id, 
       title,
       content,
       timestamp: time
     };
   } 
    useEffect(() => {
      if (node !== undefined) {
        console.log("Node is ready");
      }
    }, [node]);

    useEffect(() => {
    
      filterMessages.forEach((msg) => {
        const message = decodeFeedbackMessage(msg);
        console.log("Message received:", message);

      });
    }, [filterMessages, storeMessages]);
  return (
    <div className="grid h-screen w-full pl-[53px]">
      <aside className="inset-y fixed left-0 z-20 flex h-full flex-col border-r">
        <div className="border-b p-2">
          <Button variant="outline" size="icon" aria-label="Home">
            <Triangle className="size-5 fill-foreground" />
          </Button>
        </div>
        <nav className="grid gap-1 p-2">
          <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg bg-muted"
                aria-label="Carta Privada"
              >
                <SquareTerminal className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              Carta Privada
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg"
                aria-label="API"
              >
                <Code2 className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              API
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg"
                aria-label="Documentation"
              >
                <Book className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              Documentation
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg"
                aria-label="Settings"
              >
                <Settings2 className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              Settings
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        </nav>
        <nav className="mt-auto grid gap-1 p-2">
          <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="mt-auto rounded-lg"
                aria-label="Help"
              >
                <LifeBuoy className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              Help
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="mt-auto rounded-lg"
                aria-label="Account"
              >
                <SquareUser className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              Account
            </TooltipContent>
          </Tooltip>
          </TooltipProvider>
        </nav>
      </aside>
      <div className="flex flex-col">
        <header className="sticky top-0 z-10 flex h-[53px] items-center gap-1 border-b bg-muted/50 px-4 rounded">
          <h1 className="text-xl font-semibold">Private Feedback</h1>
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Settings className="size-4" />
                <span className="sr-only">Settings</span>
              </Button>
            </DrawerTrigger>
            <DrawerContent className="max-h-[80vh]">
              <DrawerHeader>
                <DrawerTitle>Mejoremos juntos</DrawerTitle>
                <DrawerDescription>
                 Tu feedback es importante para nosotros.
                </DrawerDescription>
              </DrawerHeader>
              <div className="grid w-full items-start gap-6 overflow-auto p-4 pt-0">
              <div className="grid gap-6 rounded-lg border p-4">
                <legend className="-ml-1 px-1 text-sm font-medium">
                  Feedback
                </legend>
                <div className="grid gap-3">
                  <Label htmlFor="role">Título</Label>
                  <Input value={inputMessage} onChange={handleInputChange}/>
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="content">Contenido</Label>
                </div>
              <div className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring">
                <Textarea
                  id="content"
                  value={feedbackMessage}
                  onChange={handleTAreaChange}
                  placeholder="Type your message here..."
                  className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
                />
              <div className="flex items-center p-3 pt-0">
                <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Paperclip className="size-4" />
                      <span className="sr-only">Attach file</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Attach File</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Mic className="size-4" />
                      <span className="sr-only">Use Microphone</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Use Microphone</TooltipContent>
                </Tooltip>
                </TooltipProvider>
                <Button  onClick={() => sendFeedback({title: inputMessage, content: feedbackMessage })} size="sm" className="ml-auto gap-1.5">
                  Send Message
                  <CornerDownLeft className="size-3.5" />
                </Button>
              </div>
            </div>
              </div>
              </div>
            </DrawerContent>
          </Drawer>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto gap-1.5 text-sm"
          >
            <Share className="size-3.5" />
            Share
          </Button>
        </header>
        <main className="gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-1">
          <div className="relative w-1/2 mx-auto hidden flex-col items-start gap-8 md:flex">
            <div className="grid w-full items-start gap-6">
              <div className="grid gap-6 rounded-lg border p-4">
                <legend className="-ml-1 px-1 text-sm font-medium">
                  Feedback
                </legend>
                <div className="grid gap-3">
                  <Label htmlFor="role">Título</Label>
                  <Input 
                  value={inputMessage}
                  onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="content">Contenido</Label>
                </div>
              <div className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring">
                <Textarea
                  id="content"
                  value={feedbackMessage}
                  onChange={handleTAreaChange}
                  placeholder="Type your message here..."
                  className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
                />
              <div className="flex items-center p-3 pt-0">
                <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Paperclip className="size-4" />
                      <span className="sr-only">Attach file</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Attach File</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Mic className="size-4" />
                      <span className="sr-only">Use Microphone</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Use Microphone</TooltipContent>
                </Tooltip>
                </TooltipProvider>
                <Button onClick={() => sendFeedback({title: inputMessage, content: feedbackMessage })} size="sm" className="ml-auto gap-1.5">
                  Send Message
                  <CornerDownLeft className="size-3.5" />
                </Button>
              </div>
            </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
  