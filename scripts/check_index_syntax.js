const fs = require('fs');
const path = require('path');

try {
  const htmlPath = path.join(__dirname, '../index.html');
  const html = fs.readFileSync(htmlPath, 'utf8');

  // Find the last <script> tag in the body
  const scriptRegex = /<script>([\s\S]*?)<\/script>\s*<\/body>/i;
  const match = html.match(scriptRegex);

  if (!match) {
    console.error('❌ Could not find <script> tag before </body>');
    process.exit(1);
  }

  let jsCode = match[1];

  // We need to mock window, document, localStorage, location, history, AbortController, fetch, etc.
  const mockCode = `
    const window = {
      location: { origin: 'http://localhost', pathname: '/' },
      addEventListener: () => {},
      scrollTo: () => {},
      supabase: null
    };
    const document = {
      getElementById: (id) => ({
        classList: { add: () => {}, remove: () => {}, toggle: () => {} },
        style: {},
        addEventListener: () => {},
        setAttribute: () => {},
        removeAttribute: () => {},
        appendChild: () => {},
        value: '',
        textContent: '',
        innerHTML: ''
      }),
      querySelectorAll: () => [],
      querySelector: () => null,
      createElement: () => ({ style: {} }),
      body: { appendChild: () => {} }
    };
    const localStorage = {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {}
    };
    const location = { hash: '', origin: 'http://localhost', pathname: '/' };
    const history = { replaceState: () => {} };
    class AbortController {
      constructor() { this.signal = {}; }
      abort() {}
    }
    const fetch = () => Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
    const alert = () => {};
    const PromiseAll = Promise.all;
  `;

  // Write a temp file combining mocks and actual js
  const tempJsPath = path.join(__dirname, 'temp_index_script.js');
  fs.writeFileSync(tempJsPath, mockCode + '\n' + jsCode, 'utf8');

  console.log('📝 Created temporary script file for syntax check.');

  // Try to require the temp file to check for syntax errors
  try {
    require(tempJsPath);
    console.log('✅ Syntax Check PASSED! No syntax errors found in JavaScript.');
  } catch (err) {
    console.error('❌ Syntax or Execution Error found:');
    console.error(err);
  } finally {
    // Cleanup
    if (fs.existsSync(tempJsPath)) {
      fs.unlinkSync(tempJsPath);
    }
  }

} catch (err) {
  console.error('Error running check:', err);
}
