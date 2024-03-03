import Help from "@/components/Help";
import { Toaster } from "@/components/ui/toaster";
import Admin from "@/pages/Admin";
import Chat from "@/pages/Chat";
import Create from "@/pages/Create";
import Home from "@/pages/Home";
import { MessageSquareText } from "lucide-react";
import { Link, Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <nav className="fixed top-0 left-0 bg-background w-full flex justify-between px-8 py-5">
        <Link
          to="/"
          className="flex gap-2 items-center font-serif text-2xl font-semibold"
        >
          <MessageSquareText className="text-primary" size={48} />
          Debatní chat
        </Link>

        <Help></Help>
      </nav>

      <main className="min-h-screen w-screen flex justify-center items-center py-32">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<Create />} />
          <Route path="/admin/:chat_id" element={<Admin />} />
          <Route path="/chat/:chat_id" element={<Chat />} />
        </Routes>
        <Toaster />
      </main>
    </>
  );
}

export default App;
