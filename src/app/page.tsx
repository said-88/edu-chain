"use client";
import { LightNodeProvider } from "@waku/react";
import { Protocols } from "@waku/sdk";
import { CardStudent, Button, Toastify} from "@/components/ui";
import { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Feedbackk } from '../components/ui/feedback/Feedbackk';


export default function Home() {
  const NODE_OPTIONS = { defaultBootstrap: true };
  const [showCard, setShowCard] = useState(false);
  const [indic, setIndice] = useState<number>(91);
  const [showToastify, setShowToastify] = useState<boolean>(false);
  
  const handleClick = () => {
    setShowCard(true);
  };

  const isApprove = (indice: number) => {
    if (indice >= 90) {
      return true;
    }
    return false;
  }

  useEffect(() => {
    setShowToastify(isApprove(indic));
  }, [indic]);

  return (
    <LightNodeProvider options={NODE_OPTIONS}
      protocols={[Protocols.LightPush]}
    >
      <main className="bg-slate-100 min-h-screen flex flex-col items-center justify-between p-24">
        {showToastify && <Toastify />}
        <div className="flex justify-end">
          <ConnectButton />
        </div>
        <h1 className="text-6xl">EduChain</h1>
        <Button 
          onClick={() => handleClick()}
          variant="outline"
          className="mt-3"
        >
          Connect
        </Button>
        <div className="mt-3">
        { showCard && 
        <CardStudent
          address="0x1234567890"
          nombre="Daniel" 
          indice={90}
        />}
        </div>
       {/* <Feedbackk /> */}
      </main>
    </LightNodeProvider>
  );
}
