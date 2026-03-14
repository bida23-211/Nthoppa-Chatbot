/**
 * ============================================================
 * NTHOPPA WHATSAPP CUSTOMER SERVICE CHATBOT — v2.0
 * Financial Wellness Platform - Botswana 🇧🇼
 * ============================================================
 * Powered by Twilio + Express (Node.js)
 * Hosted on Render.com for 24/7 uptime
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
// COMPANY INFO
// ============================================================
const COMPANY = {
  name: 'Nthoppa',
  tagline: 'Financial Wellness Platform — Botswana',
  phone: '+267 75 736 600',
  email: 'info@nthoppa.co.bw',
  website: 'https://www.nthoppa.com/',
  playStore: 'https://play.google.com/store/search?q=nthoppa&c=apps&hl=en',
  hours: 'Mon–Fri: 8AM–5PM | Sat: 9AM–1PM | Sun: Closed',
};
 
// ============================================================
// KNOWLEDGE BASE
// ============================================================
const KB = {
  lifeInsurance: [
    { name: 'Liberty Life Cover',   provider: 'Liberty Life Botswana',     price: 'BWP 150/month', features: 'Death benefit, disability cover, critical illness, premium waiver', rating: '4.5 ⭐' },
    { name: 'Old Mutual Life Plan', provider: 'Old Mutual Botswana',        price: 'BWP 200/month', features: 'Life cover, investment growth, tax benefits, loan facility',         rating: '4.3 ⭐' },
    { name: 'BIC Life Assurance',   provider: 'Botswana Insurance Company', price: 'BWP 100/month', features: 'Basic life cover, funeral benefit, family protection',               rating: '4.1 ⭐' },
  ],
  carInsurance: [
    { name: 'Hollard Comprehensive', provider: 'Hollard Insurance Botswana', price: 'BWP 300/month', features: 'Accident cover, theft protection, third party, roadside assistance', rating: '4.4 ⭐' },
    { name: 'Guardrisk Motor',       provider: 'Guardrisk Insurance',        price: 'BWP 250/month', features: 'Comprehensive, third party, fire & theft, quick claims',              rating: '4.2 ⭐' },
    { name: 'Metropolitan Motor',    provider: 'Metropolitan Life Botswana', price: 'BWP 280/month', features: 'Full comprehensive, flexible payments, 24/7 claims',                 rating: '4.0 ⭐' },
  ],
  healthInsurance: [
    { name: 'BOMAID Health Plan',  provider: 'Botswana Medical Aid Society', price: 'BWP 400/month', features: 'Hospital cover, specialist consults, chronic medication, emergency', rating: '4.1 ⭐' },
    { name: 'Metropolitan Health', provider: 'Metropolitan Health',          price: 'BWP 350/month', features: 'Medical expenses, wellness programs, preventive care, emergency',    rating: '3.9 ⭐' },
  ],
  homeInsurance: [
    { name: 'First Capital Home', provider: 'First Capital Insurance',    price: 'BWP 200/month', features: 'Building cover, contents protection, liability, alternative accommodation', rating: '4.2 ⭐' },
    { name: 'BIC Household',      provider: 'Botswana Insurance Company', price: 'BWP 150/month', features: 'Fire & theft, natural disasters, contents cover, public liability',          rating: '4.0 ⭐' },
  ],
  investments: [
    { name: 'Allan Gray Balanced Fund', provider: 'Allan Gray Botswana', price: 'BWP 500/month',   features: 'Diversified portfolio, professionally managed, long-term growth', rating: '4.6 ⭐' },
    { name: 'Investec Money Market',    provider: 'Investec Botswana',   price: 'BWP 1,000/month', features: 'Capital protection, competitive returns, high liquidity',          rating: '4.3 ⭐' },
  ],
  loans: [
    { name: 'FNB Personal Loan',  provider: 'First National Bank',    price: 'From BWP 500/month',   max: 'BWP 200,000', rate: '15–25% p.a.', features: 'Quick approval, flexible terms, competitive rates',   rating: '4.2 ⭐' },
    { name: 'Standard Bank Loan', provider: 'Standard Bank Botswana', price: 'From BWP 1,000/month', max: 'BWP 300,000', rate: '12–22% p.a.', features: 'No hidden fees, flexible repayment, quick processing', rating: '4.0 ⭐' },
  ],
  coins: {
    whatAreThey: 'Nthoppa Coins are loyalty points you earn just by using the Nthoppa app! The more you learn and engage, the more you earn. Then redeem them for real rewards like airtime, fuel, and DStv.',
    howToEarn: [
      { activity: 'Complete an education module', coins: 25 },
      { activity: 'Take a quiz',                  coins: 10 },
      { activity: 'Complete your profile',        coins: 10 },
      { activity: 'Daily login',                  coins: 2  },
      { activity: 'Refer a friend',               coins: 20 },
    ],
    maxEarnable: 'Complete all 9 modules + quizzes = up to 315 coins!',
    rewards: {
      airtime:  [{ item: 'BWP 50 Airtime',  coins: 500  }, { item: 'BWP 100 Airtime',   coins: 950  }, { item: 'BWP 200 Airtime',   coins: 1800 }],
      vouchers: [{ item: 'BWP 200 Voucher', coins: 2000 }, { item: 'BWP 500 Voucher',   coins: 4500 }, { item: 'BWP 1,000 Voucher', coins: 8500 }],
      fuel:     [{ item: 'BWP 100 Fuel',    coins: 1000 }, { item: 'BWP 250 Fuel',      coins: 2400 }, { item: 'BWP 500 Fuel',      coins: 4500 }],
      dstv:     [{ item: 'DStv Compact (1 month)', coins: 2000 }, { item: 'DStv Compact Plus', coins: 3000 }, { item: 'DStv Premium', coins: 5000 }],
    },
  },
  education: [
    { num: 1, title: 'Money 101 – Understanding the Basics',   desc: 'Learn what money is, how it works, and the basics of managing it.' },
    { num: 2, title: 'Why Financial Literacy Matters',          desc: 'Understand why knowing about money is one of the most important life skills.' },
    { num: 3, title: 'Saving – Your Safety Net',               desc: 'Learn how to build savings habits and why having a safety net matters.' },
    { num: 4, title: 'Smart Budgeting',                        desc: 'Create budgets that actually work for your lifestyle.' },
    { num: 5, title: 'Understanding Credit and Debt',          desc: 'Learn about good debt vs bad debt, credit scores, and managing borrowing.' },
    { num: 6, title: 'Basics of Investment',                   desc: 'Discover how to make your money work for you through investing.' },
    { num: 7, title: 'Financial Protection and Insurance',     desc: 'Why insurance matters and how to choose the right cover.' },
    { num: 8, title: 'Planning for Retirement',                desc: 'Start planning for your future — it is never too early.' },
    { num: 9, title: 'Botswana Stock Exchange (BSE)',          desc: 'An introduction to the BSE and how to start investing in local stocks.' },
  ],
  calculators: [
    { name: 'Loan Calculator',              desc: 'Calculate monthly repayments for home (8–15%), car (12–20%), and personal (15–25%) loans.' },
    { name: 'Savings Goal Calculator',      desc: 'Work out how long it takes to reach a savings goal at 2–5% interest.' },
    { name: 'Investment Growth Calculator', desc: 'Project how your investment grows: Conservative (4–6%), Moderate (6–8%), Aggressive (8–12%).' },
    { name: 'Emergency Fund Calculator',    desc: 'Find out how much you need for 3, 6, or 12 months of emergency cover.' },
  ],
  appFeatures: [
    'Compare insurance, loans & investments side by side',
    'Earn Nthoppa Coins for every activity',
    'Complete free financial education modules',
    'Use financial calculators on the go',
    'Redeem coins for airtime, fuel, vouchers & DStv',
    'Track your financial wellness journey',
  ],
  businessModel: 'Nthoppa earns a referral commission when you purchase a product through the platform. This means comparing and browsing is completely FREE for users — Nthoppa is paid by the product providers, not customers.',
  eligibility: {
    insurance: 'Most products require Botswana residency, age 18+. Some have upper age limits. Requirements vary by provider.',
    loans: 'Typically requires: Botswana citizenship/residency, regular income, age 18+, valid bank account. Credit history may be checked.',
    investments: 'Open to anyone aged 18+ with valid ID and bank account. Minimum BWP 500/month applies.',
  },
};
 
// ============================================================
// OFF-TOPIC KEYWORDS
// ============================================================
const OFF_TOPIC = [
  'food','bread','buns','burger','pizza','chicken','restaurant','cook','recipe','meal','lunch','dinner','breakfast',
  'clothes','fashion','shoes','dress','shirt','trouser',
  'movie','film','series','music','song','artist','album','concert',
  'sport','football','soccer','cricket','basketball','rugby','tennis','match','score',
  'weather','rain','temperature','forecast','climate',
  'politics','election','government','president','minister','party','vote',
  'love','relationship','dating','boyfriend','girlfriend','marriage',
  'job','vacancy','hiring','cv','resume',
  'joke','funny','meme','prank',
];
 
// ============================================================
// FORMATTING HELPERS
// ============================================================
function fmtProducts(title, items) {
  const lines = items.map(p =>
    `✅ *${p.name}* ${p.rating}\n   🏢 ${p.provider}\n   💵 ${p.price}\n   📋 ${p.features}`
  ).join('\n\n');
  return `${title}\n\n${lines}\n\n📲 *Compare & apply on the Nthoppa app:*\n${COMPANY.playStore}`;
}
 
function fmtLoans(title, items) {
  const lines = items.map(l =>
    `✅ *${l.name}* ${l.rating}\n   🏢 ${l.provider}\n   💵 Repayment: ${l.price}\n   💰 Up to: ${l.max}\n   📊 Rate: ${l.rate}\n   📋 ${l.features}`
  ).join('\n\n');
  return `${title}\n\n${lines}\n\n📲 *Apply via the Nthoppa app:*\n${COMPANY.playStore}`;
}
 
function fmtRewardCat(title, items) {
  return `${title}\n${items.map(r => `• ${r.item} — *${r.coins} coins*`).join('\n')}`;
}
 
function fmtAffordable(coins) {
  const all = [
    ...KB.coins.rewards.airtime.map(r  => ({ ...r, cat: '📱 Airtime'  })),
    ...KB.coins.rewards.vouchers.map(r => ({ ...r, cat: '🎟️ Voucher'  })),
    ...KB.coins.rewards.fuel.map(r     => ({ ...r, cat: '⛽ Fuel'      })),
    ...KB.coins.rewards.dstv.map(r     => ({ ...r, cat: '📺 DStv'      })),
  ];
  const can = all.filter(r => r.coins <= coins);
  if (!can.length) return `🪙 With *${coins} coins* you cannot redeem anything yet.\n\nLowest reward: *500 coins* (BWP 50 Airtime).\n\nType *earn coins* to learn how to earn more! 💪`;
  return `🎁 *With ${coins} coins you can get:*\n\n${can.map(r => `• ${r.cat}: ${r.item} (${r.coins} coins)`).join('\n')}\n\nType *redeem* to see the full catalogue 🛍️`;
}
 
function fmtOne(p, isLoan = false) {
  let t = `✅ *${p.name}* ${p.rating}\n\n🏢 Provider: ${p.provider}\n💵 Price: ${p.price}\n`;
  if (isLoan) t += `💰 Max Amount: ${p.max}\n📊 Rate: ${p.rate}\n`;
  t += `📋 Features: ${p.features}\n\n📲 Apply on the Nthoppa app:\n${COMPANY.playStore}`;
  return t;
}
 
// ============================================================
// MAIN BOT LOGIC
// ============================================================
function getReply(msg) {
 
  if (!msg || msg.trim().length < 2) {
    return `HI!! 👋 I'm *Nthoppa Bot*, what can I help you with today?\n\nType *menu* to see all options 😊`;
  }
 
  const m = msg.toLowerCase().trim();
 
  // 1. Off-topic
  if (OFF_TOPIC.some(t => m.includes(t))) {
    return `🙏 I can only help with Nthoppa financial services!\n\nI can assist with:\n• 🛡️ Insurance (Life, Car, Health, Home)\n• 💰 Loans & Investments\n• 🪙 Nthoppa Coins & Rewards\n• 📚 Financial Education\n• 🔢 Calculators\n• 📲 App Download\n• 📞 Contact Us\n\nWhat would you like to know? 😊`;
  }
 
  // 2. Coin amount check
  const coinAmt = m.match(/(\d[\d,]*)\s*coins?/);
  if (coinAmt) return fmtAffordable(parseInt(coinAmt[1].replace(',', '')));
 
  // 3. Specific module
  const modMatch = m.match(/module\s*(\d+)/);
  if (modMatch) {
    const n = parseInt(modMatch[1]);
    const mod = KB.education.find(e => e.num === n);
    if (mod) return `📚 *Module ${mod.num}: ${mod.title}*\n\n${mod.desc}\n\n🪙 Earn *25 coins* for completing it + *10 coins* for the quiz!\n\n📲 Download to start:\n${COMPANY.playStore}`;
    return `❓ We have modules 1–9. Type *education* to see the full list 📚`;
  }
 
  // 4. Specific providers
  if (m.includes('liberty'))       return fmtOne(KB.lifeInsurance[0]);
  if (m.includes('old mutual'))    return fmtOne(KB.lifeInsurance[1]);
  if (m.includes('bic life'))      return fmtOne(KB.lifeInsurance[2]);
  if (m.includes('hollard'))       return fmtOne(KB.carInsurance[0]);
  if (m.includes('guardrisk'))     return fmtOne(KB.carInsurance[1]);
  if (m.includes('bomaid'))        return fmtOne(KB.healthInsurance[0]);
  if (m.includes('first capital')) return fmtOne(KB.homeInsurance[0]);
  if (m.includes('allan gray'))    return fmtOne(KB.investments[0]);
  if (m.includes('investec'))      return fmtOne(KB.investments[1]);
  if (m.includes('fnb') || m.includes('first national')) return fmtOne(KB.loans[0], true);
  if (m.includes('standard bank')) return fmtOne(KB.loans[1], true);
 
  // 5. FAQ matching
 
  // GREETINGS / MENU
  if (['hello','hi','hey','howzit','dumela','greetings','start','menu','home','options','what can you do','help me'].some(w => m.includes(w))) {
    return (
      `HI!! 👋 I'm *Nthoppa Bot*, what can I help you with today?\n\n` +
      `1️⃣ *Insurance* — Life, Car, Health, Home\n` +
      `2️⃣ *Loans* — Personal loans\n` +
      `3️⃣ *Investments* — Grow your money\n` +
      `4️⃣ *Nthoppa Coins* — Earn & redeem rewards\n` +
      `5️⃣ *Education* — Free financial courses\n` +
      `6️⃣ *Calculators* — Plan your finances\n` +
      `7️⃣ *Download App* — Get the Nthoppa app\n` +
      `8️⃣ *Contact Us* — Reach the team\n\n` +
      `Just type what you need — e.g. *life insurance* or *earn coins* 😊`
    );
  }
 
  // ABOUT
  if (m.includes('what is nthoppa') || m.includes('about nthoppa') || m.includes('who are you') || m.includes('what do you do') || (m.includes('about') && m.includes('nthoppa'))) {
    return (
      `🏦 *About Nthoppa*\n\n` +
      `Nthoppa is *Botswana's financial wellness platform* that helps you:\n\n` +
      `✅ Compare & access insurance products\n` +
      `✅ Find the best loans & investments\n` +
      `✅ Earn *Nthoppa Coins* just by using the app\n` +
      `✅ Redeem coins for airtime, fuel, vouchers & DStv\n` +
      `✅ Learn financial skills through 9 free modules\n` +
      `✅ Use financial calculators to plan your future\n\n` +
      `💡 *Is it free?* Yes! ${KB.businessModel}\n\n` +
      `📲 *Download the free app (Android):*\n${COMPANY.playStore}\n` +
      `_(iOS coming soon!)_`
    );
  }
 
  // HOW IT WORKS
  if (m.includes('how does') || m.includes('how do you work') || m.includes('is it free') || m.includes('free to use') || m.includes('business model') || m.includes('how does it work')) {
    return (
      `💡 *How Nthoppa Works*\n\n` +
      `Nthoppa is *completely free* for users:\n\n` +
      `1️⃣ Browse & compare products on the app\n` +
      `2️⃣ Choose the best option for you\n` +
      `3️⃣ Apply through Nthoppa\n` +
      `4️⃣ Nthoppa earns from the provider — not from you\n` +
      `5️⃣ You earn Nthoppa Coins the whole time! 🪙\n\n` +
      `📲 *Get started:*\n${COMPANY.playStore}`
    );
  }
 
  // INSURANCE GENERAL
  if ((m.includes('insurance') || m.includes('cover') || m.includes('insure')) && !['life','car','motor','vehicle','health','medical','home','house','household'].some(w => m.includes(w))) {
    return (
      `🛡️ *Insurance on Nthoppa*\n\n` +
      `We have *4 types* of insurance to compare:\n\n` +
      `1️⃣ *Life Insurance* — from BWP 100/month\n   Protect your family's future\n\n` +
      `2️⃣ *Car Insurance* — from BWP 250/month\n   Cover your vehicle against accidents & theft\n\n` +
      `3️⃣ *Health Insurance* — from BWP 350/month\n   Medical aid & healthcare cover\n\n` +
      `4️⃣ *Home Insurance* — from BWP 150/month\n   Protect your home & contents\n\n` +
      `Type the type you want, e.g. *car insurance* 👆`
    );
  }
 
  // LIFE INSURANCE
  if (m.includes('life insurance') || m.includes('life cover') || m.includes('life plan') || (m.includes('life') && m.includes('insur'))) {
    return fmtProducts('🛡️ *Life Insurance Plans on Nthoppa*', KB.lifeInsurance);
  }
 
  // CAR INSURANCE
  if (m.includes('car insurance') || m.includes('motor insurance') || m.includes('vehicle insurance') || m.includes('car cover') || (m.includes('car') && m.includes('insur')) || (m.includes('vehicle') && m.includes('insur'))) {
    return fmtProducts('🚗 *Car Insurance Plans on Nthoppa*', KB.carInsurance);
  }
 
  // HEALTH INSURANCE
  if (m.includes('health insurance') || m.includes('medical aid') || m.includes('health cover') || m.includes('medical insurance') || (m.includes('health') && m.includes('insur'))) {
    return fmtProducts('🏥 *Health Insurance Plans on Nthoppa*', KB.healthInsurance);
  }
 
  // HOME INSURANCE
  if (m.includes('home insurance') || m.includes('household insurance') || m.includes('house insurance') || m.includes('home cover') || (m.includes('home') && m.includes('insur')) || (m.includes('house') && m.includes('insur'))) {
    return fmtProducts('🏠 *Home Insurance Plans on Nthoppa*', KB.homeInsurance);
  }
 
  // COMPARE INSURANCE
  if (m.includes('compare') && m.includes('insurance')) {
    return `🔍 *Compare Insurance on Nthoppa*\n\nWhich type?\n\n• Type *life insurance*\n• Type *car insurance*\n• Type *health insurance*\n• Type *home insurance*\n\nOr download the app to compare all at once:\n📲 ${COMPANY.playStore}`;
  }
 
  // INVESTMENTS
  if (m.includes('invest') || m.includes('fund') || m.includes('grow my money') || m.includes('grow money') || m.includes('bse') || m.includes('stock market')) {
    return fmtProducts('📈 *Investment Options on Nthoppa*', KB.investments) +
      `\n\n💡 *Expected returns:*\n• Conservative: 4–6% p.a.\n• Moderate: 6–8% p.a.\n• Aggressive: 8–12% p.a.`;
  }
 
  // LOANS
  if (m.includes('loan') || m.includes('borrow') || m.includes('credit') || m.includes('i need money') || m.includes('need cash') || m.includes('lend')) {
    return fmtLoans('💰 *Loan Options on Nthoppa*', KB.loans);
  }
 
  // ELIGIBILITY
  if (m.includes('eligible') || m.includes('qualify') || m.includes('requirements') || m.includes('who can apply') || m.includes('can i apply')) {
    return (
      `📋 *Eligibility on Nthoppa*\n\n` +
      `🛡️ *Insurance:*\n${KB.eligibility.insurance}\n\n` +
      `💰 *Loans:*\n${KB.eligibility.loans}\n\n` +
      `📈 *Investments:*\n${KB.eligibility.investments}\n\n` +
      `📞 ${COMPANY.phone}\n📧 ${COMPANY.email}`
    );
  }
 
  // CLAIMS
  if (m.includes('claim') || m.includes('make a claim') || m.includes('accident') || m.includes('stolen')) {
    return `🚨 *Making an Insurance Claim*\n\nContact the product provider directly using details on your policy document.\n\nNthoppa can help connect you:\n📞 ${COMPANY.phone}\n📧 ${COMPANY.email}\n🌐 ${COMPANY.website}`;
  }
 
  // COINS — GENERAL
  if ((m.includes('coin') || m.includes('loyalty') || m.includes('points')) && !['redeem','earn','spend','use','get with','buy'].some(w => m.includes(w))) {
    return (
      `🪙 *Nthoppa Coins*\n\n` +
      `${KB.coins.whatAreThey}\n\n` +
      `🏆 *Ways to earn:*\n` +
      KB.coins.howToEarn.map(e => `• ${e.activity}: *${e.coins} coins*`).join('\n') +
      `\n\n💡 ${KB.coins.maxEarnable}\n\n` +
      `Type *earn coins* — for earning tips\nType *redeem* — to see the rewards catalogue 🎁`
    );
  }
 
  // COINS — EARN
  if (m.includes('earn coin') || m.includes('earn points') || m.includes('how to earn') || m.includes('get coins') || m.includes('how do i earn')) {
    return (
      `🪙 *How to Earn Nthoppa Coins*\n\n` +
      KB.coins.howToEarn.map(e => `• ${e.activity}: *${e.coins} coins*`).join('\n') +
      `\n\n💡 ${KB.coins.maxEarnable}\n\n` +
      `📲 Download the app to start earning:\n${COMPANY.playStore}\n\nType *redeem* to see what you can spend coins on 🎁`
    );
  }
 
  // COINS — REDEEM / REWARDS
  if (m.includes('redeem') || m.includes('spend coin') || m.includes('use coin') || m.includes('rewards catalogue') || m.includes('what rewards')) {
    const r = KB.coins.rewards;
    return (
      `🎁 *Nthoppa Rewards Catalogue*\n\n` +
      fmtRewardCat('📱 *Airtime*', r.airtime) + '\n\n' +
      fmtRewardCat('🎟️ *Cash Vouchers*', r.vouchers) + '\n\n' +
      fmtRewardCat('⛽ *Fuel*', r.fuel) + '\n\n' +
      fmtRewardCat('📺 *DStv Subscriptions*', r.dstv) +
      `\n\nType a coin amount to check what you can get\ne.g. *1000 coins* 🪙`
    );
  }
 
  // AIRTIME
  if (m.includes('airtime') && !m.includes('earn')) {
    return fmtRewardCat('📱 *Airtime Rewards*', KB.coins.rewards.airtime) + `\n\nType *earn coins* to start earning 🪙`;
  }
 
  // FUEL
  if (m.includes('fuel') || m.includes('petrol') || m.includes('diesel')) {
    return fmtRewardCat('⛽ *Fuel Rewards*', KB.coins.rewards.fuel) + `\n\nType *earn coins* to start earning 🪙`;
  }
 
  // DSTV
  if (m.includes('dstv') || m.includes('multichoice') || m.includes('tv subscription')) {
    return fmtRewardCat('📺 *DStv Rewards*', KB.coins.rewards.dstv) + `\n\nType *earn coins* to start earning 🪙`;
  }
 
  // VOUCHER
  if (m.includes('voucher') || m.includes('gift voucher') || m.includes('cash voucher')) {
    return fmtRewardCat('🎟️ *Cash Voucher Rewards*', KB.coins.rewards.vouchers) + `\n\nType *earn coins* to start earning 🪙`;
  }
 
  // EDUCATION
  if (m.includes('education') || m.includes('learn') || m.includes('course') || m.includes('module') || m.includes('study') || m.includes('financial literacy')) {
    return (
      `📚 *Financial Education on Nthoppa*\n\n` +
      `*9 free modules* covering everything about money:\n\n` +
      KB.education.map(e => `${e.num}. *${e.title}*`).join('\n') +
      `\n\n🪙 Earn *25 coins* per module + *10 coins* per quiz!\n` +
      `Type *module 1* (or any number 1–9) for details.\n\n` +
      `📲 Start learning on the app:\n${COMPANY.playStore}`
    );
  }
 
  // CALCULATORS
  if (m.includes('calculat') || m.includes('how much will i pay') || m.includes('repayment') || m.includes('savings goal')) {
    return (
      `🔢 *Financial Calculators on Nthoppa*\n\n` +
      KB.calculators.map(c => `📊 *${c.name}*\n${c.desc}`).join('\n\n') +
      `\n\n📲 Use them free on the app:\n${COMPANY.playStore}`
    );
  }
 
  // DOWNLOAD APP
  if (m.includes('download') || m.includes('install') || m.includes('get the app') || m.includes('google play') || m.includes('play store') || m.includes('android') || m.includes('ios') || m.includes('iphone') || m.includes('apple store') || m.includes('app store')) {
    return (
      `📲 *Download the Nthoppa App*\n\n` +
      `The Nthoppa app is your all-in-one financial wellness companion:\n\n` +
      KB.appFeatures.map(f => `• ${f}`).join('\n') +
      `\n\n🟢 *Download FREE on Google Play (Android):*\n${COMPANY.playStore}\n\n` +
      `🍎 *iOS / App Store:*\nNot available yet — coming soon!\n\n` +
      `🪙 Bonus: Earn *10 coins* just for completing your profile after signing up!`
    );
  }
 
  // PRICING
  if (m.includes('price') || m.includes('cost') || m.includes('how much') || m.includes('pricing') || m.includes('bwp') || m.includes('pula') || m.includes('affordable')) {
    return (
      `💵 *Nthoppa Pricing Overview*\n\n` +
      `🛡️ *Insurance (monthly):*\n• Life: from BWP 100\n• Car: from BWP 250\n• Health: from BWP 350\n• Home: from BWP 150\n\n` +
      `💰 *Loans:*\n• From BWP 500/month repayment\n• Borrow up to BWP 300,000\n\n` +
      `📈 *Investments:*\n• From BWP 500/month\n\n` +
      `📲 *App & comparison service:* 100% FREE\n\nType the product name for full details, e.g. *car insurance*`
    );
  }
 
  // CONTACT
  if (m.includes('contact') || m.includes('reach') || m.includes('speak') || m.includes('talk to') || m.includes('agent') || m.includes('human') || m.includes('call') || m.includes('email') || m.includes('phone number') || m.includes('support') || m.includes('office')) {
    return (
      `📞 *Contact Nthoppa*\n\n` +
      `📱 *Phone:* ${COMPANY.phone}\n` +
      `📧 *Email:* ${COMPANY.email}\n` +
      `🌐 *Website:* ${COMPANY.website}\n\n` +
      `⏰ *Hours:* ${COMPANY.hours}\n\n` +
      `📲 *Or get instant help on the app:*\n${COMPANY.playStore}`
    );
  }
 
  // WEBSITE
  if (m.includes('website') || m.includes('web') || m.includes('www') || m.includes('online')) {
    return `🌐 *Nthoppa Website:*\n${COMPANY.website}\n\n📲 *Download the app for the full experience:*\n${COMPANY.playStore}`;
  }
 
  // ACCOUNT / SIGN UP
  if (m.includes('account') || m.includes('sign up') || m.includes('register') || m.includes('login') || m.includes('log in') || m.includes('create account') || m.includes('forgot password')) {
    return (
      `👤 *Nthoppa Account*\n\n` +
      `To create your account:\n` +
      `1. Download the Nthoppa app 📲\n` +
      `2. Tap *"Sign Up"*\n` +
      `3. Enter your name, phone & email\n` +
      `4. Verify your phone number\n` +
      `5. Complete your profile — earn *10 bonus coins!* 🪙\n\n` +
      `📲 *Download here (Android):*\n${COMPANY.playStore}\n\n` +
      `Already registered? Open the app and tap *"Login"*.\nForgot password? Tap *"Forgot Password"* on the login screen.`
    );
  }
 
  // COMPARE GENERAL
  if (m.includes('compare') || m.includes('which is better') || m.includes('recommend') || m.includes('cheapest') || m.includes('best option')) {
    return `🔍 *Compare on Nthoppa*\n\nWhat would you like to compare?\n\n• Type *life insurance*\n• Type *car insurance*\n• Type *health insurance*\n• Type *home insurance*\n• Type *investments*\n• Type *loans*\n\n📲 Or download the app to compare everything:\n${COMPANY.playStore}`;
  }
 
  // GOODBYE / THANKS
  if (['bye','goodbye','see you','later','thanks','thank you','ok thanks','done','great','awesome','perfect','cheers'].some(w => m.includes(w))) {
    return (
      `😊 *Thank you for chatting with Nthoppa!*\n\n` +
      `Don't forget — the Nthoppa app has everything:\n` +
      `• Compare products\n• Earn & redeem coins\n• Free financial education\n\n` +
      `📲 *Download (Android):*\n${COMPANY.playStore}\n\n` +
      `💚 *Stay financially well, Botswana!* 🇧🇼\n\nType *hello* anytime to start again 👋`
    );
  }
 
  // DEFAULT FALLBACK
  return (
    `🤔 Hmm, I didn't quite catch that!\n\n` +
    `Here's what I can help with:\n\n` +
    `🛡️ *insurance* — Life, Car, Health, Home\n` +
    `💰 *loans* — Borrow money\n` +
    `📈 *investments* — Grow your money\n` +
    `🪙 *earn coins* — Loyalty rewards\n` +
    `🎁 *redeem* — Spend coins on rewards\n` +
    `📚 *education* — Free financial modules\n` +
    `🔢 *calculators* — Financial planning tools\n` +
    `📲 *download app* — Get the Nthoppa app\n` +
    `📞 *contact* — Reach the team\n\n` +
    `Or type *menu* to start over 😊`
  );
}
 
// ============================================================
// ROUTES
// ============================================================
app.post('/webhook', (req, res) => {
  const userMessage = req.body.Body || '';
  const from = req.body.From || 'unknown';
  console.log(`📩 [${new Date().toISOString()}] From: ${from} | Message: "${userMessage}"`);
  const reply = getReply(userMessage);
  const twiml = new twilio.twiml.MessagingResponse();
  twiml.message(reply);
  res.type('text/xml').send(twiml.toString());
});
 
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Nthoppa WhatsApp Chatbot v2.0', uptime: process.uptime(), timestamp: new Date().toISOString() });
});
 
app.post('/test', (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Provide a "message" field.' });
  res.json({ you: message, nthoppa: getReply(message) });
});
 
// ============================================================
// START
// ============================================================
app.listen(PORT, () => {
  console.log('==============================================');
  console.log('  🌿 NTHOPPA WhatsApp Bot v2.0 — RUNNING');
  console.log('==============================================');
  console.log(`  🔗 Webhook : POST http://localhost:${PORT}/webhook`);
  console.log(`  ❤️  Health  : GET  http://localhost:${PORT}/health`);
  console.log(`  🧪 Test    : POST http://localhost:${PORT}/test`);
  console.log('==============================================');
});
