export const API_CONFIG = {
  HOST_URL: 'http://localhost:5000',
  BASE_URL: '/api',
  AUTH: {
    ADMIN_LOGIN: '/auth/admin/login',  // This matches the backend route
    USER_LOGIN: '/auth/login',
    ADMIN_REGISTER: '/auth/admin/register',
    USER_REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    VERIFY_TOKEN: '/auth/verify'
  }, 
   ENDPOINTS: {
    USERS: {
      GET_ALL: '/auth/admin/all-users',
      GET_BY_ID: '/users/:id',
      CREATE: '/users',
      UPDATE: '/auth/admin/update-user/:id',
      DELETE: '/auth/admin/delete-user/:id',
    },
    ADMIN: '/admin',
    COURSES: '/courses',
    NOTES: '/notes'
  },
  ERROR_MESSAGES: {
    LOGIN_REQUIRED: 'Email and password are required',
    INVALID_CREDENTIALS: 'Invalid credentials',
    SERVER_ERROR: 'Server error occurred'
  }
};