/**
 * ============================================================
 * NTHOPPA WHATSAPP CHATBOT — Twilio Version
 * Financial Wellness Platform - Botswana
 * ============================================================
 * Much simpler than Meta API!
 * Twilio handles all the WhatsApp complexity for you.
 * ============================================================
 */

require('dotenv').config();
const express = require('express');
const twilio = require('twilio');

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const PORT = process.env.PORT || 3000;

// ============================================================
// KNOWLEDGE BASE
// ============================================================
const kb = {
  company: {
    name: 'Nthoppa',
    contact: '+267 123 4567',
    email: 'info@nthoppa.co.bw',
    website: 'www.nthoppa.co.bw',
  },

  lifeInsurance: [
    { name: 'Liberty Life Cover',    provider: 'Liberty Life Botswana',       price: 'BWP 150/month', features: 'Death benefit, disability, critical illness', rating: '4.5 ⭐' },
    { name: 'Old Mutual Life Plan',  provider: 'Old Mutual Botswana',          price: 'BWP 200/month', features: 'Life cover, investment growth, tax benefits',  rating: '4.3 ⭐' },
    { name: 'BIC Life Assurance',    provider: 'Botswana Insurance Company',   price: 'BWP 100/month', features: 'Basic life cover, funeral benefit',             rating: '4.1 ⭐' },
  ],
  carInsurance: [
    { name: 'Hollard Comprehensive', provider: 'Hollard Insurance Botswana',   price: 'BWP 300/month', features: 'Accident, theft, third party, roadside assist', rating: '4.4 ⭐' },
    { name: 'Guardrisk Motor',       provider: 'Guardrisk Insurance',          price: 'BWP 250/month', features: 'Comprehensive, fire & theft, quick claims',      rating: '4.2 ⭐' },
    { name: 'Metropolitan Motor',    provider: 'Metropolitan Life Botswana',   price: 'BWP 280/month', features: 'Full comprehensive, flexible payments, 24/7',    rating: '4.0 ⭐' },
  ],
  healthInsurance: [
    { name: 'BOMAID Health Plan',     provider: 'Botswana Medical Aid Society', price: 'BWP 400/month', features: 'Hospital, specialist, chronic meds, emergency', rating: '4.1 ⭐' },
    { name: 'Metropolitan Health',    provider: 'Metropolitan Health',          price: 'BWP 350/month', features: 'Medical expenses, wellness, preventive care',    rating: '3.9 ⭐' },
  ],
  homeInsurance: [
    { name: 'First Capital Home',    provider: 'First Capital Insurance',      price: 'BWP 200/month', features: 'Building, contents, liability cover',           rating: '4.2 ⭐' },
    { name: 'BIC Household',         provider: 'Botswana Insurance Company',   price: 'BWP 150/month', features: 'Fire & theft, natural disasters, contents',     rating: '4.0 ⭐' },
  ],
  investments: [
    { name: 'Allan Gray Balanced Fund', provider: 'Allan Gray Botswana', price: 'BWP 500/month',   features: 'Diversified, professionally managed, long-term', rating: '4.6 ⭐' },
    { name: 'Investec Money Market',    provider: 'Investec Botswana',   price: 'BWP 1,000/month', features: 'Capital protection, high liquidity, good returns', rating: '4.3 ⭐' },
  ],
  loans: [
    { name: 'FNB Personal Loan',      provider: 'First National Bank',     price: 'From BWP 500/month',   max: 'BWP 200,000', features: 'Quick approval, flexible terms', rating: '4.2 ⭐' },
    { name: 'Standard Bank Loan',     provider: 'Standard Bank Botswana', price: 'From BWP 1,000/month', max: 'BWP 300,000', features: 'No hidden fees, quick processing', rating: '4.0 ⭐' },
  ],

  coins: {
    earn: [
      '📚 Complete education modules: *25 coins* each',
      '🧠 Take quizzes: *10 coins* each',
      '👤 Complete your profile: *10 coins*',
      '📅 Daily login: *2 coins*',
      '👥 Refer a friend: *20 coins*',
    ],
    rewards: {
      airtime:  [{ item: 'BWP 50 Airtime', coins: 500 }, { item: 'BWP 100 Airtime', coins: 950 }, { item: 'BWP 200 Airtime', coins: 1800 }],
      vouchers: [{ item: 'BWP 200 Voucher', coins: 2000 }, { item: 'BWP 500 Voucher', coins: 4500 }, { item: 'BWP 1,000 Voucher', coins: 8500 }],
      fuel:     [{ item: 'BWP 100 Fuel', coins: 1000 }, { item: 'BWP 250 Fuel', coins: 2400 }, { item: 'BWP 500 Fuel', coins: 4500 }],
      dstv:     [{ item: 'DStv Compact (1 month)', coins: 2000 }, { item: 'DStv Compact Plus', coins: 3000 }, { item: 'DStv Premium', coins: 5000 }],
    },
  },

  education: [
    'Module 1: Money 101 – Understanding the Basics',
    'Module 2: Why Financial Literacy Matters',
    'Module 3: Saving – Your Safety Net',
    'Module 4: Smart Budgeting',
    'Module 5: Understanding Credit and Debt',
    'Module 6: Basics of Investment',
    'Module 7: Financial Protection and Insurance',
    'Module 8: Planning for Retirement',
    'Module 9: Botswana Stock Exchange (BSE)',
  ],
};

// ============================================================
// HELPERS — Format product lists into readable messages
// ============================================================
function productList(title, items, isLoan = false) {
  const lines = items.map(p => {
    let t = `✅ *${p.name}* (${p.rating})\n   Provider: ${p.provider}\n   Price: ${p.price}`;
    if (isLoan) t += `\n   Max: ${p.max}`;
    t += `\n   ${p.features}`;
    return t;
  }).join('\n\n');
  return `${title}\n\n${lines}\n\n📲 Open the Nthoppa app to apply!`;
}

function rewardsByCoins(coins) {
  const all = [
    ...kb.coins.rewards.airtime.map(r => ({ ...r, cat: '📱 Airtime' })),
    ...kb.coins.rewards.vouchers.map(r => ({ ...r, cat: '🎟️ Voucher' })),
    ...kb.coins.rewards.fuel.map(r => ({ ...r, cat: '⛽ Fuel' })),
    ...kb.coins.rewards.dstv.map(r => ({ ...r, cat: '📺 DStv' })),
  ];
  const can = all.filter(r => r.coins <= coins);
  if (!can.length) return `🪙 With *${coins} coins* you can't redeem anything yet.\n\nLowest reward is *500 coins* (BWP 50 Airtime).\n\nType *earn coins* to learn how to earn more! 💪`;
  return `🎁 *With ${coins} coins you can get:*\n\n${can.map(r => `• ${r.cat}: ${r.item} (${r.coins} coins)`).join('\n')}\n\nType *redeem* to see the full catalogue 🛍️`;
}

// ============================================================
// UNRELATED TOPICS
// ============================================================
const offTopic = ['food','bread','buns','burger','pizza','restaurant','cook','recipe',
  'clothes','fashion','shoes','movie','music','sport','football','soccer','cricket',
  'weather','rain','politics','election','news','love','dating','joke','funny'];

// ============================================================
// MAIN BOT LOGIC
// ============================================================
function getReply(msg) {
  if (!msg || msg.trim().length < 2) {
    return `👋 Hello! I\'m the Nthoppa assistant.\nType *menu* to see what I can help with 😊`;
  }

  const m = msg.toLowerCase().trim();

  // Off-topic check
  if (offTopic.some(t => m.includes(t))) {
    return `🙏 I can only help with Nthoppa financial services.\n\nI can assist with:\n• 🛡️ Insurance\n• 💰 Loans & Investments\n• 🪙 Coins & Rewards\n• 📚 Financial Education\n\nWhat would you like to know?`;
  }

  // Coin amount: "what can I get with 1000 coins"
  const coinMatch = m.match(/(\d[\d,]*)\s*coins?/);
  if (coinMatch) return rewardsByCoins(parseInt(coinMatch[1].replace(',', '')));

  // Specific module: "module 3"
  const modMatch = m.match(/module\s*(\d+)/);
  if (modMatch) {
    const n = parseInt(modMatch[1]);
    if (n >= 1 && n <= kb.education.length) {
      return `📚 *${kb.education[n - 1]}*\n\nAvailable in the Nthoppa app.\nEarn *25 coins* for completing it + *10 coins* for the quiz!\n\n📲 play.google.com/store/nthoppa`;
    }
  }

  // Specific providers
  if (m.includes('liberty'))      return productList('🛡️ Liberty Life Cover', [kb.lifeInsurance[0]]);
  if (m.includes('old mutual'))   return productList('🛡️ Old Mutual Life Plan', [kb.lifeInsurance[1]]);
  if (m.includes('hollard'))      return productList('🚗 Hollard Insurance', [kb.carInsurance[0]]);
  if (m.includes('bomaid'))       return productList('🏥 BOMAID Health Plan', [kb.healthInsurance[0]]);
  if (m.includes('allan gray'))   return productList('📈 Allan Gray Fund', [kb.investments[0]]);
  if (m.includes('fnb') || m.includes('first national')) return productList('💰 FNB Loan', [kb.loans[0]], true);

  // --- FAQ matching ---

  // Greetings / Menu
  if (['hello','hi','hey','dumela','start','menu','help'].some(w => m.includes(w))) {
    return `👋 *Welcome to Nthoppa!*\nBotswana's financial wellness platform 🇧🇼\n\nI can help you with:\n1️⃣ Insurance (Life, Car, Health, Home)\n2️⃣ Loans & Investments\n3️⃣ Nthoppa Coins & Rewards\n4️⃣ Financial Education\n5️⃣ Calculators\n6️⃣ Contact & Support\n\nJust type what you need!\ne.g. *life insurance* or *earn coins*`;
  }

  // About
  if (m.includes('what is nthoppa') || m.includes('about nthoppa') || m.includes('who are you')) {
    return `🏦 *About Nthoppa*\n\nNthoppa is Botswana's financial wellness platform that helps you:\n\n✅ Compare & buy insurance\n✅ Find loans & investments\n✅ Earn coins for rewards\n✅ Learn financial skills\n✅ Use financial calculators\n\n📲 Download free at:\nplay.google.com/store/nthoppa`;
  }

  // Insurance categories
  if (m.includes('life insurance') || m.includes('life cover') || m.includes('life plan')) {
    return productList('🛡️ *Life Insurance Plans*', kb.lifeInsurance);
  }
  if (m.includes('car insurance') || m.includes('motor insurance') || m.includes('vehicle')) {
    return productList('🚗 *Car Insurance Plans*', kb.carInsurance);
  }
  if (m.includes('health insurance') || m.includes('medical aid') || m.includes('health cover')) {
    return productList('🏥 *Health Insurance Plans*', kb.healthInsurance);
  }
  if (m.includes('home insurance') || m.includes('household') || m.includes('house cover')) {
    return productList('🏠 *Home Insurance Plans*', kb.homeInsurance);
  }
  if (m.includes('insurance') || m.includes('compare insurance') || m.includes('cover')) {
    return `🛡️ *Insurance on Nthoppa*\n\nWe offer 4 types:\n\n1️⃣ *Life Insurance* — from BWP 100/month\n2️⃣ *Car Insurance* — from BWP 250/month\n3️⃣ *Health Insurance* — from BWP 350/month\n4️⃣ *Home Insurance* — from BWP 150/month\n\nType the one you want, e.g. *car insurance*`;
  }

  // Investments & Loans
  if (m.includes('invest') || m.includes('fund') || m.includes('grow money')) {
    return productList('📈 *Investment Options*', kb.investments) + `\n\n💡 Returns: Conservative 4–6%, Moderate 6–8%, Aggressive 8–12%`;
  }
  if (m.includes('loan') || m.includes('borrow') || m.includes('credit')) {
    return productList('💰 *Loan Options*', kb.loans, true);
  }

  // Coins — earn
  if (m.includes('earn coin') || m.includes('how to earn') || m.includes('get coins')) {
    return `🪙 *How to Earn Nthoppa Coins*\n\n${kb.coins.earn.join('\n')}\n\n💡 Complete all modules = up to *225 coins!*\n\nType *redeem coins* to see rewards 🎁`;
  }

  // Coins — redeem / rewards
  if (m.includes('redeem') || m.includes('rewards') || m.includes('use coins') || m.includes('spend coins')) {
    const r = kb.coins.rewards;
    return `🎁 *Nthoppa Rewards Catalogue*\n\n📱 *Airtime*\n${r.airtime.map(x => `• ${x.item} — *${x.coins} coins*`).join('\n')}\n\n🎟️ *Vouchers*\n${r.vouchers.map(x => `• ${x.item} — *${x.coins} coins*`).join('\n')}\n\n⛽ *Fuel*\n${r.fuel.map(x => `• ${x.item} — *${x.coins} coins*`).join('\n')}\n\n📺 *DStv*\n${r.dstv.map(x => `• ${x.item} — *${x.coins} coins*`).join('\n')}\n\nType *earn coins* to start earning 🪙`;
  }

  // Coins — what are they
  if (m.includes('coin') || m.includes('loyalty') || m.includes('points')) {
    return `🪙 *Nthoppa Coins*\n\nLoyalty points you earn by using the app!\n\n🏆 *Earn by:*\n${kb.coins.earn.join('\n')}\n\n🎁 *Redeem for:* Airtime, Vouchers, Fuel, DStv\n\nType *redeem* to see the full rewards list!`;
  }

  // Education
  if (m.includes('education') || m.includes('learn') || m.includes('module') || m.includes('course')) {
    return `📚 *Financial Education Modules*\n\n${kb.education.map((e, i) => `${i + 1}. ${e}`).join('\n')}\n\n🪙 Earn *25 coins* per module!\nType *module 1* (or any number) for details.`;
  }

  // Calculators
  if (m.includes('calculat')) {
    return `🔢 *Financial Calculators*\n\n1️⃣ *Loan Calculator* — Home 8–15%, Car 12–20%, Personal 15–25%\n2️⃣ *Savings Calculator* — 2–5% interest projections\n3️⃣ *Investment Calculator* — Conservative to Aggressive\n4️⃣ *Emergency Fund* — 3, 6, or 12 months planning\n\n📲 Open the Nthoppa app to use them!`;
  }

  // Download
  if (m.includes('download') || m.includes('app') || m.includes('install')) {
    return `📲 *Download Nthoppa — It\'s FREE!*\n\n🟢 Google Play:\nplay.google.com/store/nthoppa\n\n🍎 App Store:\napps.apple.com/nthoppa\n\nCreate your account and earn *10 coins* just for completing your profile! 🪙`;
  }

  // Contact
  if (m.includes('contact') || m.includes('speak') || m.includes('agent') || m.includes('human') || m.includes('call') || m.includes('email')) {
    return `📞 *Contact Nthoppa*\n\n📱 Phone: ${kb.company.contact}\n📧 Email: ${kb.company.email}\n🌐 Website: ${kb.company.website}\n\n⏰ Hours:\nMon–Fri: 8AM – 5PM\nSaturday: 9AM – 1PM`;
  }

  // Pricing
  if (m.includes('price') || m.includes('cost') || m.includes('how much') || m.includes('bwp')) {
    return `💵 *Nthoppa Pricing*\n\n🛡️ *Insurance (monthly):*\n• Life: from BWP 100\n• Car: from BWP 250\n• Health: from BWP 350\n• Home: from BWP 150\n\n💰 *Loans:* from BWP 500/month (up to BWP 300,000)\n📈 *Investments:* from BWP 500/month\n\nType the product name for full details!`;
  }

  // Goodbye
  if (['bye','goodbye','thanks','thank you','done','ok thanks'].some(w => m.includes(w))) {
    return `😊 *Thank you for chatting with Nthoppa!*\n\nWe hope we were helpful.\n\n💚 Stay financially well!\n\nType *hello* anytime to start again 👋`;
  }

  // Default fallback
  return `🤔 I didn\'t quite understand that.\n\nHere\'s what I can help with:\n\n• *insurance* — Life, Car, Health, Home\n• *loans* — Personal loan options\n• *investments* — Grow your money\n• *earn coins* — Loyalty rewards\n• *redeem* — Spend your coins\n• *education* — Financial modules\n• *contact* — Talk to our team\n\nType *menu* to see everything 😊`;
}

// ============================================================
// ROUTES
// ============================================================

/**
 * POST /webhook
 * Twilio sends incoming WhatsApp messages here.
 * We reply using TwiML (Twilio Markup Language).
 */
app.post('/webhook', (req, res) => {
  const userMessage = req.body.Body || '';
  const from = req.body.From || 'unknown';

  console.log(`📩 [${new Date().toISOString()}] From: ${from}`);
  console.log(`   Message: "${userMessage}"`);

  const reply = getReply(userMessage);

  console.log(`🤖 Reply: "${reply.substring(0, 80)}..."`);

  // Twilio expects a TwiML response
  const twiml = new twilio.twiml.MessagingResponse();
  twiml.message(reply);

  res.type('text/xml').send(twiml.toString());
});

/** GET /health — simple health check */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Nthoppa WhatsApp Bot (Twilio)', time: new Date().toISOString() });
});

/** POST /test — test bot logic without WhatsApp */
app.post('/test', (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Provide a "message" field.' });
  res.json({ you: message, nthoppa: getReply(message) });
});

// ============================================================
// START
// ============================================================
app.listen(PORT, () => {
  console.log('================================================');
  console.log('  🌿 NTHOPPA Twilio WhatsApp Bot — RUNNING');
  console.log('================================================');
  console.log(`  🔗 Webhook : POST http://localhost:${PORT}/webhook`);
  console.log(`  ❤️  Health  : GET  http://localhost:${PORT}/health`);
  console.log(`  🧪 Test    : POST http://localhost:${PORT}/test`);
  console.log('================================================');
});
