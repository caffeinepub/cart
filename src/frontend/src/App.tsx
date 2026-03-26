import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import FireEyesGame from "./pages/FireEyesGame";
import FireEyesLanding from "./pages/FireEyesLanding";

export type GameScreen = "landing" | "playing";

export default function App() {
  const [screen, setScreen] = useState<GameScreen>("landing");

  return (
    <>
      {screen === "landing" ? (
        <FireEyesLanding onPlay={() => setScreen("playing")} />
      ) : (
        <FireEyesGame onExit={() => setScreen("landing")} />
      )}
      <Toaster position="bottom-right" theme="dark" />
    </>
  );
}
