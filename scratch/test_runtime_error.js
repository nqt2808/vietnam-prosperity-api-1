const fs = require('fs');
const vm = require('vm');

const filePath = 'c:\\Users\\dell 7620\\Desktop\\index.html';
const content = fs.readFileSync(filePath, 'utf8');

// Extract JS content
const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let match;
let jsContent = '';
while ((match = scriptRegex.exec(content)) !== null) {
  jsContent += match[1] + '\n';
}

const mockDocument = {
  getElementById: (id) => {
    return {
      classList: {
        add: () => {},
        remove: () => {},
        toggle: () => {}
      },
      style: {},
      innerHTML: '',
      addEventListener: () => {},
      appendChild: () => {},
      reset: () => {},
      scrollIntoView: () => {}
    };
  },
  querySelectorAll: (selector) => {
    return {
      forEach: (fn) => {
        fn({
          classList: {
            add: () => {},
            remove: () => {}
          },
          style: {},
          innerHTML: ''
        });
      }
    };
  },
  querySelector: (selector) => {
    return {
      classList: {
        add: () => {},
        remove: () => {}
      },
      style: {}
    };
  },
  createElement: () => {
    return {
      style: {},
      classList: {
        add: () => {},
        remove: () => {}
      }
    };
  }
};

const sandbox = {
  document: mockDocument,
  window: {
    location: {
      hash: '',
      origin: 'http://localhost',
      pathname: '/'
    },
    scrollTo: () => {},
    open: () => {}
  },
  localStorage: {
    getItem: (key) => {
      if (key === 'vpc_cart') return '[]';
      return null;
    },
    setItem: () => {}
  },
  console: {
    log: (...args) => console.log('[Browser Console.log]', ...args),
    error: (...args) => console.error('[Browser Console.error]', ...args),
    warn: (...args) => console.warn('[Browser Console.warn]', ...args)
  },
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  Promise: Promise,
  // SIMULATE NETWORK ERROR
  fetch: () => Promise.reject(new Error("Network Error/CORS Blocked")),
  alert: (...args) => console.log('[Browser Alert]', ...args),
  Number: Number,
  String: String,
  JSON: JSON,
  Date: Date,
  Math: Math,
  Array: Array,
  Object: Object,
  RegExp: RegExp,
  Error: Error,
  TypeError: TypeError,
  ReferenceError: ReferenceError
};

sandbox.global = sandbox;
sandbox.window.global = sandbox;

try {
  vm.runInNewContext(jsContent, sandbox, { filename: 'index_mock.js' });
  console.log("Mock runtime with network error completed successfully.");
} catch (err) {
  console.error("Runtime exception caught under network error:");
  console.error(err.stack);
}
