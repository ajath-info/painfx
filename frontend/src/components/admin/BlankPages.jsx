import React from 'react';
import AdminLayout from '../../layouts/AdminLayout';

const BlankPages = () => {
  return (
    <AdminLayout>
      <div className="p-6">
      <div className="mb-6">
          <h1 className="font-sans text-3xl  text-gray-800">Blank Page</h1>
          <button>Dashboard</button>
          /
          <button>Black Page</button>
        </div>

        <div>
          <h1>
            Content here
          </h1>
        </div>
        </div>
    </AdminLayout>
  )
}

export default BlankPages
