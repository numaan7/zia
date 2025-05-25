import React, { useState, useEffect } from 'react';
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
  CardHeader,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Divider,
  Chip,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Modal,
  TextField,
  Alert,
  Paper,
  Fab,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  People,
  School,
  Assessment,
  Settings,
  ExitToApp,
  Notifications,
  AccountCircle,
  MenuBook,
  EventNote,
  TrendingUp,
  Add,
  Close,
  Person,
  Email,
  Phone,
  Subject
} from '@mui/icons-material';
import { TeacherService } from '../models/Teacher';
import { StudentService } from '../models/Student';
import AttendancePage from './AttendancePage';

const AdminDashboard = ({ user, onLogout }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('dashboard');
  
  // Grade options for student form
  const gradeOptions = [
    'Kindergarten',
    '1st Grade',
    '2nd Grade',
    '3rd Grade',
    '4th Grade',
    '5th Grade',
    '6th Grade',
    '7th Grade',
    '8th Grade',
    '9th Grade',
    '10th Grade',
    '11th Grade',
    '12th Grade'
  ];
  
  // Teacher management state
  const [teachers, setTeachers] = useState([]);
  const [addTeacherModal, setAddTeacherModal] = useState(false);
  const [teacherForm, setTeacherForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    subject: '',
    qualification: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', severity: 'info' });

  // Student management state
  const [students, setStudents] = useState([]);
  const [addStudentModal, setAddStudentModal] = useState(false);
  const [studentForm, setStudentForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    grade: '',
    dateOfBirth: '',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    address: ''
  });
  const [studentFormErrors, setStudentFormErrors] = useState({});

  // Load teachers on component mount and when teachers tab is selected
  useEffect(() => {
    if (selectedTab === 'teachers') {
      loadTeachers();
    } else if (selectedTab === 'students') {
      loadStudents();
    }
  }, [selectedTab]);

  const loadTeachers = async () => {
    try {
      setLoading(true);
      const teachersList = await TeacherService.getAllTeachers();
      setTeachers(teachersList);
    } catch (error) {
      console.error('Error loading teachers:', error);
      showAlert('Error loading teachers: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTeacher = async () => {
    try {
      setLoading(true);
      setFormErrors({});

      // Validate form
      const errors = {};
      if (!teacherForm.name.trim()) errors.name = 'Name is required';
      if (!teacherForm.email.trim()) errors.email = 'Email is required';
      if (!teacherForm.password.trim()) errors.password = 'Password is required';
      if (!teacherForm.subject.trim()) errors.subject = 'Subject is required';

      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }

      // Create teacher
      await TeacherService.createTeacher(teacherForm);
      
      // Reset form and close modal
      setTeacherForm({
        name: '',
        email: '',
        password: '',
        phone: '',
        subject: '',
        qualification: ''
      });
      setAddTeacherModal(false);
      
      // Refresh teachers list
      await loadTeachers();
      
      showAlert('Teacher added successfully!', 'success');
    } catch (error) {
      console.error('Error adding teacher:', error);
      showAlert('Error adding teacher: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message, severity = 'info') => {
    setAlert({ show: true, message, severity });
    setTimeout(() => {
      setAlert({ show: false, message: '', severity: 'info' });
    }, 5000);
  };

  const handleInputChange = (field, value) => {
    setTeacherForm(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Student management functions
  const loadStudents = async () => {
    try {
      setLoading(true);
      const studentsList = await StudentService.getAllStudents();
      setStudents(studentsList);
    } catch (error) {
      console.error('Error loading students:', error);
      showAlert('Error loading students: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async () => {
    try {
      setLoading(true);
      setStudentFormErrors({});

      // Validate form
      const errors = {};
      if (!studentForm.name.trim()) errors.name = 'Name is required';
      if (!studentForm.email.trim()) errors.email = 'Email is required';
      if (!studentForm.password.trim()) errors.password = 'Password is required';
      if (!studentForm.grade.trim()) errors.grade = 'Grade is required';
      if (!studentForm.parentName.trim()) errors.parentName = 'Parent name is required';

      if (Object.keys(errors).length > 0) {
        setStudentFormErrors(errors);
        return;
      }

      // Create student
      await StudentService.createStudent(studentForm);
      
      // Reset form and close modal
      setStudentForm({
        name: '',
        email: '',
        password: '',
        phone: '',
        grade: '',
        dateOfBirth: '',
        parentName: '',
        parentPhone: '',
        parentEmail: '',
        address: ''
      });
      setAddStudentModal(false);
      
      // Refresh students list
      await loadStudents();
      
      showAlert('Student added successfully!', 'success');
    } catch (error) {
      console.error('Error adding student:', error);
      showAlert('Error adding student: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStudentInputChange = (field, value) => {
    setStudentForm(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (studentFormErrors[field]) {
      setStudentFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Dashboard /> },
    { id: 'students', label: 'Students', icon: <People /> },
    { id: 'teachers', label: 'Teachers', icon: <School /> },
    { id: 'attendance', label: 'Attendance', icon: <EventNote /> },
    { id: 'analytics', label: 'Analytics', icon: <Assessment /> },
    { id: 'settings', label: 'Settings', icon: <Settings /> },
  ];

  const drawerWidth = 240;

  const drawer = (
    <Box>
      <Box sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.main', color: 'white' }}>
        <School sx={{ fontSize: 40, mb: 1 }} />
        <Typography variant="h6" fontWeight="bold">
          ZIA SCHOOL
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.8 }}>
          Admin Panel
        </Typography>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.id}
            selected={selectedTab === item.id}
            onClick={() => {
              setSelectedTab(item.id);
              if (isMobile) setMobileOpen(false);
            }}
            sx={{
              '&.Mui-selected': {
                bgcolor: 'primary.light',
                color: 'primary.contrastText',
                '&:hover': {
                  bgcolor: 'primary.light',
                },
              },
            }}
          >
            <ListItemIcon sx={{ color: selectedTab === item.id ? 'inherit' : 'text.secondary' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
      <Divider />
      <List>
        <ListItemButton onClick={onLogout}>
          <ListItemIcon>
            <ExitToApp />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </Box>
  );

  const DashboardContent = () => (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Welcome back, {user.name}!
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        Here's what's happening at ZIA School today
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    1,247
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Total Students
                  </Typography>
                </Box>
                <People sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
              <Box sx={{ mt: 2 }}>
                <Chip 
                  label="+12% from last month" 
                  size="small" 
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} 
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    87
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Total Teachers
                  </Typography>
                </Box>
                <School sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
              <Box sx={{ mt: 2 }}>
                <Chip 
                  label="+3 new hires" 
                  size="small" 
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} 
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    42
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Active Courses
                  </Typography>
                </Box>
                <MenuBook sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
              <Box sx={{ mt: 2 }}>
                <Chip 
                  label="5 new courses" 
                  size="small" 
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} 
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    94.2%
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Attendance Rate
                  </Typography>
                </Box>
                <TrendingUp sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
              <Box sx={{ mt: 2 }}>
                <Chip 
                  label="+2% improvement" 
                  size="small" 
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} 
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Activity & Quick Actions */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader 
              title="Recent Student Enrollments"
              action={
                <Button variant="outlined" size="small">
                  View All
                </Button>
              }
            />
            <CardContent>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Student Name</TableCell>
                      <TableCell>Grade</TableCell>
                      <TableCell>Enrollment Date</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[
                      { name: 'Alice Johnson', grade: '10th Grade', date: '2025-01-15', status: 'Active' },
                      { name: 'Bob Smith', grade: '9th Grade', date: '2025-01-14', status: 'Pending' },
                      { name: 'Carol Williams', grade: '11th Grade', date: '2025-01-13', status: 'Active' },
                      { name: 'David Brown', grade: '12th Grade', date: '2025-01-12', status: 'Active' },
                      { name: 'Emma Davis', grade: '10th Grade', date: '2025-01-11', status: 'Active' },
                    ].map((student, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                              {student.name.charAt(0)}
                            </Avatar>
                            {student.name}
                          </Box>
                        </TableCell>
                        <TableCell>{student.grade}</TableCell>
                        <TableCell>{student.date}</TableCell>
                        <TableCell>
                          <Chip 
                            label={student.status}
                            size="small"
                            color={student.status === 'Active' ? 'success' : 'warning'}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Quick Actions" />
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button 
                  variant="contained" 
                  fullWidth 
                  startIcon={<People />}
                  onClick={() => setAddStudentModal(true)}
                >
                  Add New Student
                </Button>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  startIcon={<School />}
                  onClick={() => setAddTeacherModal(true)}
                >
                  Add New Teacher
                </Button>
                <Button variant="outlined" fullWidth startIcon={<MenuBook />}>
                  Create Course
                </Button>
                <Button variant="outlined" fullWidth startIcon={<Assessment />}>
                  Generate Report
                </Button>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ mt: 3 }}>
            <CardHeader title="System Status" />
            <CardContent>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Server Status</Typography>
                  <Typography variant="body2" color="success.main">Online</Typography>
                </Box>
                <LinearProgress variant="determinate" value={98} color="success" />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Database</Typography>
                  <Typography variant="body2" color="success.main">Healthy</Typography>
                </Box>
                <LinearProgress variant="determinate" value={95} color="success" />
              </Box>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Storage</Typography>
                  <Typography variant="body2" color="warning.main">78%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={78} color="warning" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const renderContent = () => {
    switch (selectedTab) {
      case 'dashboard':
        return <DashboardContent />;
      case 'students':
        return (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h4" gutterBottom>Students Management</Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setAddStudentModal(true)}
              >
                Add New Student
              </Button>
            </Box>

            {loading && <LinearProgress sx={{ mb: 2 }} />}

            <Card>
              <CardContent>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Grade</TableCell>
                        <TableCell>Parent Name</TableCell>
                        <TableCell>Phone</TableCell>
                        <TableCell>Enrollment Date</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {students.length > 0 ? (
                        students.map((student) => (
                          <TableRow key={student.id}>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                                  {student.name.charAt(0).toUpperCase()}
                                </Avatar>
                                {student.name}
                              </Box>
                            </TableCell>
                            <TableCell>{student.email}</TableCell>
                            <TableCell>{student.grade}</TableCell>
                            <TableCell>{student.parentName}</TableCell>
                            <TableCell>{student.phone || 'N/A'}</TableCell>
                            <TableCell>{student.enrollmentDate}</TableCell>
                            <TableCell>
                              <Chip 
                                label={student.isActive ? 'Active' : 'Inactive'}
                                size="small"
                                color={student.isActive ? 'success' : 'default'}
                              />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} align="center">
                            <Typography variant="body2" color="text.secondary">
                              No students found. Add some students to get started.
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Box>
        );
      case 'attendance':
        return <AttendancePage user={user} />;
      case 'teachers':
        return (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h4" gutterBottom>Teachers Management</Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setAddTeacherModal(true)}
              >
                Add New Teacher
              </Button>
            </Box>

            {loading && <LinearProgress sx={{ mb: 2 }} />}

            <Card>
              <CardContent>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Subject</TableCell>
                        <TableCell>Phone</TableCell>
                        <TableCell>Qualification</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {teachers.length > 0 ? (
                        teachers.map((teacher) => (
                          <TableRow key={teacher.id}>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar sx={{ mr: 2, bgcolor: 'secondary.main' }}>
                                  {teacher.name.charAt(0).toUpperCase()}
                                </Avatar>
                                {teacher.name}
                              </Box>
                            </TableCell>
                            <TableCell>{teacher.email}</TableCell>
                            <TableCell>{teacher.subject}</TableCell>
                            <TableCell>{teacher.phone || 'N/A'}</TableCell>
                            <TableCell>{teacher.qualification || 'N/A'}</TableCell>
                            <TableCell>
                              <Chip 
                                label={teacher.isActive ? 'Active' : 'Inactive'}
                                size="small"
                                color={teacher.isActive ? 'success' : 'default'}
                              />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} align="center">
                            <Typography variant="body2" color="text.secondary">
                              No teachers found. Add some teachers to get started.
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Box>
        );
      case 'analytics':
        return (
          <Box>
            <Typography variant="h4" gutterBottom>Analytics</Typography>
            <Typography>Analytics and reports functionality coming soon...</Typography>
          </Box>
        );
      case 'settings':
        return (
          <Box>
            <Typography variant="h4" gutterBottom>Settings</Typography>
            <Typography>Settings functionality coming soon...</Typography>
          </Box>
        );
      default:
        return <DashboardContent />;
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Alert */}
      {alert.show && (
        <Alert 
          severity={alert.severity} 
          sx={{ 
            position: 'fixed', 
            top: 80, 
            right: 20, 
            zIndex: 2000,
            minWidth: 300
          }}
          onClose={() => setAlert({ show: false, message: '', severity: 'info' })}
        >
          {alert.message}
        </Alert>
      )}

      {/* Add Teacher Modal */}
      <Modal
        open={addTeacherModal}
        onClose={() => setAddTeacherModal(false)}
        aria-labelledby="add-teacher-modal"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 500 },
          bgcolor: 'background.paper',
          boxShadow: 24,
          borderRadius: 2,
          maxHeight: '90vh',
          overflow: 'auto'
        }}>
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" component="h2">
                Add New Teacher
              </Typography>
              <IconButton onClick={() => setAddTeacherModal(false)}>
                <Close />
              </IconButton>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={teacherForm.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  error={!!formErrors.name}
                  helperText={formErrors.name}
                  InputProps={{
                    startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={teacherForm.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  error={!!formErrors.email}
                  helperText={formErrors.email}
                  InputProps={{
                    startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={teacherForm.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  error={!!formErrors.password}
                  helperText={formErrors.password}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={teacherForm.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  InputProps={{
                    startAdornment: <Phone sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Subject"
                  value={teacherForm.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  error={!!formErrors.subject}
                  helperText={formErrors.subject}
                  InputProps={{
                    startAdornment: <Subject sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Qualification"
                  value={teacherForm.qualification}
                  onChange={(e) => handleInputChange('qualification', e.target.value)}
                  multiline
                  rows={2}
                />
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
              <Button
                variant="outlined"
                onClick={() => setAddTeacherModal(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleAddTeacher}
                disabled={loading}
                startIcon={loading ? null : <Add />}
              >
                {loading ? 'Adding...' : 'Add Teacher'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>

      {/* Add Student Modal */}
      <Modal
        open={addStudentModal}
        onClose={() => setAddStudentModal(false)}
        aria-labelledby="add-student-modal"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 600 },
          bgcolor: 'background.paper',
          boxShadow: 24,
          borderRadius: 2,
          maxHeight: '90vh',
          overflow: 'auto'
        }}>
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" component="h2">
                Add New Student
              </Typography>
              <IconButton onClick={() => setAddStudentModal(false)}>
                <Close />
              </IconButton>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={studentForm.name}
                  onChange={(e) => handleStudentInputChange('name', e.target.value)}
                  error={!!studentFormErrors.name}
                  helperText={studentFormErrors.name}
                  InputProps={{
                    startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={studentForm.email}
                  onChange={(e) => handleStudentInputChange('email', e.target.value)}
                  error={!!studentFormErrors.email}
                  helperText={studentFormErrors.email}
                  InputProps={{
                    startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={studentForm.password}
                  onChange={(e) => handleStudentInputChange('password', e.target.value)}
                  error={!!studentFormErrors.password}
                  helperText={studentFormErrors.password}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={studentForm.phone}
                  onChange={(e) => handleStudentInputChange('phone', e.target.value)}
                  InputProps={{
                    startAdornment: <Phone sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!studentFormErrors.grade}>
                  <InputLabel id="grade-select-label">Grade/Class *</InputLabel>
                  <Select
                    labelId="grade-select-label"
                    value={studentForm.grade}
                    label="Grade/Class *"
                    onChange={(e) => handleStudentInputChange('grade', e.target.value)}
                  >
                    {gradeOptions.map((grade) => (
                      <MenuItem key={grade} value={grade}>
                        {grade}
                      </MenuItem>
                    ))}
                  </Select>
                  {studentFormErrors.grade && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                      {studentFormErrors.grade}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date of Birth"
                  type="date"
                  value={studentForm.dateOfBirth}
                  onChange={(e) => handleStudentInputChange('dateOfBirth', e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mt: 2, mb: 1, color: 'primary.main' }}>
                  Parent/Guardian Information
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Parent/Guardian Name"
                  value={studentForm.parentName}
                  onChange={(e) => handleStudentInputChange('parentName', e.target.value)}
                  error={!!studentFormErrors.parentName}
                  helperText={studentFormErrors.parentName}
                  InputProps={{
                    startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Parent Phone"
                  value={studentForm.parentPhone}
                  onChange={(e) => handleStudentInputChange('parentPhone', e.target.value)}
                  InputProps={{
                    startAdornment: <Phone sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Parent Email"
                  type="email"
                  value={studentForm.parentEmail}
                  onChange={(e) => handleStudentInputChange('parentEmail', e.target.value)}
                  InputProps={{
                    startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  value={studentForm.address}
                  onChange={(e) => handleStudentInputChange('address', e.target.value)}
                  multiline
                  rows={2}
                />
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
              <Button
                variant="outlined"
                onClick={() => setAddStudentModal(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleAddStudent}
                disabled={loading}
                startIcon={loading ? null : <Add />}
              >
                {loading ? 'Adding...' : 'Add Student'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
      {/* Top Navigation */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {menuItems.find(item => item.id === selectedTab)?.label || 'Dashboard'}
          </Typography>
          <IconButton color="inherit">
            <Notifications />
          </IconButton>
          <IconButton color="inherit">
            <AccountCircle />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Sidebar Navigation */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
        }}
      >
        <Container maxWidth="lg">
          {renderContent()}
        </Container>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
