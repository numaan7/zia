import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Avatar,
  LinearProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Paper,
  Tabs,
  Tab,
  Divider
} from '@mui/material';
import {
  Today,
  CheckCircle,
  Cancel,
  Schedule,
  EventBusy,
  Save,
  Refresh,
  FilterList,
  Close,
  Analytics
} from '@mui/icons-material';
import { AttendanceService } from '../models/Attendance';
import { StudentService } from '../models/Student';

const AttendancePage = ({ user }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', severity: 'info' });
  
  // Attendance marking state
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [bulkStatus, setBulkStatus] = useState('');
  
  // Attendance viewing state
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [viewDate, setViewDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterGrade, setFilterGrade] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  
  // Stats state
  const [attendanceStats, setAttendanceStats] = useState({
    total: 0,
    present: 0,
    absent: 0,
    late: 0,
    excused: 0,
    attendanceRate: 0
  });

  const attendanceStatuses = [
    { value: 'present', label: 'Present', color: 'success', icon: <CheckCircle /> },
    { value: 'absent', label: 'Absent', color: 'error', icon: <Cancel /> },
    { value: 'late', label: 'Late', color: 'warning', icon: <Schedule /> },
    { value: 'excused', label: 'Excused', color: 'info', icon: <EventBusy /> }
  ];

  const gradeOptions = [
    'Kindergarten', '1st Grade', '2nd Grade', '3rd Grade', '4th Grade', 
    '5th Grade', '6th Grade', '7th Grade', '8th Grade', '9th Grade', 
    '10th Grade', '11th Grade', '12th Grade'
  ];

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    if (selectedTab === 0) {
      loadExistingAttendance();
    } else if (selectedTab === 1) {
      loadAttendanceRecords();
    }
  }, [selectedTab, selectedDate, viewDate]);

  const showAlert = (message, severity = 'info') => {
    setAlert({ show: true, message, severity });
    setTimeout(() => {
      setAlert({ show: false, message: '', severity: 'info' });
    }, 5000);
  };

  const loadStudents = async () => {
    try {
      setLoading(true);
      const studentsList = await StudentService.getAllStudents();
      const activeStudents = studentsList.filter(student => student.isActive);
      setStudents(activeStudents);
    } catch (error) {
      console.error('Error loading students:', error);
      showAlert('Error loading students: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadExistingAttendance = async () => {
    try {
      const existingAttendance = await AttendanceService.getAttendanceByDate(selectedDate);
      const attendanceMap = {};
      
      existingAttendance.forEach(record => {
        attendanceMap[record.studentId] = {
          status: record.status,
          timeIn: record.timeIn,
          timeOut: record.timeOut,
          notes: record.notes,
          id: record.id
        };
      });
      
      setAttendanceData(attendanceMap);
    } catch (error) {
      console.error('Error loading existing attendance:', error);
      showAlert('Error loading existing attendance: ' + error.message, 'error');
    }
  };

  const loadAttendanceRecords = async () => {
    try {
      setLoading(true);
      let records = await AttendanceService.getAttendanceByDate(viewDate);
      
      // Apply filters
      if (filterGrade) {
        records = records.filter(record => record.grade === filterGrade);
      }
      if (filterStatus) {
        records = records.filter(record => record.status === filterStatus);
      }
      
      setAttendanceRecords(records);
      
      // Calculate stats
      const stats = {
        total: records.length,
        present: records.filter(r => r.status === 'present').length,
        absent: records.filter(r => r.status === 'absent').length,
        late: records.filter(r => r.status === 'late').length,
        excused: records.filter(r => r.status === 'excused').length
      };
      
      stats.attendanceRate = stats.total > 0 ? 
        ((stats.present + stats.late + stats.excused) / stats.total * 100).toFixed(1) : 0;
      
      setAttendanceStats(stats);
    } catch (error) {
      console.error('Error loading attendance records:', error);
      showAlert('Error loading attendance records: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceChange = (studentId, field, value) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value
      }
    }));
  };

  const handleBulkStatusChange = (status) => {
    if (!status) return;
    
    const newAttendanceData = {};
    students.forEach(student => {
      newAttendanceData[student.id] = {
        ...attendanceData[student.id],
        status: status,
        timeIn: status === 'present' || status === 'late' ? new Date().toLocaleTimeString() : '',
        timeOut: ''
      };
    });
    
    setAttendanceData(newAttendanceData);
    setBulkStatus('');
    showAlert(`Marked all students as ${status}`, 'success');
  };

  const saveAttendance = async () => {
    try {
      setLoading(true);
      
      const attendanceList = students.map(student => ({
        studentId: student.id,
        studentName: student.name,
        studentEmail: student.email,
        grade: student.grade,
        date: selectedDate,
        status: attendanceData[student.id]?.status || 'absent',
        timeIn: attendanceData[student.id]?.timeIn || '',
        timeOut: attendanceData[student.id]?.timeOut || '',
        notes: attendanceData[student.id]?.notes || '',
        markedBy: user.name || user.email
      }));

      // Filter out students that already have attendance marked
      const newAttendanceList = attendanceList.filter(record => 
        !attendanceData[record.studentId]?.id
      );

      // Update existing records
      const updatePromises = students
        .filter(student => attendanceData[student.id]?.id)
        .map(student => {
          const record = attendanceData[student.id];
          return AttendanceService.updateAttendance(record.id, {
            status: record.status || 'absent',
            timeIn: record.timeIn || '',
            timeOut: record.timeOut || '',
            notes: record.notes || ''
          });
        });

      await Promise.all(updatePromises);

      if (newAttendanceList.length > 0) {
        const result = await AttendanceService.markBulkAttendance(newAttendanceList);
        
        if (result.errors.length > 0) {
          showAlert(`Saved with ${result.errors.length} errors. Check console for details.`, 'warning');
          console.log('Attendance errors:', result.errors);
        } else {
          showAlert('Attendance saved successfully!', 'success');
        }
      } else {
        showAlert('Attendance updated successfully!', 'success');
      }
      
      await loadExistingAttendance();
    } catch (error) {
      console.error('Error saving attendance:', error);
      showAlert('Error saving attendance: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const getStatusChip = (status) => {
    const statusConfig = attendanceStatuses.find(s => s.value === status) || attendanceStatuses[0];
    return (
      <Chip
        icon={statusConfig.icon}
        label={statusConfig.label}
        color={statusConfig.color}
        size="small"
      />
    );
  };

  const MarkAttendanceTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Mark Attendance</Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            type="date"
            label="Date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            size="small"
          />
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={loadStudents}
            disabled={loading}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Bulk Actions */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Quick Actions</Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Mark All As</InputLabel>
              <Select
                value={bulkStatus}
                onChange={(e) => setBulkStatus(e.target.value)}
                label="Mark All As"
              >
                {attendanceStatuses.map(status => (
                  <MenuItem key={status.value} value={status.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {status.icon}
                      {status.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              onClick={() => handleBulkStatusChange(bulkStatus)}
              disabled={!bulkStatus}
            >
              Apply to All
            </Button>
            <Button
              variant="contained"
              color="success"
              startIcon={<Save />}
              onClick={saveAttendance}
              disabled={loading}
            >
              Save Attendance
            </Button>
          </Box>
        </CardContent>
      </Card>

      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {/* Students List */}
      <Card>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student</TableCell>
                  <TableCell>Grade</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Time In</TableCell>
                  <TableCell>Time Out</TableCell>
                  <TableCell>Notes</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student) => {
                  const attendance = attendanceData[student.id] || {};
                  return (
                    <TableRow key={student.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                            {student.name.charAt(0).toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight="bold">
                              {student.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {student.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{student.grade}</TableCell>
                      <TableCell>
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                          <Select
                            value={attendance.status || 'present'}
                            onChange={(e) => handleAttendanceChange(student.id, 'status', e.target.value)}
                          >
                            {attendanceStatuses.map(status => (
                              <MenuItem key={status.value} value={status.value}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  {status.icon}
                                  {status.label}
                                </Box>
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          type="time"
                          value={attendance.timeIn || ''}
                          onChange={(e) => handleAttendanceChange(student.id, 'timeIn', e.target.value)}
                          disabled={attendance.status === 'absent'}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          type="time"
                          value={attendance.timeOut || ''}
                          onChange={(e) => handleAttendanceChange(student.id, 'timeOut', e.target.value)}
                          disabled={attendance.status === 'absent'}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          placeholder="Add notes..."
                          value={attendance.notes || ''}
                          onChange={(e) => handleAttendanceChange(student.id, 'notes', e.target.value)}
                          multiline
                          maxRows={2}
                          sx={{ minWidth: 150 }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );

  const ViewAttendanceTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">View Attendance</Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            type="date"
            label="Date"
            value={viewDate}
            onChange={(e) => setViewDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            size="small"
          />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Grade</InputLabel>
            <Select
              value={filterGrade}
              onChange={(e) => setFilterGrade(e.target.value)}
              label="Grade"
            >
              <MenuItem value="">All Grades</MenuItem>
              {gradeOptions.map(grade => (
                <MenuItem key={grade} value={grade}>{grade}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              label="Status"
            >
              <MenuItem value="">All Status</MenuItem>
              {attendanceStatuses.map(status => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary.main" fontWeight="bold">
                {attendanceStats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Students
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main" fontWeight="bold">
                {attendanceStats.present}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Present
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="error.main" fontWeight="bold">
                {attendanceStats.absent}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Absent
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main" fontWeight="bold">
                {attendanceStats.late}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Late
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary.main" fontWeight="bold">
                {attendanceStats.attendanceRate}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Attendance Rate
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {/* Attendance Records */}
      <Card>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student</TableCell>
                  <TableCell>Grade</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Time In</TableCell>
                  <TableCell>Time Out</TableCell>
                  <TableCell>Notes</TableCell>
                  <TableCell>Marked By</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendanceRecords.length > 0 ? (
                  attendanceRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                            {record.studentName.charAt(0).toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight="bold">
                              {record.studentName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {record.studentEmail}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{record.grade}</TableCell>
                      <TableCell>{getStatusChip(record.status)}</TableCell>
                      <TableCell>{record.timeIn || 'N/A'}</TableCell>
                      <TableCell>{record.timeOut || 'N/A'}</TableCell>
                      <TableCell>{record.notes || 'N/A'}</TableCell>
                      <TableCell>{record.markedBy}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography variant="body2" color="text.secondary">
                        No attendance records found for the selected date and filters.
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

  return (
    <Box sx={{ p: 3 }}>
      {alert.show && (
        <Alert 
          severity={alert.severity} 
          sx={{ mb: 2 }}
          onClose={() => setAlert({ show: false, message: '', severity: 'info' })}
        >
          {alert.message}
        </Alert>
      )}

      <Typography variant="h4" gutterBottom fontWeight="bold">
        Attendance Management
      </Typography>
      
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={selectedTab} 
          onChange={(e, newValue) => setSelectedTab(newValue)}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab 
            icon={<Today />} 
            label="Mark Attendance" 
            iconPosition="start"
          />
          <Tab 
            icon={<Analytics />} 
            label="View Records" 
            iconPosition="start"
          />
        </Tabs>
      </Paper>

      {selectedTab === 0 && <MarkAttendanceTab />}
      {selectedTab === 1 && <ViewAttendanceTab />}
    </Box>
  );
};

export default AttendancePage;
