// Polyfills for Node.js modules in browser environment
import { Buffer } from 'buffer';
import process from 'process';

// Make them available globally
window.global = window.globalThis;
window.Buffer = Buffer;
window.process = process;

// Ensure process.env exists
if (!window.process.env) {
  window.process.env = {};
}

export { Buffer, process };
