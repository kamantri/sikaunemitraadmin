import db from '../config/database.js';

class TeacherProfile {
  // Get all teacher profiles
  static async getAll() {
    try {
      const [rows] = await db.query('SELECT * FROM teacher_profiles');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get teacher profile by ID
  static async getById(id) {
    try {
      const [rows] = await db.query('SELECT * FROM teacher_profiles WHERE id = ?', [id]);
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Get teacher profile by user ID
  static async getByUserId(userId) {
    try {
      const [rows] = await db.query('SELECT * FROM teacher_profiles WHERE user_id = ?', [userId]);
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Create new teacher profile
  static async create({ 
    user_id, phone = null, address = null, school_name = null, 
    subjects = null, years_of_experience = null, qualification = null, 
    available_time = null, profile_picture_url = null, referral_code = null, 
    referred_by_user_id = null, referred_by_role = 'admin'
  }) {
    try {
      // Validate required fields
      if (!user_id) {
        throw new Error('User ID is required');
      }

      // Validate referred_by_role if provided
      if (referred_by_role && !['teacher', 'student', 'admin'].includes(referred_by_role)) {
        throw new Error('Referred by role must be teacher, student, or admin');
      }

      const [result] = await db.query(
        `INSERT INTO teacher_profiles (
          user_id, phone, address, school_name, subjects, years_of_experience, 
          qualification, available_time, profile_picture_url, referral_code, 
          referred_by_user_id, referred_by_role
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          user_id, phone, address, school_name, subjects, years_of_experience,
          qualification, available_time, profile_picture_url, referral_code,
          referred_by_user_id, referred_by_role
        ]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Update teacher profile
  static async update(id, { 
    phone, address, school_name, subjects, years_of_experience,
    qualification, available_time, profile_picture_url, referral_code,
    referred_by_user_id, referred_by_role
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
      
      if (subjects !== undefined) {
        updates.push('subjects = ?');
        values.push(subjects);
      }
      
      if (years_of_experience !== undefined) {
        updates.push('years_of_experience = ?');
        values.push(years_of_experience);
      }
      
      if (qualification !== undefined) {
        updates.push('qualification = ?');
        values.push(qualification);
      }
      
      if (available_time !== undefined) {
        updates.push('available_time = ?');
        values.push(available_time);
      }
      
      if (profile_picture_url !== undefined) {
        updates.push('profile_picture_url = ?');
        values.push(profile_picture_url);
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
        if (referred_by_role && !['teacher', 'student', 'admin'].includes(referred_by_role)) {
          throw new Error('Referred by role must be teacher, student, or admin');
        }
        updates.push('referred_by_role = ?');
        values.push(referred_by_role);
      }

      if (updates.length === 0) {
        throw new Error('No fields to update');
      }

      values.push(id);
      
      const [result] = await db.query(
        `UPDATE teacher_profiles SET ${updates.join(', ')} WHERE id = ?`,
        values
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Delete teacher profile
  static async delete(id) {
    try {
      const [result] = await db.query('DELETE FROM teacher_profiles WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Get teacher profile by referral code
  static async getByReferralCode(referralCode) {
    try {
      const [rows] = await db.query('SELECT * FROM teacher_profiles WHERE referral_code = ?', [referralCode]);
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }
}

export default TeacherProfile;