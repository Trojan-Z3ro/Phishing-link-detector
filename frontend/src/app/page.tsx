"use client";
import { useState } from "react";
import { FaCheck, FaLock } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { IoFlash } from "react-icons/io5";
import Link from "next/link";

export default function Home() {
  const [url, setUrl] = useState("");
  const [prediction, setPrediction] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPrediction(null);
    setError("");

    if (!url.trim()) {
      setError("Please enter a valid URL.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/predict_url`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setPrediction(data.prediction);
      } else {
        setError(data.detail || "Something went wrong");
      }
    } catch (err) {
      setError("Unable to connect to API");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0c10] text-gray-200 flex flex-col items-center justify-center px-4 py-16">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-extrabold tracking-tight text-white">
          <span className="text-blue-500">Guard</span>Link
        </h1>
        <p className="mt-4 text-gray-400 text-sm max-w-2xl mx-auto leading-relaxed">
          Your first line of defense against phishing and online fraud.
          GuardLink scans, analyzes, and classifies suspicious URLs before you
          click keeping your data, identity, and digital life secure.
        </p>
      </header>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-y-8 rounded-2xl border border-gray-800 shadow-2xl overflow-hidden">
        <section className="p-4 md:p-8 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-gray-800">
          <div>
            <h2 className="text-3xl font-semibold text-white mb-4">
              Stay Ahead of Cyber Threats
            </h2>
            <p className="text-gray-400 leading-relaxed mb-6">
              Every day, thousands of phishing sites appear online, designed to
              steal passwords, credit card info, and personal data. GuardLink's
              intelligent detection system uses continuous pattern learning to
              detect and stop even the most deceptive scams in real time.
            </p>
            <ul className="text-gray-300 space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <span className="bg-[#111827] text-white w-6 h-6 flex items-center justify-center border border-gray-700 rounded-sm shrink-0">
                  <FaCheck className="w-3.5 h-3.5" />
                </span>
                Detects malicious and fraudulent URLs instantly.
              </li>
              <li className="flex items-center gap-3">
                <span className="bg-[#111827 text-white w-6 h-6 flex items-center justify-center border border-gray-700 rounded-sm shrink-0">
                  <FaLock className="w-3.5 h-3.5" />
                </span>
                Safeguards your browsing and online activities.
              </li>
              <li className="flex items-center gap-3">
                <span className="bg-[#111827 text-white w-6 h-6 flex items-center justify-center border border-gray-700 rounded-sm shrink-0">
                  <IoFlash className="w-3.5 h-3.5" />
                </span>
                Learns from evolving phishing tactics for higher accuracy.
              </li>
            </ul>
          </div>

          <div className="mt-10 border-t border-gray-800 pt-4 text-sm text-gray-500">
            Built by{" "}
            <Link target="_blank" href="https://github.com/Trojan-Z3ro">
              <span className="text-blue-400 font-medium">
                Abdulsalaam Faheemdeen
              </span>
            </Link>
          </div>
        </section>
        <section className="p-4 md:p-8 flex flex-col justify-center bg-[#0b0d12] ">
          <div className="max-w-md w-full mx-auto">
            <h3 className="text-2xl font-semibold text-white mb-3">
              Phishing URL Scanner
            </h3>
            <p className="text-sm text-gray-400 mb-6">
              Paste a link below to test its safety. GuardLink will analyze the
              URL and tell you if it's legitimate or a phishing attempt.
            </p>

            <form
              onSubmit={handleSubmit}
              className="bg-[#111827] border border-gray-700 rounded-xl p-6 shadow-inner"
            >
              <label className="text-sm text-gray-400 mb-2 block">URL</label>
              <input
                type="text"
                required
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-4 py-3 bg-[#0b0c10] border border-gray-700 rounded-lg text-gray-100 "
              />

              <button
                type="submit"
                disabled={loading}
                className={`mt-5 w-full py-3 rounded-lg text-white font-semibold transition ${
                  loading
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-blue-700 hover:opacity-90"
                }`}
              >
                {loading ? "Analyzing..." : "Analyze"}
              </button>

              <div className="mt-5 p-3 rounded-lg bg-[#0b0c10] border border-gray-700 text-sm text-gray-400">
                {error && <p className="text-red-500 font-medium">{error}</p>}
                {prediction && (
                  <p
                    className={`flex items-center gap-2 font-medium ${
                      prediction === "good" ? "text-green-400" : "text-red-500"
                    }`}
                  >
                    {prediction === "good" ? (
                      <>
                        <FaCheck className="text-sm" /> This website appears
                        safe.
                      </>
                    ) : (
                      <>
                        <ImCross className="text-sm" /> This website appears to
                        be unsafe!
                      </>
                    )}
                  </p>
                )}
                {!error && !prediction && (
                  <>
                    <span className="block text-blue-400 font-medium">
                      Awaiting input...
                    </span>
                    <p className="text-gray-500 mt-1">
                      Enter a valid URL and press Analyze to begin detection.
                    </p>
                  </>
                )}
              </div>
            </form>
          </div>
        </section>
      </div>

      <footer className="mt-12 text-gray-500 text-sm text-center">
        © {new Date().getFullYear()} GuardLink. All Rights Reserved.
      </footer>
    </main>
  );
}
