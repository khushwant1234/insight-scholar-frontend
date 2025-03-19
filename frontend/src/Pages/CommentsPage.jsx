import React from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import FadeWrapper from "../Components/fadeIn";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const CommentsPage = () => {
  // Example comments data - replace with API call
  const comments = [
    {
      id: 1,
      user: "Alex",
      text: "Great research opportunities!",
      date: "2 days ago",
      likes: 10,
    },
    {
      id: 2,
      user: "Maria",
      text: "Amazing campus life!",
      date: "1 week ago",
      likes: 5,
    },
    {
      id: 3,
      user: "John",
      text: "The professors are very helpful!",
      date: "3 days ago",
      likes: 8,
    },
    {
      id: 4,
      user: "Sarah",
      text: "I love the community here!",
      date: "5 days ago",
      likes: 12,
    },
    {
      id: 5,
      user: "David",
      text: "The campus is beautiful!",
      date: "1 month ago",
      likes: 15,
    },
  ];

  // Sort comments by likes in descending order
  const sortedComments = comments.sort((a, b) => b.likes - a.likes);

  return (
    <FadeWrapper>
      <div className="min-h-screen bg-[#D9D9D9] flex flex-col">
        <Navbar />
        <div className="flex-1 container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h1 className="text-3xl font-bold text-[#484848] mb-6">Comments</h1>
            <div className="space-y-4">
              {sortedComments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-[#F9F9F9] p-4 rounded-lg shadow-sm border border-[#D43134C4]/20"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-[#484848]">
                      {comment.user}
                    </h4>
                    <span className="text-sm text-[#484848]">
                      {comment.date}
                    </span>
                  </div>
                  <p className="text-[#484848]">{comment.text}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-[#D43134C4] font-bold">
                      {comment.likes} Likes
                    </span>
                    <button className="bg-[#D43134C4] text-white px-4 py-1 rounded-lg hover:bg-[#7B0F119E] transition-colors">
                      Like
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </FadeWrapper>
  );
};

export default CommentsPage;
