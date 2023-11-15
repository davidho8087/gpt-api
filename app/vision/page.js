'use client'
import { useState } from "react";
import { useChat } from 'ai/react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/vision/upload02',
  });

  const [imageUrl, setImageUrl] = useState('');

  const handleImageUrlChange = (e) => {
    setImageUrl(e.target.value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Check if both inputs are not empty
    if (!input.trim() || !imageUrl.trim()) {
      alert("Please fill in both fields.");
      return;
    }

    handleSubmit(e, {
      data: { imageUrl: imageUrl },
    });
  };

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {/* Messages */}
      {messages.map((m, index) => (
        <div key={index} className="whitespace-pre-wrap">
          {m.role === 'user' ? 'User: ' : 'AI: '}
          {m.content}
        </div>
      ))}

      {/* Form */}
      <div className='fixed bottom-0'>
      <form onSubmit={handleFormSubmit}>
        {/* Input for image URL */}
        <input
          className="w-full p-2 mb-4 border border-gray-300 rounded shadow-xl"
          value={imageUrl}
          placeholder="Enter image URL here..."
          onChange={handleImageUrlChange}
        />
        {/* Input for chat */}
        <input
          className="w-full p-2 mb-2 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="What does the image show..."
          onChange={handleInputChange}
        />
        {/* Submit button */}
        <button
          type="submit"
          className="w-full p-2 mb-8 bg-blue-500 text-white rounded shadow-xl"
          disabled={!input.trim() || !imageUrl.trim()} // Disable if either field is empty
        >
          Submit
        </button>
      </form>
      </div>
    </div>
  );
}
