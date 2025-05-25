import { db } from '../firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy,
  Timestamp 
} from 'firebase/firestore';

// Attendance class definition
export class Attendance {
  constructor(data) {
    this.id = data.id || null;
    this.studentId = data.studentId || '';
    this.studentName = data.studentName || '';
    this.studentEmail = data.studentEmail || '';
    this.grade = data.grade || '';
    this.date = data.date || new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    this.status = data.status || 'present'; // present, absent, late, excused
    this.timeIn = data.timeIn || null;
    this.timeOut = data.timeOut || null;
    this.notes = data.notes || '';
    this.markedBy = data.markedBy || ''; // admin/teacher who marked attendance
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // Validation method
  validate() {
    const errors = [];
    
    if (!this.studentId || this.studentId.trim().length === 0) {
      errors.push('Student ID is required');
    }
    
    if (!this.studentName || this.studentName.trim().length === 0) {
      errors.push('Student name is required');
    }
    
    if (!this.date) {
      errors.push('Date is required');
    }
    
    if (!['present', 'absent', 'late', 'excused'].includes(this.status)) {
      errors.push('Invalid attendance status');
    }
    
    return errors;
  }
  
  // Convert to plain object for Firestore
  toFirestore() {
    return {
      studentId: this.studentId,
      studentName: this.studentName,
      studentEmail: this.studentEmail,
      grade: this.grade,
      date: this.date,
      status: this.status,
      timeIn: this.timeIn,
      timeOut: this.timeOut,
      notes: this.notes,
      markedBy: this.markedBy,
      createdAt: Timestamp.fromDate(this.createdAt),
      updatedAt: Timestamp.fromDate(new Date())
    };
  }
  
  // Create from Firestore document
  static fromFirestore(doc) {
    const data = doc.data();
    return new Attendance({
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date()
    });
  }
}

// Attendance service for database operations
export class AttendanceService {
  static collectionName = 'attendance';
  
  // Create a new attendance record
  static async createAttendance(attendanceData) {
    try {
      const attendance = new Attendance(attendanceData);
      const validationErrors = attendance.validate();
      
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }
      
      // Check if attendance already exists for this student and date
      const existingRecord = await this.getAttendanceByStudentAndDate(
        attendance.studentId, 
        attendance.date
      );
      
      if (existingRecord) {
        throw new Error('Attendance already marked for this student on this date');
      }
      
      const docRef = await addDoc(collection(db, this.collectionName), attendance.toFirestore());
      return { id: docRef.id, ...attendance };
    } catch (error) {
      console.error('Error creating attendance:', error);
      throw error;
    }
  }
  
  // Get all attendance records
  static async getAllAttendance() {
    try {
      const q = query(collection(db, this.collectionName), orderBy('date', 'desc'), orderBy('studentName'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => Attendance.fromFirestore(doc));
    } catch (error) {
      console.error('Error getting attendance:', error);
      throw error;
    }
  }
  
  // Get attendance by date
  static async getAttendanceByDate(date) {
    try {
      const q = query(
        collection(db, this.collectionName), 
        where('date', '==', date),
        orderBy('studentName')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => Attendance.fromFirestore(doc));
    } catch (error) {
      console.error('Error getting attendance by date:', error);
      throw error;
    }
  }
  
  // Get attendance by student ID
  static async getAttendanceByStudent(studentId) {
    try {
      const q = query(
        collection(db, this.collectionName), 
        where('studentId', '==', studentId),
        orderBy('date', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => Attendance.fromFirestore(doc));
    } catch (error) {
      console.error('Error getting attendance by student:', error);
      throw error;
    }
  }
  
  // Get attendance by student and date
  static async getAttendanceByStudentAndDate(studentId, date) {
    try {
      const q = query(
        collection(db, this.collectionName), 
        where('studentId', '==', studentId),
        where('date', '==', date)
      );
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        return Attendance.fromFirestore(querySnapshot.docs[0]);
      }
      return null;
    } catch (error) {
      console.error('Error getting attendance by student and date:', error);
      throw error;
    }
  }
  
  // Update attendance record
  static async updateAttendance(id, updates) {
    try {
      const docRef = doc(db, this.collectionName, id);
      const updateData = {
        ...updates,
        updatedAt: Timestamp.fromDate(new Date())
      };
      
      await updateDoc(docRef, updateData);
      return await this.getAttendanceById(id);
    } catch (error) {
      console.error('Error updating attendance:', error);
      throw error;
    }
  }
  
  // Get attendance by ID
  static async getAttendanceById(id) {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return Attendance.fromFirestore(docSnap);
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting attendance by ID:', error);
      throw error;
    }
  }
  
  // Delete attendance record
  static async deleteAttendance(id) {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error('Error deleting attendance:', error);
      throw error;
    }
  }
  
  // Mark bulk attendance for a date
  static async markBulkAttendance(attendanceList) {
    try {
      const results = [];
      const errors = [];
      
      for (const attendanceData of attendanceList) {
        try {
          const result = await this.createAttendance(attendanceData);
          results.push(result);
        } catch (error) {
          errors.push({
            student: attendanceData.studentName,
            error: error.message
          });
        }
      }
      
      return { results, errors };
    } catch (error) {
      console.error('Error marking bulk attendance:', error);
      throw error;
    }
  }
  
  // Get attendance statistics for a date range
  static async getAttendanceStats(startDate, endDate) {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('date', '>=', startDate),
        where('date', '<=', endDate)
      );
      const querySnapshot = await getDocs(q);
      const records = querySnapshot.docs.map(doc => Attendance.fromFirestore(doc));
      
      const stats = {
        total: records.length,
        present: records.filter(r => r.status === 'present').length,
        absent: records.filter(r => r.status === 'absent').length,
        late: records.filter(r => r.status === 'late').length,
        excused: records.filter(r => r.status === 'excused').length
      };
      
      stats.attendanceRate = stats.total > 0 ? 
        ((stats.present + stats.late + stats.excused) / stats.total * 100).toFixed(1) : 0;
      
      return stats;
    } catch (error) {
      console.error('Error getting attendance stats:', error);
      throw error;
    }
  }
  
  // Get attendance by grade and date
  static async getAttendanceByGradeAndDate(grade, date) {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('grade', '==', grade),
        where('date', '==', date),
        orderBy('studentName')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => Attendance.fromFirestore(doc));
    } catch (error) {
      console.error('Error getting attendance by grade and date:', error);
      throw error;
    }
  }
}

export default AttendanceService;
