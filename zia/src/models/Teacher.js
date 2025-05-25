import { collection, addDoc, doc, getDoc, getDocs, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '../firebase';

// Teacher Model Class
export class Teacher {
  constructor(name, email, password, phone = '', subject = '', qualification = '') {
    this.name = name;
    this.email = email;
    this.password = password;
    this.phone = phone;
    this.subject = subject;
    this.qualification = qualification;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.role = 'teacher';
    this.isActive = true;
  }

  // Convert teacher instance to plain object for Firestore
  toFirestore() {
    return {
      name: this.name,
      email: this.email,
      password: this.password, // Note: In production, hash this password!
      phone: this.phone,
      subject: this.subject,
      qualification: this.qualification,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      role: this.role,
      isActive: this.isActive
    };
  }

  // Create teacher instance from Firestore data
  static fromFirestore(doc) {
    const data = doc.data();
    const teacher = new Teacher(
      data.name, 
      data.email, 
      data.password, 
      data.phone, 
      data.subject, 
      data.qualification
    );
    teacher.id = doc.id;
    teacher.createdAt = data.createdAt?.toDate() || new Date();
    teacher.updatedAt = data.updatedAt?.toDate() || new Date();
    teacher.role = data.role;
    teacher.isActive = data.isActive;
    return teacher;
  }

  // Validation method
  validate() {
    const errors = [];
    
    if (!this.name || this.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }
    
    if (!this.email || !this.isValidEmail(this.email)) {
      errors.push('Please provide a valid email address');
    }
    
    if (!this.password || this.password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }
    
    if (this.phone && !this.isValidPhone(this.phone)) {
      errors.push('Please provide a valid phone number');
    }
    
    return errors;
  }

  // Email validation helper
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Phone validation helper
  isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  }
}

// Teacher Service Class for database operations
export class TeacherService {
  static collectionName = 'teachers';

  // Create a new teacher
  static async createTeacher(teacherData) {
    try {
      const teacher = new Teacher(
        teacherData.name,
        teacherData.email,
        teacherData.password,
        teacherData.phone,
        teacherData.subject,
        teacherData.qualification
      );

      // Validate teacher data
      const validationErrors = teacher.validate();
      if (validationErrors.length > 0) {
        throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
      }

      // Check if email already exists
      const existingTeacher = await this.getTeacherByEmail(teacherData.email);
      if (existingTeacher) {
        throw new Error('A teacher with this email already exists');
      }

      // Add teacher to Firestore
      const docRef = await addDoc(collection(db, this.collectionName), teacher.toFirestore());
      
      teacher.id = docRef.id;
      console.log('Teacher created successfully with ID:', docRef.id);
      
      return teacher;
    } catch (error) {
      console.error('Error creating teacher:', error);
      throw error;
    }
  }

  // Get teacher by email
  static async getTeacherByEmail(email) {
    try {
      const q = query(
        collection(db, this.collectionName), 
        where('email', '==', email)
      );
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return Teacher.fromFirestore(doc);
      }
      
      return null;
    } catch (error) {
      console.error('Error getting teacher by email:', error);
      throw error;
    }
  }

  // Authenticate teacher (basic login)
  static async authenticateTeacher(email, password) {
    try {
      const teacher = await this.getTeacherByEmail(email);
      
      if (!teacher) {
        throw new Error('Teacher not found');
      }
      
      if (!teacher.isActive) {
        throw new Error('Teacher account is disabled');
      }
      
      // Note: In production, use proper password hashing (bcrypt, etc.)
      if (teacher.password !== password) {
        throw new Error('Invalid password');
      }
      
      console.log('Teacher authenticated successfully');
      return teacher;
    } catch (error) {
      console.error('Error authenticating teacher:', error);
      throw error;
    }
  }

  // Get all teachers
  static async getAllTeachers() {
    try {
      const querySnapshot = await getDocs(collection(db, this.collectionName));
      const teachers = [];
      
      querySnapshot.forEach((doc) => {
        teachers.push(Teacher.fromFirestore(doc));
      });
      
      return teachers;
    } catch (error) {
      console.error('Error getting all teachers:', error);
      throw error;
    }
  }
}
