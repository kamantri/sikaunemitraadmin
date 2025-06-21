// /**
//  * API Routes Reference
//  * This file serves as documentation for all available API endpoints
//  */

// const routes = {
//   // User Routes
//   users: {
//     getAllUsers: '/api/users/all_users',
//     getUserById: '/api/users/:id',
//     createUser: '/api/users/create_user',
//     updateUser: '/api/users/user/:id',  // Fixed: added slash before id
//     deleteUser: '/api/users/user/:id',
//     login: '/api/users/login',
//     register: '/api/users/register',
//     profile: '/api/users/profile'
//   },
  
//   // Blog Routes
//   blogs: {
//     getAllBlogs: '/api/blogs',
//     getBlogById: '/api/blogs/:id',
//     createBlog: '/api/blogs',
//     updateBlog: '/api/blogs/:id',
//     deleteBlog: '/api/blogs/:id',
//     getByCategory: '/api/blogs/category/:category',
//     getByAuthor: '/api/blogs/author/:authorId',
//     getComments: '/api/blogs/:id/comments'
//   },
  
//   // Review Routes
//   reviews: {
//     getAllReviews: '/api/reviews',
//     getReviewById: '/api/reviews/:id',
//     createReview: '/api/reviews',
//     updateReview: '/api/reviews/:id',
//     deleteReview: '/api/reviews/:id',
//     getByRating: '/api/reviews/rating/:rating',
//     getByUser: '/api/reviews/user/:userId'
//   },
  
//   // Offer Routes
//   offers: {
//     getAllOffers: '/api/offers',
//     getOfferById: '/api/offers/:id',
//     createOffer: '/api/offers',
//     updateOffer: '/api/offers/:id',
//     deleteOffer: '/api/offers/:id',
//     getActiveOffers: '/api/offers/active'
//   },
  
//   // Admin Routes
//   admin: {
//     dashboard: '/api/admin/dashboard',
//     getAllAdmins: '/api/admin/admins',
//     createAdmin: '/api/admin/admins',
//     updateAdmin: '/api/admin/admins/:id',
//     deleteAdmin: '/api/admin/admins/:id',
//     stats: '/api/admin/stats',
//     users: '/api/admin/users',
//     blogs: '/api/admin/blogs',
//     reviews: '/api/admin/reviews',
//     offers: '/api/admin/offers'
//   },
  
//   // Course Routes
//   courses: {
//     getAllCourses: '/api/courses',
//     getCourseById: '/api/courses/:id',
//     createCourse: '/api/courses',
//     updateCourse: '/api/courses/:id',
//     deleteCourse: '/api/courses/:id',
//     getByCategory: '/api/courses/category/:category',
//     getByTeacher: '/api/courses/teacher/:teacherId',
//     getMaterials: '/api/courses/:id/materials'
//   },
  
//   // Student Routes
//   students: {
//     getAllStudents: '/api/students',
//     getStudentById: '/api/students/:id',
//     createStudent: '/api/students',
//     updateStudent: '/api/students/:id',
//     deleteStudent: '/api/students/:id',
//     getProfile: '/api/students/:id/profile',
//     getCourses: '/api/students/:id/courses',
//     getReviews: '/api/students/:id/reviews'
//   },
  
//   // Teacher Routes
//   teachers: {
//     getAllTeachers: '/api/teachers',
//     getTeacherById: '/api/teachers/:id',
//     createTeacher: '/api/teachers',
//     updateTeacher: '/api/teachers/:id',
//     deleteTeacher: '/api/teachers/:id',
//     getProfile: '/api/teachers/:id/profile',
//     getCourses: '/api/teachers/:id/courses',
//     getReviews: '/api/teachers/:id/reviews',
//     getExperience: '/api/teachers/:id/experience',
//     getQualifications: '/api/teachers/:id/qualifications'
//   },
  
//   // Note Routes
//   notes: {
//     getAllNotes: '/api/notes',
//     getNoteById: '/api/notes/:id',
//     createNote: '/api/notes',
//     updateNote: '/api/notes/:id',
//     deleteNote: '/api/notes/:id',
//     getBySubject: '/api/notes/subject/:subject',
//     getByCategory: '/api/notes/category/:category',
//     getPinned: '/api/notes/pinned'
//   }
// };

// export default routes;