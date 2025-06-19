// test-integration.js
// Simple test runner for integration validation

const { runIntegrationTests, quickValidation } = require('./lib/calculations/integration-test.ts');

console.log('🚀 Running Integration Tests...\n');

// Run quick validation first
console.log('Quick Validation Check:');
const quickResult = quickValidation();
console.log(`✅ Quick validation: ${quickResult ? 'PASSED' : 'FAILED'}\n`);

// Run full integration tests
console.log('Full Integration Test Results:');
const results = runIntegrationTests();

console.log(`\n📊 Test Summary:`);
console.log(`✅ Passed: ${results.passed}`);
console.log(`❌ Failed: ${results.failed}`);
console.log(`📈 Success Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%\n`);

console.log('Detailed Results:');
results.results.forEach((result, index) => {
  const status = result.status === 'PASS' ? '✅' : '❌';
  console.log(`${index + 1}. ${status} ${result.test}: ${result.message}`);
});

console.log(`\n🎯 Integration Test Complete!`); 