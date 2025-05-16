import React, { useState, useEffect } from 'react';
import { 
  Typography, Box, CircularProgress, Paper,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, TablePagination
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import { cargoAPI } from '../api/api';

interface CargoRequest {
  id: number;
  title: string;
  description: string;
  driver_name: string;
  logistician_name: string;
  amount: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const ClosedRequests: React.FC = () => {
  const { user } = useAuth();
  const [cargoRequests, setCargoRequests] = useState<CargoRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchClosedRequests = async () => {
      try {
        setLoading(true);
        const response = await cargoAPI.getRequests('COMPLETED,CANCELLED');
        setCargoRequests(response.data);
      } catch (error) {
        console.error('Error fetching closed requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClosedRequests();
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Layout title="Closed Requests">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5">
          Closed Cargo Requests
        </Typography>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : cargoRequests.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1">
            No closed cargo requests found.
          </Typography>
        </Paper>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Driver</TableCell>
                  <TableCell>Logistician</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Completed Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cargoRequests
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((cargo) => (
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
                        {new Date(cargo.updated_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={cargoRequests.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}
    </Layout>
  );
};

export default ClosedRequests; 