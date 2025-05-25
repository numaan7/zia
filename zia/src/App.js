import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Paper,
  Chip,
  Avatar,
  Modal,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Alert
} from '@mui/material';
import {
  School,
  MenuBook,
  People,
  Assessment,
  Phone,
  Email,
  LocationOn,
  Facebook,
  Twitter,
  Instagram,
  Star,
  Close,
  Person,
  Lock
} from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AdminService } from './models/Admin';
import { TeacherService } from './models/Teacher';
import DevTools from './components/DevTools';
import AdminDashboard from './components/AdminDashboard';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [userType, setUserType] = useState('admin');
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginOpen = () => {
    setLoginModalOpen(true);
    setLoginError('');
  };

  const handleLoginClose = () => {
    setLoginModalOpen(false);
    setLoginForm({ email: '', password: '' });
    setLoginError('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError('');

    try {
      let user;
      
      if (userType === 'admin') {
        user = await AdminService.authenticateAdmin(loginForm.email, loginForm.password);
      } else {
        user = await TeacherService.authenticateTeacher(loginForm.email, loginForm.password);
      }

      console.log('Login successful:', user);
      
      // Set user session and redirect to dashboard
      setCurrentUser({ ...user, userType });
      setIsLoggedIn(true);
      
      handleLoginClose();
    } catch (error) {
      console.error('Login error:', error);
      setLoginError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    setLoginForm({ email: '', password: '' });
    setUserType('admin');
  };

  const handleInputChange = (field) => (event) => {
    setLoginForm(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      {/* Check if user is logged in and show appropriate content */}
      {isLoggedIn && currentUser?.userType === 'admin' ? (
        <AdminDashboard user={currentUser} onLogout={handleLogout} />
      ) : (
        <div>
        {/* Navigation Bar */}
        <AppBar position="static" elevation={0}>
          <Toolbar>
            <School sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              ZIA SCHOOL
            </Typography>
            <Button color="inherit">Home</Button>
            <Button color="inherit">About</Button>
            <Button color="inherit">Gallery</Button>
            <Button color="inherit">Contact</Button>
            <Button variant="outlined" color="inherit" sx={{ ml: 2 }} onClick={handleLoginOpen}>
              Login
            </Button>
          </Toolbar>
        </AppBar>

        {/* Hero Section */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            py: 10,
            textAlign: 'center'
          }}
        >
          <Container maxWidth="md">
            <Typography variant="h2" component="h1" gutterBottom>
              Welcome to ZIA School
            </Typography>
            <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
              Empowering the next generation with quality education and innovative learning experiences.
            </Typography>
            <Box sx={{ mt: 4 }}>
              <Button
                variant="contained"
                size="large"
                sx={{ mr: 2, mb: 2, bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }}
              >
                Get Started
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{ mb: 2, borderColor: 'white', color: 'white', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}
              >
                Learn More
              </Button>
            </Box>
          </Container>
        </Box>

        
          <Container maxWidth="lg" sx={{ py: 8 }}>
            <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
              Everything You Need to Manage Your School
            </Typography>
            <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
              Powerful tools designed specifically for modern educational institutions
            </Typography>
            
            <Grid container spacing={4} justifyContent="center">
              <Grid item xs={12} sm={6} md={3} display="flex" justifyContent="center">
                <Card 
            sx={{ 
              height: '100%', 
              width: '100%',
              maxWidth: 280,
              textAlign: 'center', 
              p: 3,
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
              }
            }}
                >
            <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
              <Box sx={{ color: 'primary.main', mb: 3 }}>
                <People sx={{ fontSize: 64 }} />
              </Box>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Student Management
              </Typography>
              <Typography color="text.secondary" sx={{ flexGrow: 1 }}>
                Comprehensive student records, enrollment, attendance tracking, and performance monitoring.
              </Typography>
            </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3} display="flex" justifyContent="center">
                <Card 
            sx={{ 
              height: '100%', 
              width: '100%',
              maxWidth: 280,
              textAlign: 'center', 
              p: 3,
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
              }
            }}
                >
            <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
              <Box sx={{ color: 'primary.main', mb: 3 }}>
                <MenuBook sx={{ fontSize: 64 }} />
              </Box>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Course Management
              </Typography>
              <Typography color="text.secondary" sx={{ flexGrow: 1 }}>
                Create and manage courses, assignments, schedules, and curriculum planning with ease.
              </Typography>
            </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3} display="flex" justifyContent="center">
                <Card 
            sx={{ 
              height: '100%', 
              width: '100%',
              maxWidth: 280,
              textAlign: 'center', 
              p: 3,
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
              }
            }}
                >
            <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
              <Box sx={{ color: 'primary.main', mb: 3 }}>
                <Assessment sx={{ fontSize: 64 }} />
              </Box>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Analytics & Reports
              </Typography>
              <Typography color="text.secondary" sx={{ flexGrow: 1 }}>
                Detailed insights and reports on student performance, attendance, and institutional metrics.
              </Typography>
            </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3} display="flex" justifyContent="center">
                <Card 
            sx={{ 
              height: '100%', 
              width: '100%',
              maxWidth: 280,
              textAlign: 'center', 
              p: 3,
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
              }
            }}
                >
            <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
              <Box sx={{ color: 'primary.main', mb: 3 }}>
                <School sx={{ fontSize: 64 }} />
              </Box>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Administrative Tools
              </Typography>
              <Typography color="text.secondary" sx={{ flexGrow: 1 }}>
                Complete administrative suite including finance management, staff coordination, and communication tools.
              </Typography>
            </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Container>

          {/* Statistics Section */}
          <Box sx={{ bgcolor: 'grey.50', py: 6 }}>
            <Container maxWidth="lg">
              <Grid container spacing={4} textAlign="center" justifyContent="center">
                <Grid item xs={6} md={3}>
            <Typography variant="h3" color="primary.main" fontWeight="bold">
              10K+
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Students Managed
            </Typography>
                </Grid>
                <Grid item xs={6} md={3}>
            <Typography variant="h3" color="primary.main" fontWeight="bold">
              500+
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Schools Using
            </Typography>
                </Grid>
                <Grid item xs={6} md={3}>
            <Typography variant="h3" color="primary.main" fontWeight="bold">
              99.9%
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Uptime
            </Typography>
                </Grid>
                <Grid item xs={6} md={3}>
            <Typography variant="h3" color="primary.main" fontWeight="bold">
              24/7
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Support
            </Typography>
                </Grid>
              </Grid>
            </Container>
          </Box>

          {/* Testimonials Section */}
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
            What Schools Are Saying
          </Typography>
          <Grid container spacing={4} sx={{ mt: 4 }}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} sx={{ color: 'gold' }} />
                  ))}
                </Box>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  "EduManage Pro has revolutionized how we handle student records and communication. The interface is intuitive and the support team is fantastic."
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ mr: 2 }}>S</Avatar>
                  <Box>
                    <Typography variant="subtitle2">Sarah Johnson</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Principal, Westfield High School
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} sx={{ color: 'gold' }} />
                  ))}
                </Box>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  "The analytics and reporting features have given us incredible insights into our students' progress. Highly recommended for any educational institution."
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ mr: 2 }}>M</Avatar>
                  <Box>
                    <Typography variant="subtitle2">Michael Chen</Typography>
                    <Typography variant="caption" color="text.secondary">
                      IT Director, Riverside Academy
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} sx={{ color: 'gold' }} />
                  ))}
                </Box>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  "Implementation was smooth and the training provided was excellent. Our staff adapted quickly and productivity has increased significantly."
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ mr: 2 }}>E</Avatar>
                  <Box>
                    <Typography variant="subtitle2">Emily Rodriguez</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Administrator, Pine Valley Elementary
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>

        {/* CTA Section */}
        <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 8, textAlign: 'center' }}>
          <Container maxWidth="md">
            <Typography variant="h3" component="h2" gutterBottom>
              Ready to Transform Your School?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Join hundreds of schools already using EduManage Pro to streamline their operations and improve student outcomes.
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{ mr: 2, bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }}
            >
              Start Free Trial
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{ borderColor: 'white', color: 'white', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}
            >
              Schedule Demo
            </Button>
          </Container>
        </Box>

        {/* Footer */}
        <Box sx={{ bgcolor: 'grey.900', color: 'white', py: 6 }}>
          <Container maxWidth="lg">
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <School sx={{ mr: 1 }} />
                  <Typography variant="h6">EduManage Pro</Typography>
                </Box>
                <Typography variant="body2" color="grey.400">
                  Empowering educational institutions with cutting-edge management solutions for the digital age.
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <IconButton color="inherit">
                    <Facebook />
                  </IconButton>
                  <IconButton color="inherit">
                    <Twitter />
                  </IconButton>
                  <IconButton color="inherit">
                    <Instagram />
                  </IconButton>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom>
                  Contact Info
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Phone sx={{ mr: 1, fontSize: 'small' }} />
                  <Typography variant="body2">+1 (555) 123-4567</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Email sx={{ mr: 1, fontSize: 'small' }} />
                  <Typography variant="body2">support@edumanagepro.com</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationOn sx={{ mr: 1, fontSize: 'small' }} />
                  <Typography variant="body2">123 Education St, Learning City, LC 12345</Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom>
                  Quick Links
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>About Us</Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>Features</Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>Pricing</Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>Support</Typography>
                <Typography variant="body2">Privacy Policy</Typography>
              </Grid>
            </Grid>
            
            <Box sx={{ borderTop: '1px solid', borderColor: 'grey.700', mt: 4, pt: 4, textAlign: 'center' }}>
              <Typography variant="body2" color="grey.400">
                © 2025 EduManage Pro. All rights reserved.
              </Typography>
            </Box>
          </Container>
        </Box>

        {/* Login Modal */}
        <Modal
          open={loginModalOpen}
          onClose={handleLoginClose}
          aria-labelledby="login-modal-title"
          aria-describedby="login-modal-description"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: '90%', sm: 400 },
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 24,
              p: 4,
            }}
          >
            {/* Modal Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography id="login-modal-title" variant="h5" component="h2" fontWeight="bold">
                Welcome Back
              </Typography>
              <IconButton onClick={handleLoginClose} size="small">
                <Close />
              </IconButton>
            </Box>

            {/* User Type Selection */}
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="user-type-label">Login As</InputLabel>
              <Select
                labelId="user-type-label"
                value={userType}
                label="Login As"
                onChange={(e) => setUserType(e.target.value)}
              >
                <MenuItem value="admin">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Person sx={{ mr: 1 }} />
                    Administrator
                  </Box>
                </MenuItem>
                <MenuItem value="teacher">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <School sx={{ mr: 1 }} />
                    Teacher
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>

            <Divider sx={{ mb: 3 }} />

            {/* Error Alert */}
            {loginError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {loginError}
              </Alert>
            )}

            {/* Login Form */}
            <form onSubmit={handleLoginSubmit}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={loginForm.email}
                onChange={handleInputChange('email')}
                required
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
              
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={loginForm.password}
                onChange={handleInputChange('password')}
                required
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: <Lock sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ mb: 2 }}
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : `Sign In as ${userType === 'admin' ? 'Administrator' : 'Teacher'}`}
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Forgot your password?{' '}
                  <Button variant="text" size="small" sx={{ textTransform: 'none' }}>
                    Reset here
                  </Button>
                </Typography>
              </Box>
            </form>
          </Box>
        </Modal>

        {/* Development Tools */}
        <DevTools />
        </div>
      )}
    </ThemeProvider>
  );
}

export default App;
