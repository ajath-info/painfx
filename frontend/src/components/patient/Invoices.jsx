import React from 'react';
import PatientLayout from '../../layouts/PatientLayout';

const Invoices = () => {
  return (
    <PatientLayout>
      <h3>Invoices</h3>
      <div className="table-responsive mt-4">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Invoice ID</th>
              <th>Doctor</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Download</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>#INV001</td>
              <td>Dr. Ruby Perrin</td>
              <td>08 Jul 2025</td>
              <td>$150</td>
              <td><a href="#" className="btn btn-sm btn-secondary">PDF</a></td>
            </tr>
            <tr>
              <td>#INV002</td>
              <td>Dr. Darren Elder</td>
              <td>02 Jul 2025</td>
              <td>$200</td>
              <td><a href="#" className="btn btn-sm btn-secondary">PDF</a></td>
            </tr>
          </tbody>
        </table>
      </div>
    </PatientLayout>
  );
};

export default Invoices;
