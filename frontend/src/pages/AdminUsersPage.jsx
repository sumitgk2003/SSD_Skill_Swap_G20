import React, { useState } from 'react';

const AdminUsersPage = () => {
    const [users, setUsers] = useState([
        {
            id: 1,
            name: 'Alice Smith',
            email: 'alice@example.com',
            skills: ['React', 'Node.js', 'MongoDB'],
            interests: ['Web Development', 'AI', 'Photography']
        },
        {
            id: 2,
            name: 'Bob Johnson',
            email: 'bob@example.com',
            skills: ['Python', 'Data Science', 'Machine Learning'],
            interests: ['Data Analysis', 'Statistics', 'Reading']
        },
        {
            id: 3,
            name: 'Charlie Brown',
            email: 'charlie@example.com',
            skills: ['Java', 'Spring Boot', 'SQL'],
            interests: ['Backend Development', 'Gaming', 'Hiking']
        },
        {
            id: 4,
            name: 'Diana Prince',
            email: 'diana@example.com',
            skills: ['Vue.js', 'Firebase', 'UI/UX Design'],
            interests: ['Frontend Development', 'Graphic Design', 'Travel']
        }
    ]);

    const handleEdit = (userId) => {
        console.log(`Edit user with ID: ${userId}`);
        // In a real application, you would navigate to an edit form or open a modal
    };

    const handleDelete = (userId) => {
        console.log(`Delete user with ID: ${userId}`);
        // In a real application, you would confirm deletion and then filter the users state
        setUsers(users.filter(user => user.id !== userId));
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Admin Users Management</h1>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f2f2f2' }}>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>ID</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Name</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Email</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Skills</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Interests</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.id}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.name}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.email}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.skills.join(', ')}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.interests.join(', ')}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                <button
                                    onClick={() => handleEdit(user.id)}
                                    style={{ marginRight: '10px', padding: '5px 10px', cursor: 'pointer' }}
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(user.id)}
                                    style={{ padding: '5px 10px', cursor: 'pointer', backgroundColor: '#f44336', color: 'white', border: 'none' }}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminUsersPage;