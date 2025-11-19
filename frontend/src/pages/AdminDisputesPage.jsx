import React, { useState } from 'react';

const AdminDisputesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  // Placeholder for dispute data
  const allDisputes = [
    {
      id: '1',
      reporter: 'User A',
      reported: 'User B',
      skill: 'React Development',
      reason: 'User B did not deliver on agreed-upon skill exchange.',
      status: 'Pending Review',
      date: '2023-10-26',
    },
    {
      id: '2',
      reporter: 'User C',
      reported: 'User D',
      skill: 'Graphic Design',
      reason: 'Miscommunication regarding project scope.',
      status: 'Resolved',
      date: '2023-10-20',
    },
    {
      id: '3',
      reporter: 'User E',
      reported: 'User F',
      skill: 'Backend Development',
      reason: 'User F was unresponsive after initial contact.',
      status: 'Pending Review',
      date: '2023-10-25',
    },
    {
      id: '4',
      reporter: 'User G',
      reported: 'User H',
      skill: 'Content Writing',
      reason: 'Plagiarism detected in delivered content.',
      status: 'Rejected',
      date: '2023-10-22',
    },
  ];

  const filteredDisputes = allDisputes.filter((dispute) => {
    const matchesSearchTerm =
      dispute.reporter.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispute.reported.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispute.skill.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispute.reason.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === 'All' || dispute.status === filterStatus;

    return matchesSearchTerm && matchesStatus;
  });

  const handleResolve = (id) => {
    console.log(`Resolve dispute with ID: ${id}`);
    // In a real app, you'd send an API request to update the dispute status
  };

  const handleReject = (id) => {
    console.log(`Reject dispute with ID: ${id}`);
    // In a real app, you'd send an API request to update the dispute status
  };

  return (
    <div className="admin-disputes-page p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Disputes Management</h1>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
        <input
          type="text"
          placeholder="Search disputes..."
          className="p-2 border border-gray-300 rounded-md w-full sm:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="p-2 border border-gray-300 rounded-md w-full sm:w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Pending Review">Pending Review</option>
          <option value="Resolved">Resolved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {filteredDisputes.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-600">
          <p className="text-lg font-semibold">No disputes found matching your criteria.</p>
          <p className="text-sm mt-2">Try adjusting your search term or filter.</p>
        </div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Dispute ID</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Reporter</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Reported User</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Skill</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Reason</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Status</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Date</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDisputes.map((dispute) => (
              <tr key={dispute.id}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{dispute.id}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{dispute.reporter}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{dispute.reported}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{dispute.skill}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{dispute.reason}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      lineHeight: '1rem',
                      fontWeight: '600',
                      backgroundColor:
                        dispute.status === 'Pending Review'
                          ? '#fefcbf'
                          : dispute.status === 'Resolved'
                          ? '#d1fae5'
                          : '#fee2e2',
                      color:
                        dispute.status === 'Pending Review'
                          ? '#92400e'
                          : dispute.status === 'Resolved'
                          ? '#065f46'
                          : '#991b1b',
                    }}
                  >
                    {dispute.status}
                  </span>
                </td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{dispute.date}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {dispute.status === 'Pending Review' && (
                    <>
                      <button
                        onClick={() => handleResolve(dispute.id)}
                        style={{ marginRight: '10px', padding: '5px 10px', cursor: 'pointer', backgroundColor: '#4CAF50', color: 'white', border: 'none' }}
                      >
                        Resolve
                      </button>
                      <button
                        onClick={() => handleReject(dispute.id)}
                        style={{ padding: '5px 10px', cursor: 'pointer', backgroundColor: '#f44336', color: 'white', border: 'none' }}
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDisputesPage;