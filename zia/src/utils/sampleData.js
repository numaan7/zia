import { AdminService } from '../models/Admin';
import { TeacherService } from '../models/Teacher';
import { StudentService } from '../models/Student';
import { AttendanceService } from '../models/Attendance';

// Sample data for testing
export const sampleAdmins = [
  {
    name: 'John Smith',
    email: 'admin@ziaschool.com',
    password: 'admin123',
    phone: '+1234567890'
  },
  {
    name: 'Sarah Johnson',
    email: 'sarah.admin@ziaschool.com',
    password: 'sarah123',
    phone: '+1987654321'
  }
];

export const sampleTeachers = [
  {
    name: 'Dr. Emily Brown',
    email: 'emily.teacher@ziaschool.com',
    password: 'teacher123',
    phone: '+1122334455',
    subject: 'Mathematics',
    qualification: 'PhD in Mathematics'
  },
  {
    name: 'Michael Wilson',
    email: 'michael.teacher@ziaschool.com',
    password: 'teacher123',
    phone: '+1555666777',
    subject: 'Physics',
    qualification: 'MSc in Physics'
  },
  {
    name: 'Lisa Davis',
    email: 'lisa.teacher@ziaschool.com',
    password: 'teacher123',
    phone: '+1888999000',
    subject: 'English Literature',
    qualification: 'MA in English Literature'
  }
];

export const sampleStudents = [
  {
    name: 'Alice Johnson',
    email: 'alice.student@ziaschool.com',
    password: 'student123',
    phone: '+1234567001',
    grade: '10th Grade',
    dateOfBirth: '2008-05-15',
    parentName: 'Robert Johnson',
    parentPhone: '+1234567890',
    parentEmail: 'robert.johnson@email.com',
    address: '123 Oak Street, Springfield, IL 62701'
  },
  {
    name: 'Bob Smith',
    email: 'bob.student@ziaschool.com',
    password: 'student123',
    phone: '+1234567002',
    grade: '9th Grade',
    dateOfBirth: '2009-08-22',
    parentName: 'Mary Smith',
    parentPhone: '+1234567891',
    parentEmail: 'mary.smith@email.com',
    address: '456 Pine Avenue, Springfield, IL 62702'
  },
  {
    name: 'Charlie Brown',
    email: 'charlie.student@ziaschool.com',
    password: 'student123',
    phone: '+1234567003',
    grade: '11th Grade',
    dateOfBirth: '2007-12-10',
    parentName: 'David Brown',
    parentPhone: '+1234567892',
    parentEmail: 'david.brown@email.com',
    address: '789 Maple Drive, Springfield, IL 62703'
  },
  {
    name: 'Diana Prince',
    email: 'diana.student@ziaschool.com',
    password: 'student123',
    phone: '+1234567004',
    grade: '12th Grade',
    dateOfBirth: '2006-03-18',
    parentName: 'Helen Prince',
    parentPhone: '+1234567893',
    parentEmail: 'helen.prince@email.com',
    address: '321 Cedar Lane, Springfield, IL 62704'
  },
  {
    name: 'Edward Wilson',
    email: 'edward.student@ziaschool.com',
    password: 'student123',
    phone: '+1234567005',
    grade: '10th Grade',
    dateOfBirth: '2008-11-05',
    parentName: 'Jennifer Wilson',
    parentPhone: '+1234567894',
    parentEmail: 'jennifer.wilson@email.com',
    address: '654 Birch Court, Springfield, IL 62705'
  }
];

// Function to create sample admins
export const createSampleAdmins = async () => {
  try {
    console.log('Creating sample admins...');
    
    for (const adminData of sampleAdmins) {
      try {
        // Check if admin already exists
        const existingAdmin = await AdminService.getAdminByEmail(adminData.email);
        if (!existingAdmin) {
          await AdminService.createAdmin(adminData);
          console.log(`✅ Created admin: ${adminData.name}`);
        } else {
          console.log(`⚠️ Admin already exists: ${adminData.name}`);
        }
      } catch (error) {
        console.error(`❌ Error creating admin ${adminData.name}:`, error.message);
      }
    }
    
    console.log('Sample admins creation completed!');
  } catch (error) {
    console.error('Error in createSampleAdmins:', error);
  }
};

// Function to create sample teachers
export const createSampleTeachers = async () => {
  try {
    console.log('Creating sample teachers...');
    
    for (const teacherData of sampleTeachers) {
      try {
        // Check if teacher already exists
        const existingTeacher = await TeacherService.getTeacherByEmail(teacherData.email);
        if (!existingTeacher) {
          await TeacherService.createTeacher(teacherData);
          console.log(`✅ Created teacher: ${teacherData.name}`);
        } else {
          console.log(`⚠️ Teacher already exists: ${teacherData.name}`);
        }
      } catch (error) {
        console.error(`❌ Error creating teacher ${teacherData.name}:`, error.message);
      }
    }
    
    console.log('Sample teachers creation completed!');
  } catch (error) {
    console.error('Error in createSampleTeachers:', error);
  }
};

// Function to create sample students
export const createSampleStudents = async () => {
  try {
    console.log('Creating sample students...');
    
    for (const studentData of sampleStudents) {
      try {
        // Check if student already exists
        const existingStudent = await StudentService.getStudentByEmail(studentData.email);
        if (!existingStudent) {
          await StudentService.createStudent(studentData);
          console.log(`✅ Created student: ${studentData.name}`);
        } else {
          console.log(`⚠️ Student already exists: ${studentData.name}`);
        }
      } catch (error) {
        console.error(`❌ Error creating student ${studentData.name}:`, error.message);
      }
    }
    
    console.log('Sample students creation completed!');
  } catch (error) {
    console.error('Error in createSampleStudents:', error);
  }
};

// Function to create sample attendance records
export const createSampleAttendance = async () => {
  try {
    console.log('Creating sample attendance records...');
    
    // Get all students first
    const students = await StudentService.getAllStudents();
    if (students.length === 0) {
      console.log('No students found. Creating students first...');
      await createSampleStudents();
      const newStudents = await StudentService.getAllStudents();
      if (newStudents.length === 0) {
        console.log('Still no students found. Skipping attendance creation.');
        return;
      }
    }
    
    // Create attendance for the last 5 days
    const today = new Date();
    for (let i = 0; i < 5; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      // Check if attendance already exists for this date
      const existingAttendance = await AttendanceService.getAttendanceByDate(dateString);
      if (existingAttendance.length > 0) {
        console.log(`⚠️ Attendance already exists for ${dateString}`);
        continue;
      }
      
      const attendanceRecords = students.map(student => {
        // Simulate realistic attendance patterns
        const rand = Math.random();
        let status = 'present';
        let timeIn = '';
        
        if (rand < 0.05) status = 'absent';
        else if (rand < 0.1) status = 'late';
        else if (rand < 0.15) status = 'excused';
        
        if (status !== 'absent') {
          const hour = status === 'late' ? 8 + Math.floor(Math.random() * 2) : 8;
          const minute = Math.floor(Math.random() * 60);
          timeIn = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        }
        
        return {
          studentId: student.id,
          studentName: student.name,
          studentEmail: student.email,
          grade: student.grade,
          date: dateString,
          status: status,
          timeIn: timeIn,
          timeOut: '',
          notes: status === 'late' ? 'Traffic delay' : status === 'excused' ? 'Doctor appointment' : '',
          markedBy: 'Admin System'
        };
      });
      
      try {
        const result = await AttendanceService.markBulkAttendance(attendanceRecords);
        console.log(`✅ Created attendance for ${dateString}: ${result.results.length} records`);
        if (result.errors.length > 0) {
          console.log(`⚠️ ${result.errors.length} errors occurred`);
        }
      } catch (error) {
        console.error(`❌ Error creating attendance for ${dateString}:`, error.message);
      }
    }
    
    console.log('Sample attendance creation completed!');
  } catch (error) {
    console.error('Error in createSampleAttendance:', error);
  }
};

// Function to initialize all sample data
export const initializeSampleData = async () => {
  console.log('🚀 Initializing sample data for ZIA School...');
  
  try {
    await createSampleAdmins();
    await createSampleTeachers();
    await createSampleStudents();
    await createSampleAttendance();
    
    console.log('🎉 Sample data initialization completed successfully!');
    console.log('\n📋 Test Credentials:');
    console.log('Admin Login:');
    console.log('  Email: admin@ziaschool.com');
    console.log('  Password: admin123');
    console.log('\nTeacher Login:');
    console.log('  Email: emily.teacher@ziaschool.com');
    console.log('  Password: teacher123');
    console.log('\nStudent Login:');
    console.log('  Email: alice.student@ziaschool.com');
    console.log('  Password: student123');
    
  } catch (error) {
    console.error('❌ Error during sample data initialization:', error);
  }
};
