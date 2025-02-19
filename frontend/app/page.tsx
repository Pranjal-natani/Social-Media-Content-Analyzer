"use client";
import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [readability, setReadability] = useState<number | null>(null);
  const [sentiment, setSentiment] = useState<number | null>(null);
  const [hashtags, setHashtags] = useState<string[] | null>(null);  

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0] || null);
  };

  const uploadFile = async (type: "pdf" | "image") => {
    if (!file) return alert("Please select a file!");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `https://social-media-content-analyzer-eqvw.onrender.com/upload/${type}`,
        formData
      );
      setText(response.data.text);
      setHashtags(null); 
    } catch (error) {
      console.error(error); 
      alert("Error extracting text!");
    }
  };

  const analyzeReadability = async () => {
    if (!text) return alert("No text to analyze!");
    try {
      const response = await axios.post("https://social-media-content-analyzer-eqvw.onrender.com/analyze/readability", { text });
      setReadability(response.data.readability);
    } catch (error) {
      console.error(error); 
      alert("Error analyzing readability!");
    }
  };

  const analyzeSentiment = async () => {
    if (!text) return alert("No text to analyze!");
    try {
      const response = await axios.post("https://social-media-content-analyzer-eqvw.onrender.com/analyze/sentiment", { text });
      setSentiment(response.data.sentiment);
    } catch (error) {
      console.error(error); 
      alert("Error analyzing sentiment!");
    }
  };

  const extractHashtags = async () => {
    if (!text) {
      setHashtags(null);
      return;
    }

    try {
      const response = await fetch("https://social-media-content-analyzer-eqvw.onrender.com/analyze/hashtags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      setHashtags(data.hashtags.length > 0 ? data.hashtags : []); 
    } catch (error) {
      console.error(error); 
      setHashtags([]);
    }
  };

  const resetExtraction = () => {
    setFile(null);
    setText("");
    setReadability(null);
    setSentiment(null);
    setHashtags(null);

    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <div className="mb-4">
        <input
          id="fileInput"
          type="file"
          onChange={handleFileChange}
          className="border border-gray-300 p-2 rounded-md mb-4"
        />
      </div>
      <div className="flex gap-4 mb-4">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700" onClick={() => uploadFile("pdf")}>
          Extract PDF Text
        </button>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-green-700" onClick={() => uploadFile("image")}>
          Extract Image Text
        </button>
        {text && (
          <button className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-700" onClick={resetExtraction}>
            Clear
          </button>
        )}
      </div>

      <textarea
        className="w-full max-w-4xl p-4 mt-4 border border-1 border-black rounded-lg shadow-sm bg-white text-base"
        rows={6}
        value={text}
        readOnly
      />

      {text && (
        <div className="flex gap-4 mt-6">
          <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-yellow-600" onClick={analyzeReadability}>
            Analyze Readability
          </button>
          <button className="bg-purple-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-purple-600" onClick={analyzeSentiment}>
            Analyze Sentiment
          </button>
          <button className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-600" onClick={extractHashtags}>
            Extract Hashtags
          </button>
        </div>
      )}

      <div className="mt-6 p-4 bg-white shadow-lg rounded-lg w-full max-w-4xl border border-gray-300">
        {readability !== null && (
          <p className="w-full max-w-4xl p-4 mt-4 border border-1 border-black rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700">
            <strong>Readability Score:</strong> {readability}
          </p>
        )}
        {sentiment !== null && (
          <p className="w-full max-w-4xl p-4 mt-4 border border-1 border-black rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700">
            <strong>Sentiment Score:</strong> {sentiment}
          </p>
        )}
        {hashtags !== null && (
          <p className="w-full max-w-4xl p-4 mt-4 border border-1 border-black rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700">
            <strong>Hashtags:</strong> {hashtags.length > 0 ? hashtags.join(", ") : "No hashtags found"}
          </p>
        )}
      </div>
    </div>
  );
}
