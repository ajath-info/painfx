import React from 'react';
import PatientLayout from '../../layouts/PatientLayout';

const MedicalRecords = () => {
  return (
    <PatientLayout>
      <h3>Medical Records</h3>
      <div className="mt-4">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Title</th>
              <th>Uploaded</th>
              <th>Type</th>
              <th>Download</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Blood Test Report</td>
              <td>01 Jul 2025</td>
              <td>Lab Report</td>
              <td><a href="#" className="btn btn-sm btn-primary">Download</a></td>
            </tr>
            <tr>
              <td>Prescription - Dr. Ruby</td>
              <td>15 Jun 2025</td>
              <td>Prescription</td>
              <td><a href="#" className="btn btn-sm btn-primary">Download</a></td>
            </tr>
          </tbody>
        </table>
      </div>
    </PatientLayout>
  );
};

export default MedicalRecords;
