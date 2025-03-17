import dotenv from 'dotenv';
dotenv.config();

export const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
export const GEMINI_API_URL  =  'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';