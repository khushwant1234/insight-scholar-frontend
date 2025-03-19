import React, { useState, useEffect, useRef, useContext } from "react";
import { io } from "socket.io-client";
import { UserContext } from "../context/userContext";
import { GetApiCall } from "../utils/apiCall";
import ScrollToBottom from "react-scroll-to-bottom";
import { toast } from "react-toastify";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const socketUrl = backendUrl;
const MESSAGE_RETENTION_PERIOD = 10 * 60 * 1000; // 10 minutes in milliseconds

const LiveChat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatExpanded, setChatExpanded] = useState(false);
  const { user } = useContext(UserContext);
  const socketRef = useRef();
  const messagesEndRef = useRef(null);

  // Filter function to remove messages older than 10 minutes
  const filterRecentMessages = (msgs) => {
    const cutoffTime = new Date(Date.now() - MESSAGE_RETENTION_PERIOD);
    return msgs.filter((msg) => new Date(msg.createdAt) >= cutoffTime);
  };

  // Connect to socket.io server
  useEffect(() => {
    try {
      socketRef.current = io(socketUrl, {
        transports: ["websocket", "polling"],
      });

      socketRef.current.on("connect", () => {
        console.log("Connected to WebSocket server");
      });

      socketRef.current.on("connect_error", (err) => {
        console.log(`connect_error due to ${err.message}`);
      });

      // Get chat history
      const fetchChatHistory = async () => {
        try {
          const response = await GetApiCall(`${backendUrl}/api/chat/history`);
          if (response.success) {
            setMessages(response.messages);
          }
        } catch (error) {
          console.error("Failed to fetch chat history:", error);
        }
      };

      fetchChatHistory();

      // Listen for incoming messages
      socketRef.current.on("message", (message) => {
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages, message];
          return filterRecentMessages(updatedMessages);
        });
      });
    } catch (error) {
      console.error("Socket connection error:", error);
    }

    // Cleanup on component unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Set up periodic message cleanup (every 30 seconds)
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      setMessages((prevMessages) => filterRecentMessages(prevMessages));
    }, 30000);

    return () => clearInterval(cleanupInterval);
  }, []);

  // Send message handler
  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please log in to send messages");
      return;
    }

    if (!newMessage.trim()) return;

    try {
      // Send message to server
      socketRef.current.emit("sendMessage", {
        userId: user._id,
        message: newMessage.trim(),
      });

      // Clear input field
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="fixed bottom-4 right-4 z-10">
      {/* Chat header/toggle button */}
      <button
        onClick={() => setChatExpanded(!chatExpanded)}
        className="bg-[#D43134C4] text-white py-2 px-4 rounded-t-lg font-semibold flex items-center justify-between w-full sm:w-64 md:w-80"
      >
        <span className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          Live Chat
        </span>
        <span className="text-lg">{chatExpanded ? "▼" : "▲"}</span>
      </button>

      {/* Chat container */}
      {chatExpanded && (
        <div className="bg-white border border-gray-300 rounded-b-lg shadow-lg flex flex-col w-full sm:w-64 md:w-80 h-64 sm:h-96">
          {/* Messages area with fallback for ScrollToBottom */}
          {typeof ScrollToBottom === "function" ? (
            <ScrollToBottom className="flex-1 p-3 overflow-y-auto">
              {renderMessages()}
            </ScrollToBottom>
          ) : (
            <div className="flex-1 p-3 overflow-y-auto">
              {renderMessages()}
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Message input */}
          <form
            onSubmit={handleSendMessage}
            className="border-t border-gray-300 p-2 flex"
          >
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-2 py-2 border border-gray-300 rounded-l-md focus:outline-none text-sm"
              disabled={!user}
            />
            <button
              type="submit"
              disabled={!user || !newMessage.trim()}
              className={`px-4 py-2 ${
                !user || !newMessage.trim()
                  ? "bg-gray-300"
                  : "bg-[#D43134C4] hover:bg-[#7B0F119E]"
              } text-white rounded-r-md text-sm font-medium`}
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );

  // Helper function to render messages
  function renderMessages() {
    return messages.map((msg, index) => (
      <div
        key={msg._id || index}
        className={`mb-3 ${
          user && msg.sender._id === user._id ? "text-right" : "text-left"
        }`}
      >
        <div
          className={`flex items-center mb-1 ${
            user && msg.sender._id === user._id ? "justify-end" : ""
          }`}
        >
          {user && msg.sender._id !== user._id && (
            <img
              src={
                msg.sender.profilePic ||
                "https://api.dicebear.com/7.x/avataaars/svg?seed=Default"
              }
              alt={msg.sender.name}
              className="w-6 h-6 rounded-full mr-2"
            />
          )}
          <span className="text-xs font-semibold">{msg.sender.name}</span>
          <span className="text-xs text-gray-500 ml-2">
            {formatTime(msg.createdAt)}
          </span>
          {user && msg.sender._id === user._id && (
            <img
              src={
                msg.sender.profilePic ||
                "https://api.dicebear.com/7.x/avataaars/svg?seed=Default"
              }
              alt={msg.sender.name}
              className="w-6 h-6 rounded-full ml-2"
            />
          )}
        </div>
        <div
          className={`inline-block rounded-lg py-2 px-3 max-w-[85%] text-sm ${
            user && msg.sender._id === user._id
              ? "bg-[#D43134C4] text-white rounded-tr-none"
              : "bg-gray-200 rounded-tl-none"
          }`}
        >
          {msg.content}
        </div>
      </div>
    ));
  }
};

export default LiveChat;
