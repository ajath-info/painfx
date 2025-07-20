import React, { useState, useRef, useEffect } from "react";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import { ChevronDown, ChevronUp } from "lucide-react";
import BASE_URL from "../../config";
import axios from "axios";

/* Optional fallback FAQs if API fails */
const fallbackFaqs = [
  {
    id: "how-it-works",
    question: "What is a herniated disc?",
    answer: `At PainFX Physiotherapy in Rochedale, we treat herniated discs...`,
  },
  {
    id: "very-important-1",
    question: "How is a herniated disc different from a bulging disc?",
    answer: `A bulging disc involves...`,
  },
  {
    id: "important-2",
    question: "What symptoms suggest disc-related issues?",
    answer: `Common signs include:\nSciatica or leg pain\n...`,
  },
  {
    id: "important-3",
    question: "Can physiotherapy help with herniated or bulging discs?",
    answer: `Yes! At PainFX Rochedale, our physiotherapists...`,
  },
  {
    id: "very-important-4",
    question: "What treatments are used at PainFX Physiotherapy?",
    answer: `We offer:\nManual therapy\nJoint mobilisation...`,
  },
];

/* Normalize response shape */
function normalizeFaqPayload(raw = []) {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => {
      const id = item.id ?? item._id ?? item.faq_id ?? item.qid ?? crypto.randomUUID();
      const question = item.question ?? item.q ?? "";
      const answer = item.answer ?? item.a ?? "";
      const status = item.status ?? "1";
      return { id: String(id), question, answer, status };
    })
    .filter((f) => String(f.status) === "1");
}

/* FAQ Item Component */
function FAQItem({ id, q, a, isOpen, onToggle }) {
  const contentRef = useRef(null);
  return (
    <li id={id} className="scroll-mt-24 border-b border-gray-200 last:border-none">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={`${id}-content`}
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <span className="font-medium text-gray-900 text-base sm:text-lg">{q}</span>
        <span className="ml-4 shrink-0 text-gray-500">
          {isOpen ? <ChevronUp aria-hidden="true" /> : <ChevronDown aria-hidden="true" />}
        </span>
      </button>
      <div
        id={`${id}-content`}
        ref={contentRef}
        role="region"
        aria-labelledby={id}
        className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${
          isOpen ? "max-h-[1000px]" : "max-h-0"
        }`}
      >
        <div className="pb-6 pr-2 text-sm sm:text-base text-gray-600 leading-relaxed whitespace-pre-line">
          {a}
        </div>
      </div>
    </li>
  );
}

/* Main Component */
function Faqs() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openIds, setOpenIds] = useState([]);

  const topRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchFaqs() {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(`${BASE_URL}/faq/get-all?page=1&limit=3`);
        const data = res.data;
        if (!data.error && data.status === 1) {
          const normalized = normalizeFaqPayload(data.payload.data || []);
          if (isMounted) {
            setFaqs(normalized.length ? normalized : normalizeFaqPayload(fallbackFaqs));
          }
        } else {
          throw new Error("Invalid response");
        }
      } catch (err) {
        console.error("Error fetching FAQs:", err);
        if (isMounted) {
          setError("Unable to load FAQs from server.");
          setFaqs(normalizeFaqPayload(fallbackFaqs));
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchFaqs();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!faqs.length) return;
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;
    const exists = faqs.find((f) => f.id === hash);
    if (exists) {
      setOpenIds((prev) => (prev.includes(hash) ? prev : [...prev, hash]));
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [faqs]);

  const toggleId = (id) => {
    setOpenIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const expandAll = () => setOpenIds(faqs.map((f) => f.id));
  const collapseAll = () => setOpenIds([]);

  const handleIndexClick = (id) => {
    toggleId(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", `#${id}`);
    }
  };

  return (
    <>
      <Header />
      <main
        ref={topRef}
        className="relative w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16"
      >
        <header className="mb-10 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h1>
          {loading && <p className="mt-2 text-sm text-gray-500">Loading FAQs…</p>}
          {!loading && error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        </header>

        {!loading && faqs.length > 0 && (
          <>
            <nav aria-label="FAQ Table of Contents" className="mb-12">
              <ul className="grid gap-2 sm:gap-3 md:grid-cols-2 lg:grid-cols-3">
                {faqs.map((f, i) => (
                  <li key={f.id}>
                    <button
                      type="button"
                      onClick={() => handleIndexClick(f.id)}
                      className="text-left text-primary hover:underline"
                    >
                      {i + 1}. {f.question}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex items-center justify-end gap-4 mb-6">
              <button onClick={expandAll} className="btn-gradient">Expand All</button>
              <button onClick={collapseAll} className="btn-gradient">Collapse All</button>
            </div>

            <ul className="divide-y divide-gray-200">
              {faqs.map((f) => (
                <FAQItem
                  key={f.id}
                  id={f.id}
                  q={f.question}
                  a={f.answer}
                  isOpen={openIds.includes(f.id)}
                  onToggle={() => toggleId(f.id)}
                />
              ))}
            </ul>
          </>
        )}

        {!loading && faqs.length === 0 && (
          <p className="text-center text-gray-500 mt-10">No FAQs available at this time.</p>
        )}

        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={() => {
              if (topRef.current) {
                topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
              }
              window.history.replaceState(null, "", window.location.pathname);
            }}
            className="btn-gradient"
          >
            Back to Top
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Faqs;
