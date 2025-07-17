import React, { useState, useRef, useEffect } from "react";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqsData = [
  {
    id: "how-it-works",
    q: "What is a herniated disc?",
    a: `At PainFX Physiotherapy in Rochedale, we treat herniated discs—where the soft inner core of a spinal disc pushes through its outer layer, often compressing nerves and causing back pain, sciatica, or leg numbness.
`,
  },
  {
    id: "very-important-1",
    q: "How is a herniated disc different from a bulging disc?",
    a: `A bulging disc involves the disc’s outer layer protruding outward, while a herniated disc means the inner material breaks through. Both can cause nerve irritation and are treated at our Rochedale physiotherapy clinic.`,
  },
  {
    id: "important-2",
    q: "What symptoms suggest disc-related issues?",
    a: `Common signs include:
Sciatica or leg pain
Tingling or numbness in feet
Muscle weakness
Pain worsened by sitting or bending
Reduced reflexes
If you're in Rochedale and experiencing these symptoms, PainFX Physiotherapy offers expert assessment and care.`,
  },
  {
    id: "important-3",
    q: "Can physiotherapy help with herniated or bulging discs?",
    a: `Yes! At PainFX Rochedale, our physiotherapists use evidence-based techniques to:
Reduce inflammation and pain
Improve spinal mobility
Strengthen core muscles
Prevent recurrence`,
  },
  {
    id: "very-important-4",
    q: "What treatments are used at PainFX Physiotherapy?",
    a: `We offer:
Manual therapy
Joint mobilisation
Electrotherapy
Stretching and strengthening
Soft tissue release
Pain education`,
  },
];

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
        <div className="pb-6 pr-2 text-sm sm:text-base text-gray-600 leading-relaxed">
          {a}
        </div>
      </div>
    </li>
  );
}

function Faqs() {
  const [openIds, setOpenIds] = useState([]); // array of ids that are open
  const topRef = useRef(null);

  const toggleId = (id) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const expandAll = () => setOpenIds(faqsData.map((f) => f.id));
  const collapseAll = () => setOpenIds([]);

  // When hash in URL changes, auto-open that item & scroll
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;
    const exists = faqsData.find((f) => f.id === hash);
    if (exists) {
      setOpenIds((prev) => (prev.includes(hash) ? prev : [...prev, hash]));
      const el = document.getElementById(hash);
      if (el) {
        // Use smooth scroll; scroll-margin handled by Tailwind scroll-mt-24 on li
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, []);

  const handleIndexClick = (id) => {
    toggleId(id); // open/close
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      // Update hash w/out jump
     window.history.replaceState(null, "", `#${id}`);
    }
  };

  return (
    <>
      <Header />
      <main ref={topRef} className="relative w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Page heading */}
        <header className="mb-10 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h1>
        </header>

        {/* Question index */}
        <nav aria-label="FAQ Table of Contents" className="mb-12">
          <ul className="grid gap-2 sm:gap-3 md:grid-cols-2 lg:grid-cols-3 text-left text-base sm:text-lg">
            {faqsData.map((f, i) => (
              <li key={f.id}>
                <button
                  type="button"
                  onClick={() => handleIndexClick(f.id)}
                  className="w-full text-left text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                >
                  {i + 1}. {f.q}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Expand / Collapse all controls */}
        <div className="flex items-center justify-end gap-4 mb-6">
          <button
            type="button"
            onClick={expandAll}
            className="cursor-pointer bg-{#00B8DB} inline-flex items-center rounded-md border border-primary px-3 py-1.5 text-lg font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
          >
            Expand All
          </button>
          <button
            type="button"
            onClick={collapseAll}
            className="cursor-pointer inline-flex items-center rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
          >
            Collapse All
          </button>
        </div>

        {/* FAQ accordion list */}
        <ul className="divide-y divide-gray-200" role="list">
          {faqsData.map((f) => (
            <FAQItem
              key={f.id}
              id={f.id}
              q={f.q}
              a={f.a}
              isOpen={openIds.includes(f.id)}
              onToggle={() => toggleId(f.id)}
            />
          ))}
        </ul>

        {/* Back to top link (mobile friendly) */}
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={() => {
              if (topRef.current) {
                topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
              }
              window.history.replaceState(null, "", window.location.pathname);

            }}
            className="inline-flex items-center text-sm font-medium text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
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