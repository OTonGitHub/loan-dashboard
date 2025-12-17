const raw = import.meta.env.VITE_API_BASE;
export const API_BASE = (raw ? raw : 'http://localhost:3000/api/v1').replace(
  /\/$/,
  ''
);
