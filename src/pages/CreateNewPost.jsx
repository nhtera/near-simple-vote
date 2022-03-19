import React, { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
  const navigate = useNavigate();
  
  const handleFormSubmit = useCallback(async (event) => {
    event.preventDefault();

    if (!window.walletConnection.isSignedIn()) {
      alert("Please signin before create a post");
      return;
    }

    const title = event.target.elements.title.value;
    const body = event.target.elements.content.value;

    const result = window.contract.create_post({
      title,
      body,
    });

    const postId = await result;
    alert('Create post success');
    navigate('/');
  });

  return (
    <form onSubmit={handleFormSubmit}>
      <div className="container px-5 py-24 mx-auto flex">
        <div className="bg-white rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0 relative z-10 shadow-md">
          <h2 className="text-gray-900 text-lg mb-1 font-medium title-font">Create new post</h2>
          <div className="relative mb-4">
            <label htmlFor="title" className="leading-7 text-sm text-gray-600">Title</label>
            <input type="title" id="title" name="title" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>
          <div className="relative mb-4">
            <label htmlFor="content" className="leading-7 text-sm text-gray-600">Content</label>
            <textarea id="content" name="content" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"></textarea>
          </div>
          <button className="text-white bg-green-600 border-0 py-2 px-6 focus:outline-none hover:bg-green-700 rounded text-lg">Submit</button>
        </div>
    </div>
    </form>
  )
}
