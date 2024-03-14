"use client";
import { LightNodeProvider } from "@waku/react";
import { Alert, CardStudent, Button} from "@/components/ui";
import { useState } from "react";


export default function Home() {
  const NODE_OPTIONS = { defaultBootstrap: true };
  const [showCard, setShowCard] = useState(false);

  const handleClick = () => {
    setShowCard(true);
  };

  return (
    <LightNodeProvider options={NODE_OPTIONS}>
      <main className="bg-slate-100 flex min-h-screen flex-col items-center justify-between p-24">
        {/* <Alert /> */}
        <h1 className="text-6xl">EDU CHAIN</h1>
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
      </main>
    </LightNodeProvider>
  );
}
