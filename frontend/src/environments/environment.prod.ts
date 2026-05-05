export const environment = {
  production: true,
  // In production the reverse proxy (Nginx/Apache) forwards /api → backend
  // No hardcoded host/port — configure proxy on the server
  apiUrl: '/api'
};
