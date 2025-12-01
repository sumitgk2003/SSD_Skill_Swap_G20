
                            import React, { useEffect, useState } from 'react';
                            import client from '../api/client';

                            const SkeletonRow = () => (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 2fr', gap: 12, padding: 12, background: '#fff', borderRadius: 8, boxShadow: 'inset 0 0 0 1px #f1f5f9', border: '1px solid rgba(15,23,36,0.04)' }}>
                                    <div style={{ height: 14, width: '60%', background: '#e6eef8', borderRadius: 6 }} />
                                    <div style={{ height: 14, width: '80%', background: '#e6eef8', borderRadius: 6 }} />
                                    <div style={{ height: 14, width: '40%', background: '#e6eef8', borderRadius: 6 }} />
                                </div>
                            );

                            const UserCard = ({ user }) => {
                                const [hover, setHover] = useState(false);
                                return (
                                    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ background: hover ? '#fbfdff' : '#fff', borderRadius: 10, padding: 14, boxShadow: hover ? '0 12px 30px rgba(2,6,23,0.08)' : '0 6px 18px rgba(2,6,23,0.06)', transform: hover ? 'translateY(-3px)' : 'translateY(0)', transition: 'transform 160ms ease, box-shadow 160ms ease', display: 'flex', flexDirection: 'column', gap: 8, border: hover ? '1px solid rgba(15,23,36,0.06)' : '1px solid rgba(15,23,36,0.04)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <div style={{ fontWeight: 700, color: '#0f1724' }}>{user.name}</div>
                                                <div style={{ fontSize: 13, color: '#6b7280' }}>{user.email}</div>
                                            </div>
                                            <div style={{ fontSize: 12, color: '#94a3b8' }}>{user.id}</div>
                                        </div>
                                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                            {(user.skills || []).slice(0, 6).map((s) => (
                                                <span key={s} style={{ background: '#eef2ff', color: '#3730a3', padding: '4px 8px', borderRadius: 999, fontSize: 12 }}>{s}</span>
                                            ))}
                                        </div>
                                        {(user.interests || []).length > 0 && (
                                            <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                                {(user.interests || []).slice(0, 6).map((i) => (
                                                    <span key={i} style={{ background: '#fff7ed', color: '#92400e', padding: '4px 8px', borderRadius: 999, fontSize: 12 }}>{i}</span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            };

                            const AdminUsersPage = () => {
                                const [users, setUsers] = useState([]);
                                const [loading, setLoading] = useState(false);
                                const [error, setError] = useState(null);
                                const [searchTerm, setSearchTerm] = useState('');
                                const [hoveredUserId, setHoveredUserId] = useState(null);

                                useEffect(() => {
                                    const fetchUsers = async () => {
                                        setLoading(true);
                                        setError(null);
                                        try {
                                            const res = await client.get('/admin/users');
                                            const data = res?.data?.data || res?.data || [];
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

                                const handleClear = () => setSearchTerm('');

                                const filteredUsers = users.filter((u) => {
                                    const q = (searchTerm || '').trim().toLowerCase();
                                    if (!q) return true;
                                    return (
                                        (u.name || '').toLowerCase().includes(q) ||
                                        (u.email || '').toLowerCase().includes(q) ||
                                        (u.skills || []).join(' ').toLowerCase().includes(q)
                                    );
                                });

                                return (
                                    <div style={{ padding: 36, fontFamily: 'Inter, system-ui, Arial, sans-serif' }}>
                                        <div style={{ maxWidth: 1600, margin: '0 auto', padding: '0 18px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                                                <div>
                                                    <h2 style={{ margin: 0, fontSize: 20, color: '#0f1724' }}>Users</h2>
                                                    <p style={{ margin: '6px 0 0', color: '#6b7280' }}>All registered users & their skills</p>
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', gap: 8, marginBottom: 16, alignItems: 'center' }}>
                                                <div style={{ position: 'relative', width: '100%', maxWidth: 520 }}>
                                                    <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} aria-hidden>
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21 21l-4.35-4.35" stroke="#94a3b8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16z" stroke="#94a3b8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                                    </span>
                                                    <input
                                                        placeholder="Search users by name, email, skill or interest"
                                                        value={searchTerm}
                                                        onChange={(e) => setSearchTerm(e.target.value)}
                                                        style={{ padding: '10px 12px 10px 40px', width: '100%', borderRadius: 12, border: '1px solid #e6eef8', boxShadow: 'inset 0 1px 2px rgba(16,24,40,0.04)' }}
                                                    />
                                                    {searchTerm ? (
                                                        <button onClick={handleClear} style={{ position: 'absolute', right: 6, top: 6, padding: '6px 8px', borderRadius: 8, background: '#f8fafc', border: '1px solid #e6eef8' }}>Clear</button>
                                                    ) : null}
                                                </div>
                                            </div>

                                            {loading ? (
                                                <div style={{ display: 'grid', gap: 12 }}>
                                                    <SkeletonRow />
                                                    <SkeletonRow />
                                                    <SkeletonRow />
                                                </div>
                                            ) : error ? (
                                                <div style={{ color: 'red' }}>Error: {error}</div>
                                            ) : filteredUsers.length === 0 ? (
                                                <div style={{ background: '#fff', padding: 18, borderRadius: 10, boxShadow: '0 6px 18px rgba(2,6,23,0.06)' }}>
                                                    <p style={{ margin: 0, color: '#6b7280' }}>No users found. Try changing the search filter.</p>
                                                </div>
                                            ) : (
                                                <div>
                                                    <div style={{ display: 'block' }}>
                                                        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 10px' }}>
                                                            <thead>
                                                                <tr style={{ textAlign: 'left', color: '#6b7280', fontSize: 13 }}>
                                                                    <th style={{ padding: '12px 16px' }}>Name</th>
                                                                    <th style={{ padding: '12px 16px' }}>Email</th>
                                                                    <th style={{ padding: '12px 16px' }}>Skills</th>
                                                                    <th style={{ padding: '12px 16px' }}>Interests</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {filteredUsers.map((user) => {
                                                                    const hovered = hoveredUserId === user.id;
                                                                    return (
                                                                        <tr
                                                                            key={user.id}
                                                                            onMouseEnter={() => setHoveredUserId(user.id)}
                                                                            onMouseLeave={() => setHoveredUserId(null)}
                                                                            style={{
                                                                                background: hovered ? '#fbfdff' : '#fff',
                                                                                borderRadius: 10,
                                                                                boxShadow: hovered ? '0 12px 30px rgba(2,6,23,0.08)' : '0 10px 30px rgba(2,6,23,0.04)',
                                                                                marginBottom: 8,
                                                                                border: hovered ? '1px solid rgba(15,23,36,0.06)' : '1px solid rgba(15,23,36,0.04)',
                                                                                transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
                                                                                transition: 'transform 160ms ease, box-shadow 160ms ease',
                                                                            }}
                                                                        >
                                                                            <td style={{ padding: '14px 16px', borderBottom: 'none', verticalAlign: 'top' }}>
                                                                                <div style={{ fontWeight: 700, color: '#0f1724' }}>{user.name}</div>
                                                                                <div style={{ fontSize: 12, color: '#94a3b8' }}>{user.id}</div>
                                                                            </td>
                                                                            <td style={{ padding: '14px 16px', borderBottom: 'none', verticalAlign: 'top' }}>
                                                                                <div style={{ color: '#374151' }}>{user.email}</div>
                                                                            </td>
                                                                            <td style={{ padding: '14px 16px', borderBottom: 'none', verticalAlign: 'top' }}>
                                                                                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                                                                    {(user.skills || []).slice(0, 8).map((s) => (
                                                                                        <span key={s} style={{ background: '#eef2ff', color: '#3730a3', padding: '6px 10px', borderRadius: 999, fontSize: 12 }}>{s}</span>
                                                                                    ))}
                                                                                </div>
                                                                            </td>
                                                                            <td style={{ padding: '14px 16px', borderBottom: 'none', verticalAlign: 'top' }}>{(user.interests || []).join(', ')}</td>
                                                                        </tr>
                                                                    );
                                                                })}
                                                            </tbody>
                                                        </table>
                                                    </div>

                                                    <div style={{ display: 'none' }}>
                                                        {filteredUsers.map((u) => (
                                                            <div key={u.id} style={{ marginBottom: 12 }}>
                                                                <UserCard user={u} />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            };

                            export default AdminUsersPage;