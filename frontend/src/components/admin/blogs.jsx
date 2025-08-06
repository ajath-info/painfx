import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../layouts/AdminLayout';
import { Edit, Trash2, Eye, ChevronLeft, ChevronRight, X } from 'lucide-react';
import BASE_URL from '../../config';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const IMAGE_BASE_URL = 'http://localhost:5000';
const token = localStorage.getItem('token');

const BlogManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [current, setCurrent] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', image: null });
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/blogs/?page=${page}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlogs(res.data.payload.data);
      setTotal(res.data.payload.total);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [page, limit]);

  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const handlePrevious = () => page > 1 && setPage(page - 1);
  const handleNext = () => page < totalPages && setPage(page + 1);

  const handleToggleStatus = async (id) => {
    try {
      await axios.patch(`${BASE_URL}/blogs/${id}/status`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBlogs();
    } catch (err) {
      console.error('Status toggle error:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBlogs();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleEdit = (blog) => {
    setCurrent(blog);
    setFormData({
      title: blog.title || '',
      description: blog.description || '',
      image: null,
    });

    const imageUrl = blog.image_url?.startsWith('http')
      ? blog.image_url
      : `${IMAGE_BASE_URL}${blog.image_url.startsWith('/') ? '' : '/'}${blog.image_url}`;
    setPreviewImage(imageUrl);

    setModalOpen(true);
  };

  const handleAdd = () => {
    setCurrent(null);
    setFormData({ title: '', description: '', image: null });
    setPreviewImage(null);
    setModalOpen(true);
  };

  const handleView = (blog) => {
    setCurrent(blog);
    setViewModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleDescriptionChange = (value) => {
    setFormData({ ...formData, description: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    if (formData.image) data.append('image', formData.image);
    data.append('title', formData.title);
    data.append('description', formData.description);
    if (current?.id) data.append('id', current.id);

    try {
      await axios.post(`${BASE_URL}/blogs/`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      fetchBlogs();
      handleModalClose();
    } catch (err) {
      console.error('Submit error:', err);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setCurrent(null);
    setFormData({ title: '', description: '', image: null });
    setPreviewImage(null);
  };

  // ReactQuill modules for better toolbar
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  const quillFormats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video', 'color', 'background', 'align'
  ];

  return (
    <AdminLayout>
      <div className="flex-1 p-4 lg:p-6 bg-gray-100 min-h-screen">
        <div className="mb-6">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">Blog Management</h2>
          <p className="text-gray-600 text-sm">Dashboard / Blogs</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-gray-700 text-sm">Show</span>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
              </select>
              <span className="text-gray-700 text-sm">entries</span>
            </div>
            <button
              onClick={handleAdd}
              className="px-4 py-2 border border-cyan-500 rounded-lg text-white bg-cyan-500 text-sm cursor-pointer hover:bg-cyan-600 transition-colors"
            >
              Add Blog
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">S.N</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {blogs.map((blog, idx) => (
                  <tr key={blog.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 lg:px-6 py-4 text-sm">{startIndex + idx + 1}</td>
                    <td className="px-4 lg:px-6 py-4">
                      {blog.image_url && (
                        <img
                          src={`${IMAGE_BASE_URL}${blog.image_url}`}
                          className="w-10 h-10 rounded-full object-cover"
                          alt="blog"
                        />
                      )}
                    </td>
                    <td className="px-4 lg:px-6 py-4 text-sm max-w-xs truncate">{blog.title}</td>
                    <td className="px-4 lg:px-6 py-4 text-sm">
                      <span
                        onClick={() => handleToggleStatus(blog.id)}
                        className={`px-2 py-1 rounded-full text-xs cursor-pointer transition-colors ${
                          blog.status === '1' 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {blog.status === '1' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 lg:px-6 py-4 text-sm">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleView(blog)} 
                          className="bg-blue-500 hover:bg-blue-600 px-2 py-1 text-white rounded transition-colors"
                          title="View Blog"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleEdit(blog)} 
                          className="bg-yellow-500 hover:bg-yellow-600 px-2 py-1 text-white rounded transition-colors"
                          title="Edit Blog"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(blog.id)} 
                          className="bg-red-500 hover:bg-red-600 px-2 py-1 text-white rounded transition-colors"
                          title="Delete Blog"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-4 lg:px-6 py-3 bg-gray-50 border-t flex flex-col sm:flex-row justify-between items-center gap-2">
            <div className="text-sm text-gray-700">
              Showing {total === 0 ? 0 : startIndex + 1} to {Math.min(endIndex, total)} of {total} entries
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={handlePrevious} 
                disabled={page === 1} 
                className="px-3 py-1.5 border border-cyan-500 rounded-lg text-sm text-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cyan-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 py-1.5 border border-cyan-500 rounded-lg text-sm text-cyan-500 bg-cyan-50">
                {page}
              </span>
              <button 
                onClick={handleNext} 
                disabled={page === totalPages} 
                className="px-3 py-1.5 border border-cyan-500 rounded-lg text-sm text-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cyan-50 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Add/Edit Modal - Large and Responsive */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] flex flex-col my-4">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-xl lg:text-2xl font-semibold text-gray-800">
                  {current ? 'Edit Blog' : 'Add New Blog'}
                </h3>
                <button
                  onClick={handleModalClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Title Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Blog Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter blog title..."
                      className="w-full border border-gray-300 px-4 py-3 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Description Editor */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Blog Content *
                    </label>
                    <div className="quill-container">
                      <ReactQuill
                        value={formData.description}
                        onChange={handleDescriptionChange}
                        modules={quillModules}
                        formats={quillFormats}
                        className="custom-quill-editor"
                        theme="snow"
                        placeholder="Write your blog content here..."
                      />
                    </div>
                    <style jsx>{`
                      .quill-container {
                        border: 1px solid #d1d5db;
                        border-radius: 8px;
                        overflow: hidden;
                      }
                      .custom-quill-editor .ql-container {
                        min-height: 300px;
                        font-size: 16px;
                        border: none;
                      }
                      .custom-quill-editor .ql-toolbar {
                        border-bottom: 1px solid #e5e7eb;
                        border-top: none;
                        border-left: none;
                        border-right: none;
                      }
                      .custom-quill-editor .ql-editor {
                        min-height: 300px;
                        padding: 16px;
                        line-height: 1.6;
                      }
                      .custom-quill-editor .ql-editor.ql-blank::before {
                        color: #9ca3af;
                        font-style: italic;
                        left: 16px;
                      }
                    `}</style>
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Featured Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full border border-gray-300 px-4 py-3 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-cyan-50 file:text-cyan-600 file:cursor-pointer hover:file:bg-cyan-100"
                    />
                    {previewImage && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
                        <img
                          src={previewImage}
                          className="w-32 h-32 object-cover rounded-lg shadow-md"
                          alt="Preview"
                        />
                      </div>
                    )}
                  </div>
                </form>
              </div>

              {/* Modal Footer */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 p-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-base font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="w-full sm:w-auto px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors text-base font-medium"
                >
                  {current ? 'Update Blog' : 'Add Blog'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Modal - Full Page Style */}
        {viewModalOpen && current && (
          <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 lg:px-6 py-4 shadow-sm z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl lg:text-2xl font-bold text-gray-800">Blog Preview</h1>
                  <p className="text-gray-600 text-sm mt-1">Reading Mode</p>
                </div>
                <button
                  onClick={() => setViewModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 lg:px-6 py-8">
              {/* Blog Title */}
              <h2 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                {current.title}
              </h2>

              {/* Featured Image */}
              {current.image_url && (
                <div className="mb-8">
                  <img
                    src={`${IMAGE_BASE_URL}${current.image_url}`}
                    className="w-full max-h-64 object-fill rounded-xl shadow-lg"
                    alt={current.title}
                  />
                </div>
              )}

              {/* Blog Content */}
              <div className="prose prose-lg max-w-none">
                <div
                  dangerouslySetInnerHTML={{ __html: current.description }}
                  className="text-gray-700 leading-relaxed"
                  style={{
                    fontSize: '16px',
                    lineHeight: '1.7',
                  }}
                />
              </div>

              {/* Meta Information */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <span className={`px-3 py-1 rounded-full ${
                    current.status === '1' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    Status: {current.status === '1' ? 'Published' : 'Draft'}
                  </span>
                  {current.created_at && (
                    <span>Created: {new Date(current.created_at).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Action Bar */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 lg:px-6 py-4 shadow-lg">
              <div className="max-w-4xl mx-auto flex justify-between items-center">
                <button
                  onClick={() => setViewModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  ← Back to List
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setViewModalOpen(false);
                      handleEdit(current);
                    }}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default BlogManagement;