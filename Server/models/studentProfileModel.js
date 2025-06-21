import db from '../config/database.js';

class StudentProfile {
  // Get all student profiles
  static async getAll() {
    try {
      const [rows] = await db.query('SELECT * FROM student_profiles');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get student profile by ID
  static async getById(id) {
    try {
      const [rows] = await db.query('SELECT * FROM student_profiles WHERE id = ?', [id]);
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Get student profile by user ID
  static async getByUserId(userId) {
    try {
      const [rows] = await db.query('SELECT * FROM student_profiles WHERE user_id = ?', [userId]);
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Create new student profile
  static async create({ 
    user_id, phone = null, address = null, school_name = null, 
    class: className = null, profile_picture = null, guardian_name = null, 
    guardian_contact = null, date_of_birth = null, gender = null, 
    referral_code = null, referred_by_user_id = null, referred_by_role = null 
  }) {
    try {
      // Validate required fields
      if (!user_id) {
        throw new Error('User ID is required');
      }

      // Validate gender if provided
      if (gender && !['male', 'female', 'other'].includes(gender)) {
        throw new Error('Gender must be male, female, or other');
      }

      // Validate referred_by_role if provided
      if (referred_by_role && !['student', 'teacher', 'admin'].includes(referred_by_role)) {
        throw new Error('Referred by role must be student, teacher, or admin');
      }

      const [result] = await db.query(
        `INSERT INTO student_profiles (
          user_id, phone, address, school_name, class, profile_picture, 
          guardian_name, guardian_contact, date_of_birth, gender, 
          referral_code, referred_by_user_id, referred_by_role
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          user_id, phone, address, school_name, className, profile_picture,
          guardian_name, guardian_contact, date_of_birth, gender,
          referral_code, referred_by_user_id, referred_by_role
        ]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Update student profile
  static async update(id, { 
    phone, address, school_name, class: className, profile_picture,
    guardian_name, guardian_contact, date_of_birth, gender,
    referral_code, referred_by_user_id, referred_by_role 
  }) {
    try {
      // Build dynamic query based on provided fields
      const updates = [];
      const values = [];

      if (phone !== undefined) {
        updates.push('phone = ?');
        values.push(phone);
      }
      
      if (address !== undefined) {
        updates.push('address = ?');
        values.push(address);
      }
      
      if (school_name !== undefined) {
        updates.push('school_name = ?');
        values.push(school_name);
      }
      
      if (className !== undefined) {
        updates.push('class = ?');
        values.push(className);
      }
      
      if (profile_picture !== undefined) {
        updates.push('profile_picture = ?');
        values.push(profile_picture);
      }
      
      if (guardian_name !== undefined) {
        updates.push('guardian_name = ?');
        values.push(guardian_name);
      }
      
      if (guardian_contact !== undefined) {
        updates.push('guardian_contact = ?');
        values.push(guardian_contact);
      }
      
      if (date_of_birth !== undefined) {
        updates.push('date_of_birth = ?');
        values.push(date_of_birth);
      }
      
      if (gender !== undefined) {
        // Validate gender
        if (gender && !['male', 'female', 'other'].includes(gender)) {
          throw new Error('Gender must be male, female, or other');
        }
        updates.push('gender = ?');
        values.push(gender);
      }
      
      if (referral_code !== undefined) {
        updates.push('referral_code = ?');
        values.push(referral_code);
      }
      
      if (referred_by_user_id !== undefined) {
        updates.push('referred_by_user_id = ?');
        values.push(referred_by_user_id);
      }
      
      if (referred_by_role !== undefined) {
        // Validate referred_by_role
        if (referred_by_role && !['student', 'teacher', 'admin'].includes(referred_by_role)) {
          throw new Error('Referred by role must be student, teacher, or admin');
        }
        updates.push('referred_by_role = ?');
        values.push(referred_by_role);
      }

      if (updates.length === 0) {
        throw new Error('No fields to update');
      }

      values.push(id);
      
      const [result] = await db.query(
        `UPDATE student_profiles SET ${updates.join(', ')} WHERE id = ?`,
        values
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Delete student profile
  static async delete(id) {
    try {
      const [result] = await db.query('DELETE FROM student_profiles WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Get student profile by referral code
  static async getByReferralCode(referralCode) {
    try {
      const [rows] = await db.query('SELECT * FROM student_profiles WHERE referral_code = ?', [referralCode]);
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }
}

export default StudentProfile;