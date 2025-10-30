"use client";
import { useState } from "react";

export default function Home() {
  // const [response, setResponse] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle PDF Upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try{
      const res = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await res.json();
      setResumeText(data.text);
    } catch (error) {
      console.error("Error uploading PDF:", error);
      alert("Failed to upload or read PDF!");
    }
  };

  // Mock AI Tailoring
  const handleSubmit = async () => {
    if(!resumeText || !jobDescription){
      alert("Please upload your resume text and paste a job description!");
      return;
    }

    setLoading(true);
    try{
      const res = await fetch("http://localhost:5000/api/tailor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jobDescription }),
      });
      
      const data = await res.json();
      setOutput(data.tailoredText);
    } catch(error) {
      console.error("Error:", error);
      alert("Failed to connect to backend!");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-6">
      <div className="max-w-2xl w-full bg-white p-8 rounded-2xl shadow-md">
        <h1 className="text-3xl font-bold text-center mb-2 text-blue-700">ResuMate</h1>
        <p className="text-gray-600 text-center mb-6">
          Tailor your resume perfectly to any job description ✨
        </p>

        {/* Resume Input */}
        <label className="block font-medium mb-1 text-black">Upload Resume (PDF) </label>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileUpload}
          className="mb-4"
        />

        <textarea
          className="w-full border rounded-lg p-3 mb-4 h-40 text-black"
          placeholder="Resume text will appear here..."
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
        />

        {/* Job Description Input */}
        <label className="block font-medium mb-1 text-black">Paste Job Description</label>
        <textarea
          className="w-full border rounded-lg p-3 mb-6 h-32 text-black"
          placeholder="Paste the job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className={`w-full py-3 rounded-lg text-white font-semibold ${
          loading ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={loading}
        >
          {loading ? "Tailoring..." : "Tailor Resume"}
        </button>

        {/* Output Section */}
        {output && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2 text-black">🎯 Tailored Resume:</h2>
            <div className="border rounded-lg p-3 bg-gray-100 whitespace-pre-wrap text-black">
              {output}
            </div>
          </div>
        )}
      </div>
    </main>
  ); 
}