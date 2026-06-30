export const API_BASE_URL = import.meta.env.VITE_API_URL;
if (!API_BASE_URL) throw new Error('VITE_API_URL environment variable is not set');
export const API_URL = `${API_BASE_URL}/api`;
export const APP_ENV = import.meta.env.MODE;
