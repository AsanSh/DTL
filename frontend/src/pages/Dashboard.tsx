import React, { useState, useEffect } from 'react';
import { 
  Typography, Grid, Card, CardContent, 
  CircularProgress, Box 
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import { cargoAPI, analyticsAPI } from '../api/api';

interface DashboardStats {
  totalCargos: number;
  pendingCargos: number;
  completedCargos: number;
  totalAmount: number;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalCargos: 0,
    pendingCargos: 0,
    completedCargos: 0,
    totalAmount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch all cargo requests
        const cargoResponse = await cargoAPI.getRequests();
        const cargos = cargoResponse.data;
        
        // Calculate basic stats
        const pendingCargos = cargos.filter((cargo: any) => 
          cargo.status === 'PENDING' || cargo.status === 'IN_PROGRESS'
        ).length;
        
        const completedCargos = cargos.filter((cargo: any) => 
          cargo.status === 'COMPLETED'
        ).length;
        
        // For owner/admin roles, fetch analytics data
        let totalAmount = 0;
        if (user?.role === 'OWNER' || user?.role === 'ADMIN') {
          try {
            const analyticsResponse = await analyticsAPI.getAnalytics();
            totalAmount = analyticsResponse.data.organization.total_amount;
          } catch (error) {
            console.error('Error fetching analytics:', error);
            // Calculate from cargo requests if analytics fails
            totalAmount = cargos.reduce((sum: number, cargo: any) => 
              sum + parseFloat(cargo.amount), 0
            );
          }
        } else {
          // For other roles, just sum their cargo amounts
          totalAmount = cargos.reduce((sum: number, cargo: any) => 
            sum + parseFloat(cargo.amount), 0
          );
        }
        
        setStats({
          totalCargos: cargos.length,
          pendingCargos,
          completedCargos,
          totalAmount
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <Layout title="Dashboard">
        <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout title="Dashboard">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome, {user?.first_name || user?.username}!
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Role: {user?.role}
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Cargos
              </Typography>
              <Typography variant="h3">
                {stats.totalCargos}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Pending Cargos
              </Typography>
              <Typography variant="h3">
                {stats.pendingCargos}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Completed Cargos
              </Typography>
              <Typography variant="h3">
                {stats.completedCargos}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Amount
              </Typography>
              <Typography variant="h3">
                ${stats.totalAmount.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Dashboard; 