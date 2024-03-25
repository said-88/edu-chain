"use client";
import { LightNodeProvider } from "@waku/react";
import { Protocols } from "@waku/sdk"; 
import { CardStudent, Button, Toastify, Feedback, Navbar } from "@/components/ui";
import { useEffect, useState } from "react";


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
      {showToastify && <Toastify />}
      <Navbar />
      <main className="container min-h-screen flex flex-col items-center justify-between">
        <h1 className="text-6xl font-extrabold m-2 pt-3">EduChain</h1>
        <Button 
          onClick={() => handleClick()}
          variant="outline"
        >
          Connect
        </Button>
        <div className="m-4">
        { showCard && 
        <CardStudent
          address="0x1234567890abcdef1234567890abcdef12345678"
          nombre="Daniel" 
          indice={90}
        />}
        </div>
        <Feedback/>
      </main>  
    </LightNodeProvider>
  );
}
