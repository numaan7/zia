import { collection, addDoc, doc, getDoc, getDocs, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '../firebase';

// Admin Model Class
export class Admin {
  constructor(name, email, password, phone = '') {
    this.name = name;
    this.email = email;
    this.password = password;
    this.phone = phone;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.role = 'admin';
    this.isActive = true;
  }

  // Convert admin instance to plain object for Firestore
  toFirestore() {
    return {
      name: this.name,
      email: this.email,
      password: this.password, // Note: In production, hash this password!
      phone: this.phone,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      role: this.role,
      isActive: this.isActive
    };
  }

  // Create admin instance from Firestore data
  static fromFirestore(doc) {
    const data = doc.data();
    const admin = new Admin(data.name, data.email, data.password, data.phone);
    admin.id = doc.id;
    admin.createdAt = data.createdAt?.toDate() || new Date();
    admin.updatedAt = data.updatedAt?.toDate() || new Date();
    admin.role = data.role;
    admin.isActive = data.isActive;
    return admin;
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

// Admin Service Class for database operations
export class AdminService {
  static collectionName = 'admins';

  // Create a new admin
  static async createAdmin(adminData) {
    try {
      const admin = new Admin(
        adminData.name,
        adminData.email,
        adminData.password,
        adminData.phone
      );

      // Validate admin data
      const validationErrors = admin.validate();
      if (validationErrors.length > 0) {
        throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
      }

      // Check if email already exists
      const existingAdmin = await this.getAdminByEmail(adminData.email);
      if (existingAdmin) {
        throw new Error('An admin with this email already exists');
      }

      // Add admin to Firestore
      const docRef = await addDoc(collection(db, this.collectionName), admin.toFirestore());
      
      admin.id = docRef.id;
      console.log('Admin created successfully with ID:', docRef.id);
      
      return admin;
    } catch (error) {
      console.error('Error creating admin:', error);
      throw error;
    }
  }

  // Get admin by ID
  static async getAdminById(adminId) {
    try {
      const docRef = doc(db, this.collectionName, adminId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return Admin.fromFirestore(docSnap);
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting admin:', error);
      throw error;
    }
  }

  // Get admin by email
  static async getAdminByEmail(email) {
    try {
      const q = query(
        collection(db, this.collectionName), 
        where('email', '==', email)
      );
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return Admin.fromFirestore(doc);
      }
      
      return null;
    } catch (error) {
      console.error('Error getting admin by email:', error);
      throw error;
    }
  }

  // Get all admins
  static async getAllAdmins() {
    try {
      const querySnapshot = await getDocs(collection(db, this.collectionName));
      const admins = [];
      
      querySnapshot.forEach((doc) => {
        admins.push(Admin.fromFirestore(doc));
      });
      
      return admins;
    } catch (error) {
      console.error('Error getting all admins:', error);
      throw error;
    }
  }

  // Update admin
  static async updateAdmin(adminId, updateData) {
    try {
      const docRef = doc(db, this.collectionName, adminId);
      
      // Add updatedAt timestamp
      updateData.updatedAt = new Date();
      
      await updateDoc(docRef, updateData);
      console.log('Admin updated successfully');
      
      // Return updated admin
      return await this.getAdminById(adminId);
    } catch (error) {
      console.error('Error updating admin:', error);
      throw error;
    }
  }

  // Delete admin
  static async deleteAdmin(adminId) {
    try {
      const docRef = doc(db, this.collectionName, adminId);
      await deleteDoc(docRef);
      console.log('Admin deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting admin:', error);
      throw error;
    }
  }

  // Authenticate admin (basic login)
  static async authenticateAdmin(email, password) {
    try {
      const admin = await this.getAdminByEmail(email);
      
      if (!admin) {
        throw new Error('Admin not found');
      }
      
      if (!admin.isActive) {
        throw new Error('Admin account is disabled');
      }
      
      // Note: In production, use proper password hashing (bcrypt, etc.)
      if (admin.password !== password) {
        throw new Error('Invalid password');
      }
      
      console.log('Admin authenticated successfully');
      return admin;
    } catch (error) {
      console.error('Error authenticating admin:', error);
      throw error;
    }
  }

  // Get active admins
  static async getActiveAdmins() {
    try {
      const q = query(
        collection(db, this.collectionName), 
        where('isActive', '==', true)
      );
      const querySnapshot = await getDocs(q);
      const admins = [];
      
      querySnapshot.forEach((doc) => {
        admins.push(Admin.fromFirestore(doc));
      });
      
      return admins;
    } catch (error) {
      console.error('Error getting active admins:', error);
      throw error;
    }
  }
}
