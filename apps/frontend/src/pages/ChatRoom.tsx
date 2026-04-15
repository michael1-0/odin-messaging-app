import { useParams } from "react-router";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import type { Message } from "../types";

type RoomMessagesResponse = {
  messages?: Array<{
    content: string;
    sender?: {
      id: number;
      username: string;
    };
  }>;
  error?: string;
};

function ChatRoom() {
  const params = useParams();
  const socketRef = useRef<Socket | null>(null);
  const currentUserId = Number(localStorage.getItem("userId"));

  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [messageError, setMessageError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const roomId = Number(params.roomId);

    if (!token || Number.isNaN(roomId)) {
      setIsLoadingMessages(false);
      setMessageError("Room not found");
      return;
    }

    (async function initializeChat() {
      try {
        setMessageError("");
        setIsLoadingMessages(true);

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}rooms/${roomId}/messages`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data = (await res.json()) as RoomMessagesResponse;

        if (!res.ok) {
          setMessageError(data.error ?? "Failed to fetch past messages");
          return;
        }

        const mappedMessages: Message[] = (data.messages ?? []).map(
          (message) => ({
            content: message.content,
            userId: message.sender?.id ?? 0,
            username: message.sender?.username,
          }),
        );
        setMessages(mappedMessages);
      } catch {
        setMessageError("There was an error trying to fetch messages");
      } finally {
        setIsLoadingMessages(false);
      }

      socketRef.current = io(import.meta.env.VITE_SERVER_URL, {
        auth: { token },
      });
      socketRef.current.emit("join chat", roomId);
      socketRef.current.on("message chat", (message: Message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
        window.dispatchEvent(
          new CustomEvent("chat:activity", {
            detail: { roomId },
          }),
        );
      });
    })();

    return () => {
      socketRef.current?.disconnect();
    };
  }, [params.roomId, currentUserId]);

  function handleMessageSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!messageInput) return;
    socketRef.current?.emit(`message chat`, {
      roomId: Number(params.roomId),
      message: messageInput,
    });
    setMessageInput("");
  }

  return (
    <div className="flex w-full h-dvh bg-gray-50 overflow-x-hidden">
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Chat Header */}
        <header className="flex h-16 items-center justify-between px-3 sm:px-6">
          <h2 className="text-xl font-semibold">Room {`#${params.roomId}`}</h2>
        </header>

        {/* Message List */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 min-w-0">
          {isLoadingMessages && (
            <p className="text-sm text-neutral-500">Loading messages...</p>
          )}
          {!isLoadingMessages && messageError && (
            <p className="text-sm text-red-600">{messageError}</p>
          )}
          <div className="flex flex-col space-y-2">
            {!isLoadingMessages &&
              messages.map((message: Message, index: number) => {
                const isMyMessage = currentUserId === message.userId;
                return (
                  <div
                    className={
                      isMyMessage
                        ? "self-end rounded-lg bg-blue-500 text-white p-2.5 sm:p-3 max-w-[92%] sm:max-w-[70%] min-w-0 overflow-hidden"
                        : "self-start rounded-lg bg-gray-200 p-2.5 sm:p-3 max-w-[92%] sm:max-w-[70%] min-w-0 overflow-hidden"
                    }
                    key={index}
                  >
                    <p className="text-xs font-semibold wrap-anywhere">
                      {(message.username ?? "User") +
                        ` with an id of ${message.userId}`}
                    </p>
                    <p className="text-base wrap-anywhere whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>
                );
              })}
          </div>
        </main>

        {/* Message Input Form */}
        <footer className="border-t border-neutral-200 bg-white p-2 sm:p-4">
          <form
            className="flex min-w-0 gap-2"
            onSubmit={(e) => handleMessageSubmit(e)}
          >
            <input
              type="text"
              placeholder="Type your message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 sm:px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="shrink-0 rounded-lg bg-blue-600 px-4 sm:px-6 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Send
            </button>
          </form>
        </footer>
      </div>
    </div>
  );
}

export default ChatRoom;
