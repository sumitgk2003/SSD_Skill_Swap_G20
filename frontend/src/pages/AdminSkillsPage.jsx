import React, { useState } from 'react';

const AdminSkillsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
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

  const filteredSkills = skills.filter((skill) => {
    const matchesSearchTerm =
      skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      skill.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      filterCategory === 'All' || skill.category === filterCategory;

    return matchesSearchTerm && matchesCategory;
  });

  const handleRemove = (id) => {
    console.log(`Remove skill with ID: ${id}`);
    setSkills(skills.filter(skill => skill.id !== id));
    // In a real app, you'd send an API request to remove the skill
  };

  return (
    <div className="admin-skills-page p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Skills Management</h1>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
        <input
          type="text"
          placeholder="Search skills..."
          className="p-2 border border-gray-300 rounded-md w-full sm:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="p-2 border border-gray-300 rounded-md w-full sm:w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="All">All Categories</option>
          <option value="Frontend">Frontend</option>
          <option value="Backend">Backend</option>
          <option value="Design">Design</option>
          <option value="Writing">Writing</option>
          <option value="Mobile">Mobile</option>
        </select>
      </div>

      {filteredSkills.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-600">
          <p className="text-lg font-semibold">No skills found matching your criteria.</p>
          <p className="text-sm mt-2">Try adjusting your search term or filter.</p>
        </div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Skill ID</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Name</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Category</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Description</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Added Date</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSkills.map((skill) => (
              <tr key={skill.id}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{skill.id}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{skill.name}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{skill.category}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{skill.description}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{skill.addedDate}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  <button
                    onClick={() => handleRemove(skill.id)}
                    style={{ padding: '5px 10px', cursor: 'pointer', backgroundColor: '#f44336', color: 'white', border: 'none' }}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminSkillsPage;