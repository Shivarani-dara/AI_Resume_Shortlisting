import { createRequire } from 'module';

// Use createRequire to load the library's internal implementation directly
// This bypasses the package entrypoint which in some older versions runs a test
const require = createRequire(import.meta.url);
const Pdf = require('pdf-parse/lib/pdf-parse.js');

export default Pdf;
