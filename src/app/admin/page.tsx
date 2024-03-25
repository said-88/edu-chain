"use client";
import { Navbar, RetrieveFeedback } from "@/components/ui";
import { LightNodeProvider } from "@waku/react";
import { Protocols } from "@waku/sdk";


export default function Page() {
    return (
        <LightNodeProvider options={{ defaultBootstrap: true }}  
        protocols={[Protocols.LightPush]}
      >
         <div className="mb-3">
            <Navbar />
         </div>
         <main className="container">
            <RetrieveFeedback />
         </main>    
        </LightNodeProvider>
    );
}