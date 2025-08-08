// Use environment variables with fallbacks
const hostApi = import.meta.env.VITE_API_HOST || (import.meta.env.MODE === "development"
  ? "http://localhost"
  : "https://sing-generator-node.herokuapp.com");
const portApi = import.meta.env.VITE_API_PORT || (import.meta.env.MODE === "development" ? 8080 : "");
const baseURLApi = import.meta.env.VITE_API_BASE_URL || `${hostApi}${portApi ? `:${portApi}` : ``}/api`;
const redirectUrl = import.meta.env.VITE_APP_URL || (import.meta.env.MODE === "development" ? "http://localhost:3000" : "https://flatlogic.github.io/react-material-admin-full");

// Debug logging for Vite migration (only in development)
if (import.meta.env.VITE_DEBUG === 'true' || import.meta.env.MODE === 'development') {
  console.log('🔧 Config Debug Info:', {
    mode: import.meta.env.MODE,
    viteBackend: import.meta.env.VITE_BACKEND,
    hostApi,
    portApi,
    baseURLApi,
    redirectUrl,
    isBackend: import.meta.env.VITE_BACKEND === 'true'
  });
}

export default {
  hostApi,
  portApi,
  baseURLApi,
  redirectUrl,
  remote: "https://sing-generator-node.herokuapp.com",
  isBackend: import.meta.env.VITE_BACKEND === 'true',
  debug: import.meta.env.VITE_DEBUG === 'true',
  auth: {
    email: import.meta.env.VITE_AUTH_EMAIL || 'admin@flatlogic.com',
    password: import.meta.env.VITE_AUTH_PASSWORD || 'password',
  },
  app: {
    name: import.meta.env.VITE_APP_NAME || 'React Material Admin',
    version: import.meta.env.VITE_APP_VERSION || '2.4.1',
    colors: {
      dark: '#002B49',
      light: '#FFFFFF',
      sea: '#004472',
      sky: '#E9EBEF',
      wave: '#D1E7F6',
      rain: '#CCDDE9',
      middle: '#D7DFE6',
      black: '#13191D',
      salat: '#21AE8C',
    },
  },
};
