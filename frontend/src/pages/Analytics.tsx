import React, { useState, useEffect } from 'react';
import { 
  Typography, Box, CircularProgress, Paper,
  Card, CardContent, Grid,
  ButtonGroup, MenuItem, Select, FormControl,
  InputLabel, SelectChangeEvent, Button
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import { analyticsAPI, cargoAPI } from '../api/api';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface MonthlyData {
  month: number;
  year: number;
  driver: {
    id: number | null;
    name: string;
  };
  logistician: {
    id: number | null;
    name: string;
  };
  total_amount: number;
  total_cargos: number;
}

interface AnalyticsData {
  organization: {
    id: number;
    name: string;
    total_amount: number;
    total_cargos: number;
  };
  monthly_data: MonthlyData[];
  total_requests: number;
  completed_requests: number;
  total_cargo_weight: number;
  avg_delivery_time: number;
}

const Analytics: React.FC = () => {
  const { user } = useAuth();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [chartView, setChartView] = useState<'financial' | 'cargo'>('financial');
  const [timeFilter, setTimeFilter] = useState<'all' | 'year' | 'month'>('all');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [yearOptions, setYearOptions] = useState<number[]>([]);
  
  // Fetch analytics data
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        const response = await analyticsAPI.getAnalytics();
        setAnalyticsData(response.data);
        
        // Extract available years from data
        if (response.data.monthly_data.length > 0) {
          // Using Array.from instead of spread operator to avoid TypeScript target compatibility issues
          const yearSet = new Set(response.data.monthly_data.map((item: MonthlyData) => item.year));
          const years = Array.from(yearSet) as number[];
          setYearOptions(years.sort((a: number, b: number) => b - a)); // Sort descending
          if (years.length > 0) {
            setSelectedYear(years[0] as number); // Default to most recent year
          }
        }
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  const handleTimeFilterChange = (event: SelectChangeEvent) => {
    setTimeFilter(event.target.value as 'all' | 'year' | 'month');
  };

  const handleYearChange = (event: SelectChangeEvent) => {
    setSelectedYear(Number(event.target.value));
  };

  // Format month number to name
  const getMonthName = (month: number) => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return monthNames[month - 1];
  };

  // Filter data based on selected time period
  const getFilteredData = () => {
    if (!analyticsData) return [];
    
    let filteredData = [...analyticsData.monthly_data];
    
    if (timeFilter === 'year') {
      filteredData = filteredData.filter(item => item.year === selectedYear);
    } else if (timeFilter === 'month') {
      const currentMonth = new Date().getMonth() + 1;
      filteredData = filteredData.filter(item => item.year === selectedYear && item.month === currentMonth);
    }
    
    return filteredData;
  };

  // Prepare financial data for chart
  const getFinancialChartData = () => {
    const filteredData = getFilteredData();
    
    const labels = filteredData.map(item => `${getMonthName(item.month)} ${item.year}`);
    const amounts = filteredData.map(item => item.total_amount);
    
    return {
      labels,
      datasets: [
        {
          label: 'Revenue ($)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          data: amounts,
        }
      ]
    };
  };

  // Prepare cargo data for chart
  const getCargoChartData = () => {
    const filteredData = getFilteredData();
    
    const labels = filteredData.map(item => `${getMonthName(item.month)} ${item.year}`);
    const counts = filteredData.map(item => item.total_cargos);
    
    return {
      labels,
      datasets: [
        {
          label: 'Number of Cargos',
          backgroundColor: 'rgba(153, 102, 255, 0.5)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1,
          data: counts,
        }
      ]
    };
  };

  // Get driver performance data
  const getDriverPerformanceData = () => {
    const filteredData = getFilteredData();
    
    // Aggregate data by driver
    const driverMap = new Map();
    
    filteredData.forEach(item => {
      if (item.driver.id) {
        const driverId = item.driver.id;
        if (!driverMap.has(driverId)) {
          driverMap.set(driverId, {
            name: item.driver.name,
            total_amount: 0,
            total_cargos: 0
          });
        }
        
        const driverData = driverMap.get(driverId);
        driverData.total_amount += item.total_amount;
        driverData.total_cargos += item.total_cargos;
      }
    });
    
    const driverNames = Array.from(driverMap.values()).map(driver => driver.name);
    const driverAmounts = Array.from(driverMap.values()).map(driver => driver.total_amount);
    
    return {
      labels: driverNames,
      datasets: [
        {
          label: 'Driver Performance',
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
          ],
          borderWidth: 1,
          data: driverAmounts,
        }
      ]
    };
  };

  if (loading) {
    return (
      <Layout title="Analytics">
        <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout title="Analytics">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Analytics Dashboard
        </Typography>
        
        {analyticsData && (
          <Typography variant="subtitle1" color="textSecondary">
            Organization: {analyticsData.organization.name}
          </Typography>
        )}
      </Box>
      
      {/* Summary Cards */}
      {analyticsData && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Requests
                </Typography>
                <Typography variant="h5">
                  {analyticsData.total_requests}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Completed Requests
                </Typography>
                <Typography variant="h5">
                  {analyticsData.completed_requests}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Cargo Weight
                </Typography>
                <Typography variant="h5">
                  {analyticsData.total_cargo_weight} kg
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Average Delivery Time
                </Typography>
                <Typography variant="h5">
                  {analyticsData.avg_delivery_time} days
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
      
      {/* Filters and Chart Type Controls */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <ButtonGroup variant="outlined">
          <Button 
            color={chartView === 'financial' ? 'primary' : 'inherit'}
            variant={chartView === 'financial' ? 'contained' : 'outlined'}
            onClick={() => setChartView('financial')}
          >
            Financial
          </Button>
          <Button 
            color={chartView === 'cargo' ? 'primary' : 'inherit'}
            variant={chartView === 'cargo' ? 'contained' : 'outlined'}
            onClick={() => setChartView('cargo')}
          >
            Cargo
          </Button>
        </ButtonGroup>
        
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Time Period</InputLabel>
          <Select
            value={timeFilter}
            label="Time Period"
            onChange={handleTimeFilterChange}
          >
            <MenuItem value="all">All Time</MenuItem>
            <MenuItem value="year">Year</MenuItem>
            <MenuItem value="month">Current Month</MenuItem>
          </Select>
        </FormControl>
        
        {timeFilter === 'year' && (
          <FormControl sx={{ minWidth: 100 }}>
            <InputLabel>Year</InputLabel>
            <Select
              value={selectedYear.toString()}
              label="Year"
              onChange={handleYearChange}
            >
              {yearOptions.map(year => (
                <MenuItem key={year} value={year.toString()}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>
      
      {/* Main Chart */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          {chartView === 'financial' ? 'Financial Performance' : 'Cargo Activity'}
        </Typography>
        <Box sx={{ height: 400 }}>
          {analyticsData && analyticsData.monthly_data.length > 0 ? (
            <Bar 
              data={chartView === 'financial' ? getFinancialChartData() : getCargoChartData()} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }}
            />
          ) : (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
              <Typography color="textSecondary">No data available for the selected period</Typography>
            </Box>
          )}
        </Box>
      </Paper>
      
      {/* Driver Performance Chart */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Driver Performance
        </Typography>
        <Box sx={{ height: 400 }}>
          {analyticsData && analyticsData.monthly_data.length > 0 ? (
            <Grid container spacing={2}>
              <Grid item xs={12} md={7}>
                <Bar 
                  data={getDriverPerformanceData()} 
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                      title: {
                        display: true,
                        text: 'Driver Performance'
                      }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={5}>
                <Pie 
                  data={getDriverPerformanceData()}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                      title: {
                        display: true,
                        text: 'Deliveries by Driver'
                      }
                    }
                  }}
                />
              </Grid>
            </Grid>
          ) : (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
              <Typography color="textSecondary">No driver performance data available</Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </Layout>
  );
};

export default Analytics; 