import Help from "@/components/Help";
import Home from "@/pages/Home";
import { MessageSquareText } from "lucide-react";

function App() {
  return (
    <>
      <nav className="fixed top-0 left-0 bg-background w-full flex justify-between px-8 py-5">
        <a
          href="/"
          className="flex gap-2 items-center font-serif text-2xl font-semibold"
        >
          <MessageSquareText className="text-primary" size={48} />
          Debatní chat
        </a>

        <Help></Help>
      </nav>

      <main className="min-h-screen w-screen flex justify-center items-center py-32">
        <Home></Home>
      </main>
    </>
  );
}

export default App;
