import dotenv from 'dotenv';
import path from 'path';

// Load .env from the api directory first, then the workspace root as fallback.
// This file must be imported before any module that reads process.env at module eval.
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
