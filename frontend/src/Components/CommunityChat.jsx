import React, { useState, useRef, useEffect } from "react";

const CommunityChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      user: "Sarah",
      message: "Hey everyone! Anyone studying for the CS finals?",
      timestamp: "2:30 PM",
    },
    {
      id: 2,
      user: "Mike",
      message: "Yeah, I'm working on algorithms right now!",
      timestamp: "2:32 PM",
    },
    {
      id: 3,
      user: "Emma",
      message: "I could use some help with dynamic programming...",
      timestamp: "2:35 PM",
    },
  ]);

  const [newMessage, setNewMessage] = useState("");
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        user: "You",
        message: newMessage,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages([...messages, message]);
      setNewMessage("");
    }
  };

  return (
    <div className="flex flex-col h-[600px]">
      <div className="flex-1 overflow-y-auto mb-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-4 ${
              msg.user === "You" ? "text-right" : "text-left"
            }`}
          >
            <div
              className={`inline-block max-w-[80%] ${
                msg.user === "You"
                  ? "bg-[#D43134C4] text-white"
                  : "bg-[#D9D9D9]"
              } rounded-lg px-4 py-2`}
            >
              <p className="font-medium text-sm">{msg.user}</p>
              <p>{msg.message}</p>
              <p className="text-xs opacity-75 mt-1">{msg.timestamp}</p>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 rounded-lg border border-[#D43134C4]/20 focus:outline-none focus:border-[#D43134C4]"
        />
        <button
          type="submit"
          className="bg-[#D43134C4] text-white px-4 py-2 rounded-lg hover:bg-[#7B0F119E] transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default CommunityChat;
