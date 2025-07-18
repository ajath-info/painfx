import React, { useState, useRef, useEffect } from "react";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import { ChevronDown, ChevronUp } from "lucide-react";

/* ------------------------------------------------------------------
 * CONFIG
 * ------------------------------------------------------------------ */
const BASE_URL = "http://localhost:5000"; // change as needed
const API_URL = `${BASE_URL}/api/faq/get-active`; // expects public/active FAQs

/* ------------------------------------------------------------------
 * OPTIONAL FALLBACK (used if API fails or returns empty)
 * ------------------------------------------------------------------ */
const fallbackFaqs = [
  {
    id: "how-it-works",
    question: "What is a herniated disc?",
    answer: `At PainFX Physiotherapy in Rochedale, we treat herniated discs—where the soft inner core of a spinal disc pushes through its outer layer, often compressing nerves and causing back pain, sciatica, or leg numbness.`,
  },
  {
    id: "very-important-1",
    question: "How is a herniated disc different from a bulging disc?",
    answer: `A bulging disc involves the disc’s outer layer protruding outward, while a herniated disc means the inner material breaks through. Both can cause nerve irritation and are treated at our Rochedale physiotherapy clinic.`,
  },
  {
    id: "important-2",
    question: "What symptoms suggest disc-related issues?",
    answer: `Common signs include:
Sciatica or leg pain
Tingling or numbness in feet
Muscle weakness
Pain worsened by sitting or bending
Reduced reflexes
If you're in Rochedale and experiencing these symptoms, PainFX Physiotherapy offers expert assessment and care.`,
  },
  {
    id: "important-3",
    question: "Can physiotherapy help with herniated or bulging discs?",
    answer: `Yes! At PainFX Rochedale, our physiotherapists use evidence-based techniques to:
Reduce inflammation and pain
Improve spinal mobility
Strengthen core muscles
Prevent recurrence`,
  },
  {
    id: "very-important-4",
    question: "What treatments are used at PainFX Physiotherapy?",
    answer: `We offer:
Manual therapy
Joint mobilisation
Electrotherapy
Stretching and strengthening
Soft tissue release
Pain education`,
  },
];

/* ------------------------------------------------------------------
 * NORMALIZE API -> UI
 * Accepts flexible backend shapes:
 *  - { id, question, answer, status }
 *  - { id, q, a, status }
 *  - { _id, ... }
 * Filters to active (status === 1 or '1') by default.
 * ------------------------------------------------------------------ */
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
    .filter((f) => String(f.status) === "1"); // show only active
}

/* ------------------------------------------------------------------
 * FAQ Item
 * ------------------------------------------------------------------ */
function FAQItem({ id, q, a, isOpen, onToggle }) {
  const contentRef = useRef(null);
  return (
    <li id={id} className="scroll-mt-24 border-b border-gray-200 last:border-none">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={`${id}-content`}
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
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

/* ------------------------------------------------------------------
 * FAQ PAGE (Public)
 * Fetches FAQs from backend (similar pattern to LogoScroller).
 * Falls back to local data if API fails.
 * ------------------------------------------------------------------ */
function Faqs() {
  const [faqs, setFaqs] = useState([]); // [{id,question,answer,status}]
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(""); // hold fetch error (optional UI)
  const [openIds, setOpenIds] = useState([]); // array of ids that are open

  const topRef = useRef(null);

  /* Fetch active FAQs on mount */
  useEffect(() => {
    let isMounted = true;
    async function fetchFaqs() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(API_URL); // public endpoint, no auth
        const data = await res.json();
        if (!data.error && data.status === 1) {
          const normalized = normalizeFaqPayload(data.payload);
          if (isMounted) {
            setFaqs(normalized.length ? normalized : normalizeFaqPayload(fallbackFaqs));
          }
        } else {
          // API returned error or unexpected shape; fallback
          console.warn("FAQ API returned error or unexpected response:", data);
          if (isMounted) {
            setError("Unable to load FAQs from server.");
            setFaqs(normalizeFaqPayload(fallbackFaqs));
          }
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

  /* Support deep-link opening via URL hash (runs after faqs loaded) */
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

  /* Toggle one */
  const toggleId = (id) => {
    setOpenIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  /* Expand / Collapse all */
  const expandAll = () => setOpenIds(faqs.map((f) => f.id));
  const collapseAll = () => setOpenIds([]);

  /* Click in index nav */
  const handleIndexClick = (id) => {
    toggleId(id); // open/close
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      // Update hash without causing jump reload
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
        {/* Page heading */}
        <header className="mb-10 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h1>
          {loading && (
            <p className="mt-2 text-sm text-gray-500">Loading FAQs…</p>
          )}
          {!loading && error && (
            <p className="mt-2 text-sm text-red-500">{error}</p>
          )}
        </header>

        {/* Question index */}
        {!loading && faqs.length > 0 && (
          <nav aria-label="FAQ Table of Contents" className="mb-12">
            <ul className="grid gap-2 sm:gap-3 md:grid-cols-2 lg:grid-cols-3 text-left text-base sm:text-lg">
              {faqs.map((f, i) => (
                <li key={f.id}>
                  <button
                    type="button"
                    onClick={() => handleIndexClick(f.id)}
                    className="w-full text-left text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                  >
                    {i + 1}. {f.question}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {/* Expand / Collapse all controls */}
        {!loading && faqs.length > 0 && (
          <div className="flex items-center justify-end gap-4 mb-6">
            <button
              type="button"
              onClick={expandAll}
              className="cursor-pointer bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-full shadow-md transition-all duration-300 transform hover:scale-110 hover:shadow-xl hover:from-purple-600 hover:to-pink-500"
            >
              Expand All
            </button>
            <button
              type="button"
              onClick={collapseAll}
              className="cursor-pointer bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-full shadow-md transition-all duration-300 transform hover:scale-110 hover:shadow-xl hover:from-purple-600 hover:to-pink-500"
            >
              Collapse All
            </button>
          </div>
        )}

        {/* FAQ accordion list */}
        {!loading && faqs.length > 0 && (
          <ul className="divide-y divide-gray-200" role="list">
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
        )}

        {/* No data fallback UI (if API + fallback empty) */}
        {!loading && faqs.length === 0 && (
          <p className="text-center text-gray-500 mt-10">No FAQs available at this time.</p>
        )}

        {/* Back to top link */}
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={() => {
              if (topRef.current) {
                topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
              }
              window.history.replaceState(null, "", window.location.pathname);
            }}
            className="cursor-pointer bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-full shadow-md transition-all duration-300 transform hover:scale-110 hover:shadow-xl hover:from-purple-600 hover:to-pink-500"
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
