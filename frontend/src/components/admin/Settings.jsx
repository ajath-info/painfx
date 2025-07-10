import React, { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';

const Settings = () => {
  const [websiteName, setWebsiteName] = useState('');
  const [websiteLogo, setWebsiteLogo] = useState(null);
  const [favicon, setFavicon] = useState(null);

  const handleLogoChange = (e) => {
    setWebsiteLogo(e.target.files[0]);
  };

  const handleFaviconChange = (e) => {
    setFavicon(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ websiteName, websiteLogo, favicon });
  };

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">General Settings</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2">Website Name</label>
            <input
              type="text"
              value={websiteName}
              onChange={(e) => setWebsiteName(e.target.value)}
              className="border border-gray-300 rounded-md p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter website name"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2">Website Logo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="border border-gray-300 rounded-md p-3 text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <span className="text-xs text-gray-500 mt-2">
              {websiteLogo ? websiteLogo.name : 'No file chosen'}
            </span>
            <p className="text-xs text-gray-500 mt-1">Recommended size: 150px x 150px</p>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2">Favicon</label>
            <input
              type="file"
              accept=".png,.ico"
              onChange={handleFaviconChange}
              className="border border-gray-300 rounded-md p-3 text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <span className="text-xs text-gray-500 mt-2">
              {favicon ? favicon.name : 'No file chosen'}
            </span>
            <p className="text-xs text-gray-500 mt-1">
              Recommended size: 16px x 16px or 32px x 32px (Only PNG and ICO)
            </p>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Save Settings
          </button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default Settings;