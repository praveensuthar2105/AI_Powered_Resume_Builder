import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Alert,
  CircularProgress,
  Avatar,
  TextField,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  TablePagination,
  TableSortLabel,
} from '@mui/material';
import {
  SafetyOutlined,
  UserOutlined,
  SearchOutlined,
  DeleteOutlined,
  ReloadOutlined,
  TeamOutlined,
  FilePdfOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  DownloadOutlined,
  DatabaseOutlined,
  CloudServerOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { getAuthHeaders } from '../utils/auth';
import { API_BASE_URL } from '../services/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const AdminPanel = () => {
  const [currentUserRole, setCurrentUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  // Users State
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [orderBy, setOrderBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Analytics State
  const [analytics, setAnalytics] = useState(null);

  // System Health State
  const [health, setHealth] = useState(null);

  // Audit Log State
  const [auditLogs, setAuditLogs] = useState([]);
  const [auditPage, setAuditPage] = useState(0);
  const [auditRowsPerPage, setAuditRowsPerPage] = useState(20);
  const [totalAuditLogs, setTotalAuditLogs] = useState(0);

  useEffect(() => {
    verifyAdmin();
  }, []);

  useEffect(() => {
    if (currentUserRole === 'ADMIN') {
      if (tabValue === 0) fetchUsers();
      else if (tabValue === 1) fetchAnalytics();
      else if (tabValue === 2) fetchHealth();
      else if (tabValue === 3) fetchAuditLogs();
    }
  }, [currentUserRole, tabValue, page, rowsPerPage, orderBy, order, auditPage, auditRowsPerPage]);

  const verifyAdmin = async () => {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole');

    if (!token || role !== 'ADMIN') {
      setError('Access denied. Admin role required.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/user/me`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) throw new Error('Authentication failed');
      const userData = await response.json();

      if (userData.role !== 'ADMIN') {
        localStorage.setItem('userRole', userData.role);
        setError('Access denied. Admin privileges have been revoked.');
        setLoading(false);
        return;
      }

      setCurrentUserRole('ADMIN');
      setLoading(false);
    } catch (err) {
      setError('Failed to verify admin status');
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const sortParam = `${orderBy},${order}`;
      const url = `${API_BASE_URL}/admin/users?page=${page}&size=${rowsPerPage}&sort=${sortParam}`;
      const response = await fetch(url, { headers: getAuthHeaders() });
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data.content || []);
      setTotalUsers(data.totalElements || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/stats`, { headers: getAuthHeaders() });
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setAnalytics(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchHealth = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/system-health`, { headers: getAuthHeaders() });
      if (!response.ok) throw new Error('Failed to fetch health');
      const data = await response.json();
      setHealth(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAuditLogs = async () => {
    setLoading(true);
    try {
      const url = `${API_BASE_URL}/admin/audit-log?page=${auditPage}&size=${auditRowsPerPage}&sort=timestamp,desc`;
      const response = await fetch(url, { headers: getAuthHeaders() });
      if (!response.ok) throw new Error('Failed to fetch audit logs');
      const data = await response.json();
      setAuditLogs(data.content || []);
      setTotalAuditLogs(data.totalElements || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const exportUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/export`, { headers: getAuthHeaders() });
      if (!response.ok) throw new Error('Failed to export users');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'users.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      setError(err.message);
    }
  };

  const grantAdminRole = async (userId, userName) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/grant-admin/${userId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to grant admin role');
      setSuccess(`Admin role granted to ${userName}`);
      fetchUsers();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const revokeAdminRole = async (userId, userName) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/revoke-admin/${userId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to revoke admin role');
      setSuccess(`Admin role revoked from ${userName}`);
      fetchUsers();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      const response = await fetch(`${API_BASE_URL}/admin/delete-user/${userToDelete.id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to delete user');
      setSuccess(`User ${userToDelete.name} deleted successfully`);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
      fetchUsers();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
      setDeleteDialogOpen(false);
    }
  };

  const StatCard = ({ title, value, icon, gradient }) => (
    <Card sx={{ background: gradient, height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h4" color="white" fontWeight={700}>
              {value}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
              {title}
            </Typography>
          </Box>
          <Box sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 40 }}>{icon}</Box>
        </Box>
      </CardContent>
    </Card>
  );

  const HealthIndicator = ({ label, status, details }) => (
    <Box display="flex" alignItems="center" justifyContent="space-between" p={2} borderBottom="1px solid #eee">
      <Box display="flex" alignItems="center" gap={2}>
        {status === 'UP' || status === true ? (
          <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 24 }} />
        ) : (
          <CircularProgress size={24} color="error" variant={status === 'DOWN' ? 'determinate' : 'indeterminate'} value={100} />
        )}
        <Box>
          <Typography variant="subtitle1" fontWeight={600}>{label}</Typography>
          <Typography variant="caption" color="text.secondary">
            {JSON.stringify(details).slice(0, 100)}
          </Typography>
        </Box>
      </Box>
      <Chip
        label={status === 'UP' || status === true ? 'Healthy' : 'Issues'}
        color={status === 'UP' || status === true ? 'success' : 'error'}
        size="small"
      />
    </Box>
  );

  if (currentUserRole !== 'ADMIN' && !loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error">Access denied. Admin privileges required.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1,
          }}
        >
          <SafetyOutlined style={{ marginRight: 12 }} />
          Admin Dashboard
        </Typography>
      </Box>

      {success && <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>{error}</Alert>}

      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} centered variant="fullWidth">
          <Tab icon={<TeamOutlined />} label="Users" />
          <Tab icon={<DatabaseOutlined />} label="Analytics" />
          <Tab icon={<CloudServerOutlined />} label="System Health" />
          <Tab icon={<UnorderedListOutlined />} label="Audit Log" />
        </Tabs>
      </Paper>

      {/* USERS TAB */}
      {tabValue === 0 && (
        <Box>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
            <Box display="flex" gap={2}>
              <TextField
                placeholder="Search users..."
                size="small"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start"><SearchOutlined /></InputAdornment> }}
              />
              <Button startIcon={<ReloadOutlined />} onClick={fetchUsers}>Refresh</Button>
            </Box>
            <Button variant="contained" startIcon={<DownloadOutlined />} onClick={exportUsers}>
              Export CSV
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ bgcolor: '#F9FAFB' }}>
                <TableRow>
                  <TableCell>
                    <TableSortLabel active={orderBy === 'name'} direction={orderBy === 'name' ? order : 'asc'} onClick={() => handleRequestSort('name')}>
                      User
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel active={orderBy === 'email'} direction={orderBy === 'email' ? order : 'asc'} onClick={() => handleRequestSort('email')}>
                      Email
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>
                    <TableSortLabel active={orderBy === 'createdAt'} direction={orderBy === 'createdAt' ? order : 'asc'} onClick={() => handleRequestSort('createdAt')}>
                      Joined
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar src={user.picture} alt={user.name} />
                        <Typography variant="body2">{user.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        icon={user.role === 'ADMIN' ? <SafetyOutlined /> : <UserOutlined />}
                        label={user.role}
                        color={user.role === 'ADMIN' ? 'secondary' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell align="center">
                      <Box display="flex" gap={1} justifyContent="center">
                        {user.role === 'ADMIN' ? (
                          <Button size="small" color="warning" onClick={() => revokeAdminRole(user.id, user.name)}>Revoke</Button>
                        ) : (
                          <Button size="small" onClick={() => grantAdminRole(user.id, user.name)}>Grant Admin</Button>
                        )}
                        <IconButton size="small" color="error" onClick={() => { setUserToDelete(user); setDeleteDialogOpen(true); }}>
                          <DeleteOutlined />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={totalUsers}
              page={page}
              onPageChange={(e, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
            />
          </TableContainer>
        </Box>
      )}

      {/* ANALYTICS TAB */}
      {tabValue === 1 && analytics && (
        <Box>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard title="Total Resumes" value={analytics.totalResumes} icon={<FileTextOutlined />} gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard title="PDF Compilations" value={analytics.totalPdf} icon={<FilePdfOutlined />} gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard title="ATS Checks" value={analytics.totalAts} icon={<CheckCircleOutlined />} gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard title="Total Users" value={totalUsers} icon={<UserOutlined />} gradient="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)" />
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" mb={2}>Daily Signups (Last 30 Days)</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics.dailySignups}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" mb={2}>Template Usage</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.templateUsage}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      {analytics.templateUsage.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* SYSTEM HEALTH TAB */}
      {tabValue === 2 && health && (
        <Box>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>System Status</Typography>
            <HealthIndicator label="LaTeX Compiler" status={health.latex?.ready ? 'UP' : 'DOWN'} details={health.latex} />
            <HealthIndicator label="Database" status={health.database?.status} details={health.database} />
            <HealthIndicator label="Redis Cache" status={health.redis?.status} details={health.redis} />
            <HealthIndicator label="Compilation Queue" status="UP" details={health.queue} />
          </Paper>
        </Box>
      )}

      {/* AUDIT LOG TAB */}
      {tabValue === 3 && (
        <Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>Admin</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell>Target User</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {auditLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                    <TableCell>{log.adminEmail}</TableCell>
                    <TableCell>
                      <Chip
                        label={log.action}
                        color={log.action === 'DELETE_USER' ? 'error' : log.action === 'GRANT_ADMIN' ? 'success' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{log.targetUserEmail}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={totalAuditLogs}
              page={auditPage}
              onPageChange={(e, p) => setAuditPage(p)}
              rowsPerPage={auditRowsPerPage}
              onRowsPerPageChange={(e) => { setAuditRowsPerPage(parseInt(e.target.value, 10)); setAuditPage(0); }}
            />
          </TableContainer>
        </Box>
      )}

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{userToDelete?.name}</strong>?
          </Typography>
          <Alert severity="warning" sx={{ mt: 2 }}>Irreversible action.</Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteUser} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminPanel;
