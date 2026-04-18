import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import type { Message } from "../types";

function Home() {
  const currentUserId = Number(localStorage.getItem("userId"));
  const socketRef = useRef<Socket | null>(null);
  const [messageInput, setMessageInput] = useState<string>("");
  const [messages, setMessages] = useState<Array<Message>>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    socketRef.current = io(import.meta.env.VITE_SERVER_URL, {
      auth: { token },
    });
    socketRef.current.on("global chat", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  function handleMessageSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!messageInput) return;
    socketRef.current?.emit("global chat", messageInput);
    setMessageInput("");
  }

  return (
    <div className="flex w-full min-h-dvh bg-gray-50">
      <div className="flex flex-1 flex-col">
        {/* Chat Header */}
        <header className="flex h-16 items-center px-6 pt-2">
          <h2 className="text-xl font-semibold">Global Chat</h2>
        </header>

        {/* Message List */}
        <main className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="flex flex-col space-y-2">
            {messages.map((message: Message, index: number) => {
              const isMyMessage = currentUserId === message.userId;
              return (
                <div
                  className={
                    isMyMessage
                      ? "self-end rounded-lg bg-blue-500 text-white p-3 max-w-[70%]"
                      : "self-start rounded-lg bg-gray-200 p-3 max-w-[70%]"
                  }
                  key={index}
                >
                  <p className="text-xs font-semibold">
                    {(message.username ?? "User") +
                      ` with an id of ${message.userId}`}
                  </p>
                  <p className="text-base">{message.content}</p>
                </div>
              );
            })}
          </div>
        </main>

        {/* Message Input Form */}
        <footer className="border-t border-neutral-200 bg-white p-2">
          <form
            className="flex space-x-2"
            onSubmit={(e) => handleMessageSubmit(e)}
          >
            <input
              type="text"
              placeholder="Type your message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Send
            </button>
          </form>
        </footer>
      </div>
    </div>
  );
}

export default Home;
