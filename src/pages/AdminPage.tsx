import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  IconButton,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputAdornment,
} from '@mui/material';
import { Add as AddIcon, Search as SearchIcon, Refresh as RefreshIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { alpha } from '@mui/material/styles';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const AdminPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: '' });
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Mock data for demonstration
  useEffect(() => {
    setUsers([
      { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
    ]);
  }, []);

  const handleAddUser = () => {
    if (editingUser) {
      setUsers(users.map(user => 
        user.id === editingUser.id ? { ...newUser, id: editingUser.id } : user
      ));
    } else {
      setUsers([...users, { ...newUser, id: Date.now().toString() }]);
    }
    handleCloseDialog();
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter(user => user.id !== id));
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setNewUser({ name: user.name, email: user.email, role: user.role });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewUser({ name: '', email: '', role: '' });
    setEditingUser(null);
  };

  const filteredUsers = users.filter(user =>
    Object.values(user).some(value =>
      value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <Box sx={{ 
      p: 4,
      minHeight: '100vh',
      background: 'linear-gradient(135deg, rgba(14, 26, 45, 0.95) 0%, rgba(17, 24, 39, 0.95) 100%)',
    }}>
      <Box sx={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        pt: 8 
      }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 4 
        }}>
          <Typography variant="h4" sx={{ color: 'white', fontWeight: 500 }}>
            User Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
            sx={{
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.9) 0%, rgba(168, 85, 247, 0.9) 100%)',
              borderRadius: '12px',
              textTransform: 'none',
              px: 3,
              '&:hover': {
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 1) 0%, rgba(168, 85, 247, 1) 100%)',
              },
            }}
          >
            Add New User
          </Button>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          mb: 3,
          alignItems: 'center' 
        }}>
          <TextField
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              flex: 1,
              '& .MuiOutlinedInput-root': {
                color: 'white',
                bgcolor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: alpha('#6366f1', 0.5),
                },
              },
              '& .MuiInputBase-input::placeholder': {
                color: 'rgba(255, 255, 255, 0.5)',
                opacity: 1,
              },
            }}
          />
          <IconButton
            onClick={() => {/* Refresh logic */}}
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <RefreshIcon />
          </IconButton>
        </Box>

        <TableContainer 
          component={Paper} 
          sx={{ 
            bgcolor: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 500 }}>Name</TableCell>
                <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 500 }}>Email</TableCell>
                <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 500 }}>Role</TableCell>
                <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: 500 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell sx={{ color: 'white' }}>{user.name}</TableCell>
                    <TableCell sx={{ color: 'white' }}>{user.email}</TableCell>
                    <TableCell sx={{ color: 'white' }}>{user.role}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleEditUser(user)}
                        sx={{ color: '#6366f1', mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteUser(user.id)}
                        sx={{ color: '#ef4444' }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                    No users found. Click "Add New User" to create one.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        PaperProps={{
          sx: {
            bgcolor: 'rgba(17, 24, 39, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            minWidth: '400px',
          }
        }}
      >
        <DialogTitle sx={{ color: 'white' }}>
          {editingUser ? 'Edit User' : 'Add New User'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: alpha('#6366f1', 0.5),
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
              }}
            />
            <TextField
              label="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: alpha('#6366f1', 0.5),
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
              }}
            />
            <TextField
              label="Role"
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: alpha('#6366f1', 0.5),
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button 
            onClick={handleCloseDialog}
            sx={{ 
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddUser}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.9) 0%, rgba(168, 85, 247, 0.9) 100%)',
              borderRadius: '8px',
              textTransform: 'none',
              '&:hover': {
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 1) 0%, rgba(168, 85, 247, 1) 100%)',
              },
            }}
          >
            {editingUser ? 'Save Changes' : 'Add User'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminPage;
