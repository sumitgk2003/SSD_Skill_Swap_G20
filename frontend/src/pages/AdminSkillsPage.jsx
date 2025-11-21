import React, { useEffect, useState } from 'react';
import client from '../api/client';

const AdminSkillsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [skills, setSkills] = useState([
    {
      id: 'SK001',
      name: 'React Development',
      category: 'Frontend',
      description: 'Building interactive user interfaces with React.js.',
      addedDate: '2023-01-15',
    },
    {
      id: 'SK002',
      name: 'Node.js Backend',
      category: 'Backend',
      description: 'Developing scalable server-side applications using Node.js and Express.',
      addedDate: '2023-02-20',
    },
    {
      id: 'SK003',
      name: 'Graphic Design',
      category: 'Design',
      description: 'Creating visual content using tools like Adobe Photoshop and Illustrator.',
      addedDate: '2023-03-10',
    },
    {
      id: 'SK004',
      name: 'Content Writing',
      category: 'Writing',
      description: 'Producing engaging written content for various platforms.',
      addedDate: '2023-04-01',
    },
    {
      id: 'SK005',
      name: 'Mobile App Development (Flutter)',
      category: 'Mobile',
      description: 'Building cross-platform mobile applications with Flutter and Dart.',
      addedDate: '2023-05-05',
    },
    {
      id: 'SK006',
      name: 'Database Management (SQL)',
      category: 'Backend',
      description: 'Designing and managing relational databases with SQL.',
      addedDate: '2023-06-12',
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch skills with match counts from backend admin endpoint
    const fetchSkills = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await client.get('/admin/skills');
        const data = res?.data?.data || [];
        const normalized = data.map((s, idx) => ({
          id: `SK${String(idx + 1).padStart(3, '0')}`,
          name: s.skill,
          category: s.category || 'General',
          matches: s.matchesCount || 0,
          description: s.description || '',
        }));
        setSkills(normalized);
      } catch (err) {
        setError(err?.response?.data?.message || err.message || 'Failed to load skills');
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  // Filter skills by search term (case-insensitive). If searchTerm is empty, show all.
  const filteredSkills = skills.filter((skill) => {
    const q = (searchTerm || '').trim().toLowerCase();
    if (!q) return true;
    const name = (skill.name || '').toLowerCase();
    const category = (skill.category || '').toLowerCase();
    const description = (skill.description || '').toLowerCase();

    return name.includes(q) || category.includes(q) || description.includes(q);
  });

  return (
    <div className="admin-skills-page p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Skills Management</h1>

      <div className="flex items-center mb-6 space-x-4">
        <div className="flex items-center w-full sm:w-1/3">
          <input
            type="text"
            placeholder="Search skills by name or category..."
            className="p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              className="ml-2 px-3 py-1 bg-gray-200 rounded-md text-sm"
              onClick={() => setSearchTerm('')}
              aria-label="Clear search"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="p-6">Loading skills...</div>
      ) : filteredSkills.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-600">
          <p className="text-lg font-semibold">No skills found matching your criteria.</p>
          <p className="text-sm mt-2">Try adjusting your search term or filter.</p>
        </div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Name</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Category</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Total Matches</th>
            </tr>
          </thead>
          <tbody>
            {filteredSkills.map((skill) => (
              <tr key={skill.id}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{skill.name}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{skill.category}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{skill.matches ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminSkillsPage;