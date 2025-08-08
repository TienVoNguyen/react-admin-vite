const hostApi = import.meta.env.MODE === "development"
  ? "http://localhost"
  : "https://sing-generator-node.herokuapp.com";
const portApi = import.meta.env.MODE === "development" ? 8080 : "";
const baseURLApi = `${hostApi}${portApi ? `:${portApi}` : ``}/api`;
const redirectUrl = import.meta.env.MODE === "development" ? "http://localhost:3000" : "https://flatlogic.github.io/react-material-admin-full";

// Debug logging for Vite migration
console.log('🔧 Config Debug Info:', {
  mode: import.meta.env.MODE,
  viteBackend: import.meta.env.VITE_BACKEND,
  hostApi,
  portApi,
  baseURLApi,
  isBackend: import.meta.env.VITE_BACKEND === 'true'
});

export default {
  hostApi,
  portApi,
  baseURLApi,
  redirectUrl,
  remote: "https://sing-generator-node.herokuapp.com",
  isBackend: import.meta.env.VITE_BACKEND === 'true',
  auth: {
    email: 'admin@flatlogic.com',
    password: 'password',
  },
  app: {
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
