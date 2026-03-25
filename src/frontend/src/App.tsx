import { Toaster } from "@/components/ui/sonner";
import RadioApp from "./pages/RadioApp";

export default function App() {
  return (
    <>
      <RadioApp />
      <Toaster position="bottom-right" theme="dark" />
    </>
  );
}
