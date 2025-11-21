import React, { useEffect, useState } from 'react';
import client from '../api/client';

const AdminUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            setError(null);
            try {
                // Attempt to fetch all users. Backend may require admin auth (withCredentials)
                const res = await client.get('/admin/users');
                const data = res?.data?.data || res?.data || [];
                // If backend returns ApiResponse wrapper, data will be in res.data.data
                // Normalize users to expected shape
                const normalized = Array.isArray(data)
                    ? data.map((u) => ({
                        id: u._id || u.id || u.email,
                        name: u.name || u.email,
                        email: u.email || '',
                        skills: u.skills || [],
                        interests: u.interests || [],
                    }))
                    : [];
                setUsers(normalized);
            } catch (err) {
                setError(err?.response?.data?.message || err.message || 'Failed to load users');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleDelete = async (userId) => {
        if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
        try {
            await client.delete(`/admin/users/${userId}`);
            setUsers((prev) => prev.filter((u) => u.id !== userId));
        } catch (err) {
            alert(err?.response?.data?.message || err.message || 'Failed to delete user');
        }
    };

    const [searchTerm, setSearchTerm] = useState('');
    const filteredUsers = users.filter((u) => {
        const q = searchTerm.trim().toLowerCase();
        if (!q) return true;
        return (u.name || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q) || (u.skills || []).join(' ').toLowerCase().includes(q);
    });

    return (
        <div style={{ padding: '20px' }}>
            <h1>Admin Users Management</h1>
            <div style={{ marginBottom: 12 }}>
                <input placeholder="Search users by name, email or skill" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ padding: 8, width: '100%', maxWidth: 420, borderRadius: 6, border: '1px solid #ddd' }} />
            </div>

            {loading ? (
                <div>Loading users...</div>
            ) : error ? (
                <div style={{ color: 'red' }}>Error: {error}</div>
            ) : (
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
                        {filteredUsers.map((user) => (
                            <tr key={user.id}>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.id}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.name}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.email}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{(user.skills || []).join(', ')}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{(user.interests || []).join(', ')}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
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
            )}
        </div>
    );
};

export default AdminUsersPage;