// Vercel function: routes /api/* to the shared AI handler.
export { default } from '../server/ai.js';
export const config = { maxDuration: 60 };
