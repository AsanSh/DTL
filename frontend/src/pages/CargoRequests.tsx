import React, { useState, useEffect } from 'react';
import { 
  Typography, Button, CircularProgress, Box,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, FormControl, InputLabel, Select, MenuItem,
  Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import { cargoAPI, userAPI } from '../api/api';

interface CargoRequest {
  id: number;
  title: string;
  description: string;
  driver: number;
  driver_name: string;
  logistician: number;
  logistician_name: string;
  amount: string;
  status: string;
  created_at: string;
}

interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  role: string;
}

const CargoRequests: React.FC = () => {
  const { user } = useAuth();
  const [cargoRequests, setCargoRequests] = useState<CargoRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    driver: '',
    logistician: '',
    amount: ''
  });
  const [drivers, setDrivers] = useState<User[]>([]);
  const [logisticians, setLogisticians] = useState<User[]>([]);

  const fetchCargoRequests = async () => {
    try {
      setLoading(true);
      const response = await cargoAPI.getRequests('PENDING,IN_PROGRESS');
      setCargoRequests(response.data);
    } catch (error) {
      console.error('Error fetching cargo requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await userAPI.getUsers();
      const users = response.data;
      
      setDrivers(users.filter((u: User) => u.role === 'DRIVER' && u.is_approved));
      setLogisticians(users.filter((u: User) => u.role === 'LOGISTICIAN' && u.is_approved));
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchCargoRequests();
    fetchUsers();
  }, []);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      title: '',
      description: '',
      driver: '',
      logistician: '',
      amount: ''
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name) {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async () => {
    try {
      await cargoAPI.createRequest({
        title: formData.title,
        description: formData.description,
        driver: formData.driver,
        logistician: user?.role === 'LOGISTICIAN' ? user.id : formData.logistician,
        amount: formData.amount
      });
      handleCloseDialog();
      fetchCargoRequests();
    } catch (error) {
      console.error('Error creating cargo request:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'IN_PROGRESS':
        return 'info';
      case 'COMPLETED':
        return 'success';
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      await cargoAPI.updateStatus(id, newStatus);
      fetchCargoRequests();
    } catch (error) {
      console.error('Error updating cargo status:', error);
    }
  };

  const canCreateRequest = user?.role === 'LOGISTICIAN' && user.is_approved;

  return (
    <Layout title="Cargo Requests">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">
          Active Cargo Requests
        </Typography>
        {canCreateRequest && (
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
          >
            New Request
          </Button>
        )}
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : cargoRequests.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1">
            No active cargo requests found.
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Driver</TableCell>
                <TableCell>Logistician</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cargoRequests.map((cargo) => (
                <TableRow key={cargo.id}>
                  <TableCell>{cargo.title}</TableCell>
                  <TableCell>{cargo.driver_name}</TableCell>
                  <TableCell>{cargo.logistician_name}</TableCell>
                  <TableCell>${parseFloat(cargo.amount).toFixed(2)}</TableCell>
                  <TableCell>
                    <Chip 
                      label={cargo.status} 
                      color={getStatusColor(cargo.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(cargo.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {user?.role === 'DRIVER' && cargo.status === 'PENDING' && (
                      <Button 
                        size="small" 
                        variant="outlined" 
                        onClick={() => handleUpdateStatus(cargo.id, 'IN_PROGRESS')}
                      >
                        Start
                      </Button>
                    )}
                    {user?.role === 'DRIVER' && cargo.status === 'IN_PROGRESS' && (
                      <Button 
                        size="small" 
                        variant="outlined" 
                        color="success"
                        onClick={() => handleUpdateStatus(cargo.id, 'COMPLETED')}
                      >
                        Complete
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Cargo Request</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="title"
            label="Title"
            fullWidth
            value={formData.title}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={formData.description}
            onChange={handleChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Driver</InputLabel>
            <Select
              name="driver"
              value={formData.driver}
              onChange={handleChange}
              label="Driver"
            >
              {drivers.map((driver) => (
                <MenuItem key={driver.id} value={driver.id}>
                  {driver.first_name} {driver.last_name} ({driver.username})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {user?.role !== 'LOGISTICIAN' && (
            <FormControl fullWidth margin="dense">
              <InputLabel>Logistician</InputLabel>
              <Select
                name="logistician"
                value={formData.logistician}
                onChange={handleChange}
                label="Logistician"
              >
                {logisticians.map((logistician) => (
                  <MenuItem key={logistician.id} value={logistician.id}>
                    {logistician.first_name} {logistician.last_name} ({logistician.username})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          <TextField
            margin="dense"
            name="amount"
            label="Amount ($)"
            fullWidth
            type="number"
            value={formData.amount}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default CargoRequests; 