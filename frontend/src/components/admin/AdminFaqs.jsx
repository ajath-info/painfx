import React, { useState, useEffect } from "react";
import axios from "axios";
import DOMPurify from "dompurify";
import AdminLayout from "../../layouts/AdminLayout";
import { Edit, Trash2, ChevronLeft, ChevronRight, Maximize2, Minimize2 } from "lucide-react";
import BASE_URL from '../../config';

const API_URL = `${BASE_URL}/faq`;

const getToken = () => localStorage.getItem("token");

function textToHtml(txt = "") {
  const escaped = txt
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return escaped.replace(/\n/g, "<br/>");
}


function htmlToText(html = "") {
  if (!html) return "";
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}


function normalizeFaq(row) {
  if (!row) return null;
  const id = row.id ?? row._id ?? row.faq_id ?? row.qid;
  const question = row.question ?? row.q ?? "";
  // prefer plain answer if present; else derive from html
  const answer = row.answer ?? row.a ?? htmlToText(row.answer_html ?? row.html ?? "");
  const answer_html = row.answer_html ?? row.html ?? textToHtml(answer);
  const status = String(row.status ?? "1");
  const created_at = row.created_at ?? row.createdAt ?? null;
  return { id, question, answer, answer_html, status, created_at };
}

function htmlPreview(html, max = 100) {
  const txt = htmlToText(html);
  if (txt.length <= max) return txt;
  return txt.slice(0, max) + "…";
}

function sanitize(html) {
  return DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
}

const AdminFaqs = () => {
  const [faqs, setFaqs] = useState([]); // normalized rows
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [current, setCurrent] = useState(null); // row being edited
  const [formData, setFormData] = useState({ question: "", answer: "" });
  const [htmlViewFaq, setHtmlViewFaq] = useState(null); // row to show full HTML preview modal

  const fetchFaqs = async () => {
    try {
      const token = getToken();
      const res = await axios.get(`${API_URL}/get-all`, {
        params: { page, limit },
        headers: { Authorization: `Bearer ${token}` },
      });
      const rows = res.data?.payload?.data || [];
      const normalized = rows.map(normalizeFaq).filter(Boolean);
      setFaqs(normalized);
      setTotal(res.data?.payload?.total || normalized.length || 0);
    } catch (err) {
      console.error("Fetch error:", err.response?.status, err.response?.data || err);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, [page, limit]);

  const totalPages = Math.ceil(total / limit) || 1;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const handlePrevious = () => {
    if (page > 1) setPage(page - 1);
  };
  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handleToggleStatus = async (id) => {
    try {
      const token = getToken();
      await axios.put(`${API_URL}/toggle-status/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchFaqs();
    } catch (err) {
      console.error("Status toggle error:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this FAQ?")) return;
    try {
      const token = getToken();
      await axios.delete(`${API_URL}/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchFaqs();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleEdit = (faq) => {
    setCurrent(faq);
    setFormData({
      question: faq.question || "",
      answer: faq.answer || htmlToText(faq.answer_html || ""),
    });
    setModalOpen(true);
  };

  const handleAdd = () => {
    setCurrent(null);
    setFormData({ question: "", answer: "" });
    setModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = getToken();
    const plainAns = formData.answer?.trim() || "";
    const html = sanitize(textToHtml(plainAns));

    const payload = {
      question: formData.question?.trim() || "",
      answer: plainAns, // keep plain
      answer_html: html, // send sanitized HTML version
    };
    if (current?.id) payload.id = current.id;

    try {
      await axios.post(`${API_URL}/add-or-update`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      fetchFaqs();
      handleModalClose();
    } catch (err) {
      console.error("Submit error:", err.response?.data || err);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setCurrent(null);
    setFormData({ question: "", answer: "" });
  };

  const openHtmlView = (faq) => setHtmlViewFaq(faq);
  const closeHtmlView = () => setHtmlViewFaq(null);

  const formatDate = (isoLike) => {
    if (!isoLike) return "--";
    const d = new Date(isoLike);
    if (isNaN(d.getTime())) return "--";
    return d.toLocaleString();
  };

  return (
    <AdminLayout>
      <div className="flex-1 p-6 bg-gray-100 min-h-screen">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">FAQ Management</h2>
          <p className="text-gray-600 text-sm">Dashboard / FAQs</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Top Controls */}
          <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-gray-700 text-sm">Show</span>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
              </select>
              <span className="text-gray-700 text-sm">entries</span>
            </div>
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
            >
              Add FAQ
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">S.N</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Question</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Answer (HTML)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created At</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {faqs.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">
                      No FAQs found.
                    </td>
                  </tr>
                )}
                {faqs.map((faq, idx) => {
                  const html = faq.answer_html || textToHtml(faq.answer || "");
                  const previewTxt = htmlPreview(html, 100);
                  return (
                    <tr key={faq.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm">{startIndex + idx + 1}</td>
                      <td className="px-6 py-4 text-sm max-w-xs break-words">{faq.question || "--"}</td>
                      <td className="px-6 py-4 text-sm max-w-sm break-words">
                        {/* Preview text + expand button */}
                        <div className="flex items-start gap-2">
                          <span className="inline-block text-gray-700" title={previewTxt}>
                            {previewTxt}
                          </span>
                          {html && (
                            <button
                              type="button"
                              onClick={() => openHtmlView(faq)}
                              className="text-blue-600 text-xs underline flex items-center gap-1"
                              title="View full answer"
                            >
                              <Maximize2 className="w-3 h-3" /> View
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          onClick={() => handleToggleStatus(faq.id)}
                          className={`px-2 py-1 rounded-full text-xs cursor-pointer ${faq.status === "1" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                        >
                          {faq.status === "1" ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap">{formatDate(faq.created_at)}</td>
                      <td className="px-6 py-4 text-sm flex space-x-2">
                        <button onClick={() => handleEdit(faq)} className="px-3 py-1 bg-yellow-500 text-white rounded" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(faq.id)} className="px-3 py-1 bg-red-500 text-white rounded" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="px-6 py-3 bg-gray-50 border-t flex flex-col sm:flex-row justify-between items-center gap-2">
            <div className="text-sm text-gray-700">
              Showing {total === 0 ? 0 : startIndex + 1} to {Math.min(endIndex, total)} of {total} entries
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrevious}
                disabled={page === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 py-1 bg-blue-600 text-white rounded">{page}</span>
              <button
                onClick={handleNext}
                disabled={page === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Add / Edit Modal */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                {current ? "Edit FAQ" : "Add New FAQ"}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Question</label>
                  <input
                    type="text"
                    name="question"
                    value={formData.question}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    placeholder="Enter the question"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Answer (plain text or line breaks)</label>
                  <textarea
                    name="answer"
                    value={formData.answer}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded min-h-[120px]"
                    placeholder="Enter the answer"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">Line breaks will convert to &lt;br/&gt; in HTML.</p>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={handleModalClose}
                    className="px-4 py-2 bg-gray-300 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                  >
                    {current ? "Save Changes" : "Add FAQ"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Full HTML View Modal */}
        {htmlViewFaq && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4" onClick={closeHtmlView}>
            <div
              className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeHtmlView}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 p-1"
                title="Close"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <h4 className="text-lg font-semibold mb-4 text-gray-800">{htmlViewFaq.question}</h4>
              <div
                className="prose prose-sm max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: sanitize(htmlViewFaq.answer_html || textToHtml(htmlViewFaq.answer || "")) }}
              />
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminFaqs;
