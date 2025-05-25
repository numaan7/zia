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
  orderBy 
} from 'firebase/firestore';

// Student class definition
export class Student {
  constructor(data) {
    this.id = data.id || null;
    this.name = data.name || '';
    this.email = data.email || '';
    this.password = data.password || '';
    this.phone = data.phone || '';
    this.grade = data.grade || '';
    this.dateOfBirth = data.dateOfBirth || '';
    this.parentName = data.parentName || '';
    this.parentPhone = data.parentPhone || '';
    this.parentEmail = data.parentEmail || '';
    this.address = data.address || '';
    this.enrollmentDate = data.enrollmentDate || new Date().toISOString().split('T')[0];
    this.isActive = data.isActive !== undefined ? data.isActive : true;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // Validation method
  validate() {
    const errors = [];
    
    if (!this.name || this.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }
    
    if (!this.email || !this.isValidEmail(this.email)) {
      errors.push('Valid email is required');
    }
    
    if (!this.password || this.password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }
    
    if (!this.grade || this.grade.trim().length === 0) {
      errors.push('Grade is required');
    }
    
    if (!this.parentName || this.parentName.trim().length < 2) {
      errors.push('Parent name is required');
    }
    
    return errors;
  }
  
  // Email validation helper
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  // Convert to plain object for Firestore
  toFirestore() {
    return {
      name: this.name,
      email: this.email,
      password: this.password, // Note: In production, this should be hashed
      phone: this.phone,
      grade: this.grade,
      dateOfBirth: this.dateOfBirth,
      parentName: this.parentName,
      parentPhone: this.parentPhone,
      parentEmail: this.parentEmail,
      address: this.address,
      enrollmentDate: this.enrollmentDate,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: new Date()
    };
  }
  
  // Create from Firestore document
  static fromFirestore(doc) {
    const data = doc.data();
    return new Student({
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date()
    });
  }
}

// Student service for database operations
export class StudentService {
  static collectionName = 'students';
  
  // Create a new student
  static async createStudent(studentData) {
    try {
      const student = new Student(studentData);
      const validationErrors = student.validate();
      
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }
      
      // Check if email already exists
      const existingStudent = await this.getStudentByEmail(student.email);
      if (existingStudent) {
        throw new Error('A student with this email already exists');
      }
      
      const docRef = await addDoc(collection(db, this.collectionName), student.toFirestore());
      return { id: docRef.id, ...student };
    } catch (error) {
      console.error('Error creating student:', error);
      throw error;
    }
  }
  
  // Get all students
  static async getAllStudents() {
    try {
      const q = query(collection(db, this.collectionName), orderBy('name'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => Student.fromFirestore(doc));
    } catch (error) {
      console.error('Error getting students:', error);
      throw error;
    }
  }
  
  // Get student by ID
  static async getStudentById(id) {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return Student.fromFirestore(docSnap);
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting student:', error);
      throw error;
    }
  }
  
  // Get student by email
  static async getStudentByEmail(email) {
    try {
      const q = query(collection(db, this.collectionName), where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        return Student.fromFirestore(querySnapshot.docs[0]);
      }
      return null;
    } catch (error) {
      console.error('Error getting student by email:', error);
      throw error;
    }
  }
  
  // Update student
  static async updateStudent(id, updates) {
    try {
      const docRef = doc(db, this.collectionName, id);
      const updateData = {
        ...updates,
        updatedAt: new Date()
      };
      
      await updateDoc(docRef, updateData);
      return await this.getStudentById(id);
    } catch (error) {
      console.error('Error updating student:', error);
      throw error;
    }
  }
  
  // Delete student (soft delete by setting isActive to false)
  static async deleteStudent(id) {
    try {
      return await this.updateStudent(id, { isActive: false });
    } catch (error) {
      console.error('Error deleting student:', error);
      throw error;
    }
  }
  
  // Get students by grade
  static async getStudentsByGrade(grade) {
    try {
      const q = query(
        collection(db, this.collectionName), 
        where('grade', '==', grade),
        where('isActive', '==', true),
        orderBy('name')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => Student.fromFirestore(doc));
    } catch (error) {
      console.error('Error getting students by grade:', error);
      throw error;
    }
  }
  
  // Get active students count
  static async getActiveStudentsCount() {
    try {
      const q = query(collection(db, this.collectionName), where('isActive', '==', true));
      const querySnapshot = await getDocs(q);
      return querySnapshot.size;
    } catch (error) {
      console.error('Error getting active students count:', error);
      throw error;
    }
  }
  
  // Authenticate student (for login)
  static async authenticateStudent(email, password) {
    try {
      const student = await this.getStudentByEmail(email);
      if (student && student.password === password && student.isActive) {
        // Remove password from returned object for security
        const { password: _, ...studentData } = student;
        return studentData;
      }
      return null;
    } catch (error) {
      console.error('Error authenticating student:', error);
      throw error;
    }
  }
  
  // Search students by name
  static async searchStudentsByName(searchTerm) {
    try {
      const students = await this.getAllStudents();
      return students.filter(student => 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        student.isActive
      );
    } catch (error) {
      console.error('Error searching students:', error);
      throw error;
    }
  }
}

export default StudentService;
