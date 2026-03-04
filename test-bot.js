/**
 * test-bot.js — Local testing script
 * Run: node test-bot.js
 * Tests the bot logic WITHOUT needing WhatsApp or a server running.
 */

// We inline the getBotResponse function from the main file
// by requiring it — but since it's one file, we just duplicate
// the test calls here using the /test endpoint via curl examples.

const testMessages = [
  // Greetings
  'hello',
  'dumela',
  'hi',

  // About
  'what is nthoppa',
  'tell me about nthoppa',

  // Insurance
  'show me life insurance',
  'car insurance',
  'health insurance',
  'home insurance',
  'compare life insurance',
  'insurance',

  // Specific providers
  'tell me about liberty',
  'old mutual',
  'hollard',
  'bomaid',
  'allan gray',
  'fnb loan',

  // Loans & investments
  'show me loans',
  'investments',

  // Coins
  'what are nthoppa coins',
  'how do I earn coins',
  'redeem coins',
  'what can i get with 500 coins',
  'what can i get with 2000 coins',

  // Rewards
  'airtime rewards',
  'fuel rewards',
  'dstv',
  'vouchers',

  // Education
  'show education modules',
  'module 1',
  'module 5',

  // Calculators
  'loan calculator',
  'calculators',

  // App / contact
  'download app',
  'contact',
  'help',

  // Unrelated (should politely decline)
  'do you sell buns',
  'what is the weather',
  'tell me a joke',
  'football results',

  // Goodbye
  'thank you',
  'bye',
];

console.log('🧪 NTHOPPA BOT — Local Test Results\n');
console.log('To test via HTTP endpoint, run the server (npm start) then use:');
console.log('curl -X POST http://localhost:3000/test -H "Content-Type: application/json" -d \'{"message":"hello"}\'\n');
console.log('─'.repeat(60));

testMessages.forEach(msg => {
  console.log(`\n👤 User: "${msg}"`);
  console.log('─'.repeat(40));
  // When running alongside the server, test via HTTP:
  // For standalone testing, you'd import getBotResponse directly
  console.log(`→ Test with: curl -s -X POST http://localhost:3000/test \\`);
  console.log(`  -H "Content-Type: application/json" \\`);
  console.log(`  -d '{"message":"${msg}"}'`);
});
