const bcrypt = require('bcryptjs');

async function seed(connection) {
  try {
    // Insert admin user
    const hashedPassword = await bcrypt.hash('adminpass', 10);
    await connection.query(`
      INSERT INTO users (name, email, password, role) 
      VALUES (?, ?, ?, ?)
    `, ['Admin', 'admin@sikaunemitra.com', hashedPassword, 'admin']);

    // Insert courses
    await connection.query(`
      INSERT INTO courses (title, description, price, category, duration, level, status, created_by)
      VALUES 
        (?, ?, ?, ?, ?, ?, ?, ?),
        (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      'Introduction to Nepali', 'Learn basic Nepali language and culture', 29.99, 'Language', '4 weeks', 'Beginner', 'published', 1,
      'Advanced Mathematics', 'Advanced math concepts for high school students', 49.99, 'Mathematics', '8 weeks', 'Advanced', 'published', 1
    ]);

    // Insert notes
    await connection.query(`
      INSERT INTO notes (title, content, category, grade, subject, price, pinned, available, created_by)
      VALUES 
        (?, ?, ?, ?, ?, ?, ?, ?, ?),
        (?, ?, ?, ?, ?, ?, ?, ?, ?),
        (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      'Nepali Grammar Basics', 'Full guide to basic Nepali grammar rules', 'Study Material', 'Grade 8', 'Nepali', 9.99, true, true, 1,
      'Mathematics Formula Sheet', 'Comprehensive formula sheet for high school mathematics', 'Study Material', 'Grade 10', 'Mathematics', 4.99, true, true, 1,
      'Science Lab Notes', 'Notes for science laboratory experiments', 'Lab Notes', 'Grade 9', 'Science', 7.99, false, true, 1
    ]);

    // Insert note topics
    await connection.query(`
      INSERT INTO note_topics (note_id, topic)
      VALUES 
        (1, 'Verbs'), (1, 'Nouns'), (1, 'Sentence Structure'),
        (2, 'Algebra'), (2, 'Geometry'), (2, 'Calculus'),
        (3, 'Chemistry'), (3, 'Physics')
    `);

    // Insert blogs
    await connection.query(`
      INSERT INTO blogs (title, content, featured_image, status, author_id)
      VALUES
        (?, ?, ?, ?, ?),
        (?, ?, ?, ?, ?)
    `, [
      'Getting Started with Nepali Language', 'Learn the basics of Nepali language and start your language journey...', '/uploads/blog-nepali.jpg', 'published', 1,
      'Mastering Advanced Mathematics', 'Tips and tricks to master advanced mathematical concepts...', '/uploads/blog-math.jpg', 'published', 1
    ]);

    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Seeding failed:', error);
    throw error;
  }
}

module.exports = { seed };