import React, { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'User';
  key: string;
}

const INITIAL_USERS: User[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin', key: 'uk_123456789' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'User', key: 'uk_987654321' },
];

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState<Partial<User>>({});

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.key.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddUser = () => {
    setEditingUser(null);
    setNewUser({});
    setDialogOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setNewUser(user);
    setDialogOpen(true);
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  const handleSave = () => {
    if (editingUser) {
      setUsers(users.map(user => 
        user.id === editingUser.id ? { ...user, ...newUser } as User : user
      ));
    } else {
      const newId = (Math.max(...users.map(u => parseInt(u.id))) + 1).toString();
      setUsers([...users, { ...newUser, id: newId } as User]);
    }
    setDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">User Management</h2>
        <button
          onClick={handleAddUser}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <AddIcon className="w-5 h-5" />
          Add User
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search users..."
          className="w-full bg-gray-800/30 border border-gray-700/30 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-blue-500/50 placeholder-gray-500"
        />
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-xl border border-gray-700/30 bg-gray-800/20">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700/30">
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Name</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Email</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Role</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">API Key</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700/30">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-700/10 transition-colors">
                <td className="px-6 py-4 text-sm font-medium">{user.name}</td>
                <td className="px-6 py-4 text-sm text-gray-400">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.role === 'Admin' ? 'bg-blue-500/10 text-blue-400' : 'bg-gray-500/10 text-gray-400'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-mono text-gray-400">{user.key}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => handleEditUser(user)}
                    className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-gray-700/30 transition-colors"
                  >
                    <EditIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="text-gray-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-gray-700/30 transition-colors"
                  >
                    <DeleteIcon className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit User Dialog */}
      {dialogOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-gray-800/90 rounded-xl border border-gray-700/30 p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-6">
              {editingUser ? 'Edit User' : 'Add User'}
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={newUser.name || ''}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className="w-full bg-gray-900/30 border border-gray-700/30 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500/50 placeholder-gray-500"
              />
              <input
                type="email"
                placeholder="Email"
                value={newUser.email || ''}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="w-full bg-gray-900/30 border border-gray-700/30 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500/50 placeholder-gray-500"
              />
              <select
                value={newUser.role || 'User'}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value as 'Admin' | 'User' })}
                className="w-full bg-gray-900/30 border border-gray-700/30 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500/50"
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </select>
              <input
                type="text"
                placeholder="API Key"
                value={newUser.key || ''}
                onChange={(e) => setNewUser({ ...newUser, key: e.target.value })}
                className="w-full bg-gray-900/30 border border-gray-700/30 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500/50 placeholder-gray-500 font-mono"
              />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setDialogOpen(false)}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white rounded-lg hover:bg-gray-700/30 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
