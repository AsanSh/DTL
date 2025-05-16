import React, { useState, useEffect } from 'react';
import { 
  Typography, Box, CircularProgress, Paper,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Card, CardContent,
  Button, TextField, Grid, Chip, Dialog,
  DialogTitle, DialogContent, DialogActions,
  Avatar, Divider
} from '@mui/material';
import { 
  PersonAdd as PersonAddIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import { userAPI, organizationAPI } from '../api/api';

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  is_approved: boolean;
  phone: string | null;
}

interface Organization {
  id: number;
  name: string;
  owner: number;
  created_at: string;
}

const Profile: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [createOrgOpen, setCreateOrgOpen] = useState(false);
  const [orgName, setOrgName] = useState('');
  const [inviteURL, setInviteURL] = useState('');

  // Fetch user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // If user is Owner or Admin, fetch all users
        if (currentUser?.role === 'OWNER' || currentUser?.role === 'ADMIN') {
          const usersResponse = await userAPI.getUsers();
          setUsers(usersResponse.data);
          
          // Also fetch organization details if user has one
          if (currentUser.organization) {
            try {
              const orgResponse = await organizationAPI.getOrganization(currentUser.organization);
              setOrganization(orgResponse.data);
            } catch (error) {
              console.error('Error fetching organization:', error);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  const handleCreateOrg = async () => {
    try {
      const response = await organizationAPI.createOrganization({ name: orgName });
      setOrganization(response.data);
      setCreateOrgOpen(false);
      
      // Create invite URL
      const baseURL = window.location.origin;
      setInviteURL(`${baseURL}/register?org=${response.data.id}`);
    } catch (error) {
      console.error('Error creating organization:', error);
    }
  };

  const handleApproveUser = async (userId: number) => {
    try {
      await userAPI.approveUser(userId);
      
      // Update the user in the list
      setUsers(users.map(u => 
        u.id === userId ? { ...u, is_approved: true } : u
      ));
    } catch (error) {
      console.error('Error approving user:', error);
    }
  };

  const handleRejectUser = async (userId: number) => {
    try {
      await userAPI.rejectUser(userId);
      
      // Remove the user from the list
      setUsers(users.filter(u => u.id !== userId));
    } catch (error) {
      console.error('Error rejecting user:', error);
    }
  };

  const getPendingUsers = () => {
    return users.filter(user => !user.is_approved);
  };

  const getApprovedUsers = () => {
    return users.filter(user => user.is_approved);
  };

  const getRoleName = (role: string) => {
    switch (role) {
      case 'OWNER':
        return 'Owner';
      case 'ADMIN':
        return 'Admin';
      case 'LOGISTICIAN':
        return 'Logistician';
      case 'DRIVER':
        return 'Driver';
      default:
        return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'OWNER':
        return 'error';
      case 'ADMIN':
        return 'secondary';
      case 'LOGISTICIAN':
        return 'primary';
      case 'DRIVER':
        return 'success';
      default:
        return 'default';
    }
  };

  const canManageUsers = currentUser?.role === 'OWNER' || currentUser?.role === 'ADMIN';
  const needsOrganization = currentUser?.role === 'OWNER' && !organization;

  if (loading) {
    return (
      <Layout title="Profile">
        <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout title="Profile">
      {/* User Profile Card */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <Avatar 
              sx={{ 
                width: 56, 
                height: 56, 
                bgcolor: currentUser?.role === 'OWNER' ? 'error.main' : 'primary.main',
                mr: 2
              }}
            >
              {currentUser?.first_name?.[0] || currentUser?.username?.[0] || 'U'}
            </Avatar>
            <Box>
              <Typography variant="h5">
                {currentUser?.first_name 
                  ? `${currentUser.first_name} ${currentUser.last_name}` 
                  : currentUser?.username}
              </Typography>
              <Chip 
                label={getRoleName(currentUser?.role || '')} 
                color={getRoleColor(currentUser?.role || '') as any}
                size="small"
              />
            </Box>
          </Box>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="textSecondary">
                Username:
              </Typography>
              <Typography variant="body1">
                {currentUser?.username}
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="textSecondary">
                Email:
              </Typography>
              <Typography variant="body1">
                {currentUser?.email}
              </Typography>
            </Grid>
            
            {currentUser?.phone && (
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="textSecondary">
                  Phone:
                </Typography>
                <Typography variant="body1">
                  {currentUser.phone}
                </Typography>
              </Grid>
            )}
            
            {organization && (
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="textSecondary">
                  Organization:
                </Typography>
                <Typography variant="body1">
                  {organization.name}
                </Typography>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>
      
      {/* Organization Management */}
      {needsOrganization ? (
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Organization
          </Typography>
          <Typography variant="body1" paragraph>
            You need to create an organization to start managing cargos and team members.
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => setCreateOrgOpen(true)}
          >
            Create Organization
          </Button>
        </Paper>
      ) : organization && currentUser?.role === 'OWNER' && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Organization: {organization.name}
            </Typography>
            
            <Box mb={2}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Invite Team Members
              </Typography>
              <Typography variant="body1" gutterBottom>
                Share this link to invite team members to your organization:
              </Typography>
              <TextField
                fullWidth
                value={inviteURL || `${window.location.origin}/register?org=${organization.id}`}
                InputProps={{
                  readOnly: true,
                }}
                variant="outlined"
                size="small"
              />
            </Box>
          </CardContent>
        </Card>
      )}
      
      {/* User Management Section */}
      {canManageUsers && (
        <>
          {/* Pending Users */}
          <Typography variant="h6" sx={{ mb: 2 }}>
            Pending Approvals
          </Typography>
          
          {getPendingUsers().length === 0 ? (
            <Paper sx={{ p: 3, mb: 4, textAlign: 'center' }}>
              <Typography variant="body1">
                No pending user approvals
              </Typography>
            </Paper>
          ) : (
            <TableContainer component={Paper} sx={{ mb: 4 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Username</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getPendingUsers().map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        {user.first_name ? `${user.first_name} ${user.last_name}` : '-'}
                      </TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Chip 
                          label={getRoleName(user.role)} 
                          color={getRoleColor(user.role) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          startIcon={<ApproveIcon />}
                          color="success"
                          variant="outlined"
                          size="small"
                          sx={{ mr: 1 }}
                          onClick={() => handleApproveUser(user.id)}
                        >
                          Approve
                        </Button>
                        <Button
                          startIcon={<RejectIcon />}
                          color="error"
                          variant="outlined"
                          size="small"
                          onClick={() => handleRejectUser(user.id)}
                        >
                          Reject
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          
          {/* Team Members */}
          <Typography variant="h6" sx={{ mb: 2 }}>
            Team Members
          </Typography>
          
          {getApprovedUsers().length === 0 ? (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1">
                No approved team members yet
              </Typography>
            </Paper>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Username</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Phone</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getApprovedUsers().map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        {user.first_name ? `${user.first_name} ${user.last_name}` : '-'}
                      </TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Chip 
                          label={getRoleName(user.role)} 
                          color={getRoleColor(user.role) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{user.phone || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}
      
      {/* Create Organization Dialog */}
      <Dialog open={createOrgOpen} onClose={() => setCreateOrgOpen(false)}>
        <DialogTitle>Create Organization</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Organization Name"
            fullWidth
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOrgOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateOrg} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default Profile; 