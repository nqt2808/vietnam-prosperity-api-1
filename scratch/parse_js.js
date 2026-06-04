const fs = require('fs');
const content = fs.readFileSync('d:\\Du-an\\website-vpc\\index.html', 'utf8');

// Find the script tag containing the main logic
const scriptStartIdx = content.indexOf('<script>');
const scriptEndIdx = content.lastIndexOf('</script>');

if (scriptStartIdx === -1 || scriptEndIdx === -1) {
  console.error("Could not find script block");
  process.exit(1);
}

const jsCode = content.substring(scriptStartIdx + 8, scriptEndIdx);

// Try to parse the JS code using standard V8 parser (vm module)
const vm = require('vm');
try {
  new vm.Script(jsCode);
  console.log("✅ Javascript compiles successfully! No syntax errors.");
} catch (err) {
  console.error("❌ Javascript Syntax Error found:");
  console.error(err.message);
  console.error(err.stack);
}
