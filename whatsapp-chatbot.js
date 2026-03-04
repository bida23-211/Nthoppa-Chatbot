/**
 * ============================================================
 * NTHOPPA WHATSAPP CUSTOMER SERVICE CHATBOT
 * Financial Wellness Platform - Botswana
 * ============================================================
 * Single-file, production-ready WhatsApp bot using
 * Meta WhatsApp Business API (Graph API v17.0)
 * ============================================================
 */

require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

// ============================================================
// ENVIRONMENT CONFIG
// ============================================================
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_ID;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || 'nthoppa_verify_token_123';
const PORT = process.env.PORT || 3000;

// ============================================================
// KNOWLEDGE BASE
// ============================================================
const knowledgeBase = {
  company: {
    name: 'Nthoppa',
    description: 'Financial wellness platform in Botswana',
    contact: '+267 123 4567',
    email: 'info@nthoppa.co.bw',
    website: 'www.nthoppa.co.bw',
    appStore: 'https://apps.apple.com/nthoppa',
    playStore: 'https://play.google.com/store/nthoppa'
  },

  products: {
    lifeInsurance: [
      {
        name: 'Liberty Life Cover',
        provider: 'Liberty Life Botswana',
        price: 'BWP 150/month',
        features: 'Death benefit, disability cover, critical illness, premium waiver',
        rating: '4.5 ⭐'
      },
      {
        name: 'Old Mutual Life Plan',
        provider: 'Old Mutual Botswana',
        price: 'BWP 200/month',
        features: 'Life cover, investment growth, tax benefits, loan facility',
        rating: '4.3 ⭐'
      },
      {
        name: 'BIC Life Assurance',
        provider: 'Botswana Insurance Company',
        price: 'BWP 100/month',
        features: 'Basic life cover, funeral benefit, family protection',
        rating: '4.1 ⭐'
      }
    ],

    carInsurance: [
      {
        name: 'Hollard Comprehensive Car',
        provider: 'Hollard Insurance Botswana',
        price: 'BWP 300/month',
        features: 'Accident cover, theft protection, third party, roadside assistance',
        rating: '4.4 ⭐'
      },
      {
        name: 'Guardrisk Motor Insurance',
        provider: 'Guardrisk Insurance',
        price: 'BWP 250/month',
        features: 'Comprehensive cover, third party, fire & theft, quick claims',
        rating: '4.2 ⭐'
      },
      {
        name: 'Metropolitan Motor Cover',
        provider: 'Metropolitan Life Botswana',
        price: 'BWP 280/month',
        features: 'Full comprehensive, third party only, flexible payments, 24/7 claims',
        rating: '4.0 ⭐'
      }
    ],

    healthInsurance: [
      {
        name: 'BOMAID Health Plan',
        provider: 'Botswana Medical Aid Society',
        price: 'BWP 400/month',
        features: 'Hospital cover, specialist consultations, chronic medication, emergency services',
        rating: '4.1 ⭐'
      },
      {
        name: 'Metropolitan Health Cover',
        provider: 'Metropolitan Health',
        price: 'BWP 350/month',
        features: 'Medical expenses, wellness programs, preventive care, emergency cover',
        rating: '3.9 ⭐'
      }
    ],

    homeInsurance: [
      {
        name: 'First Capital Home Cover',
        provider: 'First Capital Insurance',
        price: 'BWP 200/month',
        features: 'Building cover, contents protection, liability cover, alternative accommodation',
        rating: '4.2 ⭐'
      },
      {
        name: 'BIC Household Insurance',
        provider: 'Botswana Insurance Company',
        price: 'BWP 150/month',
        features: 'Fire & theft, natural disasters, contents cover, public liability',
        rating: '4.0 ⭐'
      }
    ],

    investments: [
      {
        name: 'Allan Gray Balanced Fund',
        provider: 'Allan Gray Botswana',
        price: 'BWP 500/month',
        features: 'Diversified portfolio, professional management, long-term growth',
        rating: '4.6 ⭐'
      },
      {
        name: 'Investec Money Market',
        provider: 'Investec Botswana',
        price: 'BWP 1,000/month',
        features: 'Capital protection, competitive returns, high liquidity',
        rating: '4.3 ⭐'
      }
    ],

    loans: [
      {
        name: 'FNB Personal Loan',
        provider: 'First National Bank',
        price: 'From BWP 500/month',
        maxAmount: 'BWP 200,000',
        features: 'Quick approval, flexible terms, competitive rates',
        rating: '4.2 ⭐'
      },
      {
        name: 'Standard Bank Loan',
        provider: 'Standard Bank Botswana',
        price: 'From BWP 1,000/month',
        maxAmount: 'BWP 300,000',
        features: 'Flexible repayment, no hidden fees, quick processing',
        rating: '4.0 ⭐'
      }
    ]
  },

  coins: {
    whatAreCoins: 'Nthoppa Coins are loyalty points you earn by using the app!',
    howToEarn: [
      '📚 Complete education modules: *25 coins* each',
      '🧠 Take quizzes: *10 coins* each',
      '👤 Complete your profile: *10 coins*',
      '📅 Daily login: *2 coins*',
      '👥 Refer a friend: *20 coins*'
    ],
    rewards: {
      airtime: [
        { item: 'BWP 50 Airtime', coins: 500 },
        { item: 'BWP 100 Airtime', coins: 950 },
        { item: 'BWP 200 Airtime', coins: 1800 }
      ],
      vouchers: [
        { item: 'BWP 200 Cash Voucher', coins: 2000 },
        { item: 'BWP 500 Cash Voucher', coins: 4500 },
        { item: 'BWP 1,000 Cash Voucher', coins: 8500 }
      ],
      fuel: [
        { item: 'BWP 100 Fuel', coins: 1000 },
        { item: 'BWP 250 Fuel', coins: 2400 },
        { item: 'BWP 500 Fuel', coins: 4500 }
      ],
      dstv: [
        { item: 'DStv Compact (1 month)', coins: 2000 },
        { item: 'DStv Compact Plus (1 month)', coins: 3000 },
        { item: 'DStv Premium (1 month)', coins: 5000 }
      ]
    }
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
    'Module 9: Botswana Stock Exchange (BSE)'
  ],

  calculators: {
    loan: 'Calculate loan payments at 8–25% interest rates depending on type',
    savings: 'Plan savings goals with 2–5% interest rate projections',
    investment: 'Project investment growth: Conservative 4–6%, Moderate 6–8%, Aggressive 8–12%',
    emergency: 'Emergency fund planning: 3, 6, or 12 months of expenses'
  }
};

// ============================================================
// UNRELATED TOPICS — politely decline these
// ============================================================
const unrelatedTopics = [
  'food', 'bread', 'buns', 'burger', 'pizza', 'restaurant', 'cooking', 'recipe',
  'clothes', 'fashion', 'shoes', 'dress', 'shirt',
  'movie', 'music', 'sport', 'football', 'soccer', 'cricket', 'game',
  'weather', 'rain', 'temperature', 'forecast',
  'politics', 'election', 'government', 'news',
  'love', 'relationship', 'dating',
  'car repair', 'plumber', 'electrician',
  'joke', 'funny', 'meme'
];

// ============================================================
// FAQ DATABASE — keyword arrays mapped to responses
// ============================================================
const faqs = [
  // ── GREETINGS ──────────────────────────────────────────────
  {
    keywords: ['hello', 'hi', 'hey', 'howzit', 'dumela', 'good morning', 'good afternoon', 'good evening', 'start', 'menu'],
    response: `👋 *Welcome to Nthoppa!*
Your financial wellness platform in Botswana 🇧🇼

I can help you with:
1️⃣ Insurance (Life, Car, Health, Home)
2️⃣ Loans & Investments
3️⃣ Nthoppa Coins & Rewards
4️⃣ Financial Education
5️⃣ Calculators
6️⃣ Contact & Support

Just type what you need — for example: _"show me life insurance"_ or _"how do I earn coins?"_ 😊`
  },

  // ── ABOUT NTHOPPA ──────────────────────────────────────────
  {
    keywords: ['what is nthoppa', 'about nthoppa', 'tell me about', 'what do you do', 'who are you', 'nthoppa'],
    response: `🏦 *About Nthoppa*

Nthoppa is Botswana's leading *financial wellness platform* that helps you:

✅ Compare & buy insurance products
✅ Find the best loans & investments
✅ Earn *Nthoppa Coins* for rewards
✅ Learn financial skills through education modules
✅ Use financial calculators

📲 *Download the app:*
• Google Play: play.google.com/store/nthoppa
• App Store: apps.apple.com/nthoppa

We're here to make financial services simple and rewarding! 💚`
  },

  // ── LIFE INSURANCE ─────────────────────────────────────────
  {
    keywords: ['life insurance', 'life cover', 'death benefit', 'life plan', 'show life'],
    response: formatProductList('🛡️ *Life Insurance Plans*', knowledgeBase.products.lifeInsurance)
  },

  // ── CAR INSURANCE ──────────────────────────────────────────
  {
    keywords: ['car insurance', 'motor insurance', 'vehicle insurance', 'car cover', 'motor cover', 'show car'],
    response: formatProductList('🚗 *Car Insurance Plans*', knowledgeBase.products.carInsurance)
  },

  // ── HEALTH INSURANCE ───────────────────────────────────────
  {
    keywords: ['health insurance', 'medical aid', 'health cover', 'medical insurance', 'bomaid', 'show health'],
    response: formatProductList('🏥 *Health Insurance Plans*', knowledgeBase.products.healthInsurance)
  },

  // ── HOME INSURANCE ─────────────────────────────────────────
  {
    keywords: ['home insurance', 'household insurance', 'house cover', 'contents insurance', 'show home'],
    response: formatProductList('🏠 *Home Insurance Plans*', knowledgeBase.products.homeInsurance)
  },

  // ── INSURANCE GENERAL ──────────────────────────────────────
  {
    keywords: ['insurance', 'cover', 'insure', 'compare insurance'],
    response: `🛡️ *Insurance on Nthoppa*

We offer 4 types of insurance you can compare and choose from:

1️⃣ *Life Insurance* — Protect your family's future
2️⃣ *Car Insurance* — Cover your vehicle
3️⃣ *Health Insurance* — Medical aid & cover
4️⃣ *Home Insurance* — Protect your home & contents

Just type what you'd like to see, e.g.:
• _"show me life insurance"_
• _"compare car insurance"_`
  },

  // ── INVESTMENTS ────────────────────────────────────────────
  {
    keywords: ['invest', 'investment', 'fund', 'allan gray', 'investec', 'grow money', 'show investments'],
    response: formatProductList('📈 *Investment Options*', knowledgeBase.products.investments) +
      `\n\n💡 *Interest rate guide:*\n• Conservative: 4–6%\n• Moderate: 6–8%\n• Aggressive: 8–12%`
  },

  // ── LOANS ──────────────────────────────────────────────────
  {
    keywords: ['loan', 'borrow', 'personal loan', 'fnb loan', 'standard bank loan', 'credit', 'show loans'],
    response: formatLoanList('💰 *Loan Options*', knowledgeBase.products.loans)
  },

  // ── NTHOPPA COINS — EARN ───────────────────────────────────
  {
    keywords: ['earn coins', 'how to earn', 'get coins', 'earn points', 'earn rewards'],
    response: `🪙 *How to Earn Nthoppa Coins*

${knowledgeBase.coins.howToEarn.join('\n')}

💡 *Tip:* Complete all education modules to earn up to *225 coins!*

Type _"redeem coins"_ to see what you can get with your coins 🎁`
  },

  // ── NTHOPPA COINS — REDEEM ─────────────────────────────────
  {
    keywords: ['redeem coins', 'use coins', 'spend coins', 'what can i get', 'rewards', 'redeem'],
    response: formatAllRewards()
  },

  // ── COINS — WHAT ARE THEY ──────────────────────────────────
  {
    keywords: ['what are coins', 'nthoppa coins', 'loyalty points', 'coins'],
    response: `🪙 *Nthoppa Coins*

${knowledgeBase.coins.whatAreCoins}

🏆 *Earn coins by:*
${knowledgeBase.coins.howToEarn.join('\n')}

🎁 *Redeem for:*
• Airtime (from 500 coins)
• Cash Vouchers (from 2,000 coins)
• Fuel (from 1,000 coins)
• DStv subscriptions (from 2,000 coins)

Type _"redeem coins"_ to see full rewards list!`
  },

  // ── AIRTIME REWARDS ────────────────────────────────────────
  {
    keywords: ['airtime', 'data', 'airtime rewards'],
    response: formatRewardCategory('📱 *Airtime Rewards*', knowledgeBase.coins.rewards.airtime)
  },

  // ── VOUCHER REWARDS ────────────────────────────────────────
  {
    keywords: ['voucher', 'cash voucher', 'vouchers'],
    response: formatRewardCategory('🎟️ *Cash Voucher Rewards*', knowledgeBase.coins.rewards.vouchers)
  },

  // ── FUEL REWARDS ───────────────────────────────────────────
  {
    keywords: ['fuel', 'petrol', 'diesel', 'fuel rewards'],
    response: formatRewardCategory('⛽ *Fuel Rewards*', knowledgeBase.coins.rewards.fuel)
  },

  // ── DSTV REWARDS ───────────────────────────────────────────
  {
    keywords: ['dstv', 'tv', 'subscription', 'dstv rewards'],
    response: formatRewardCategory('📺 *DStv Rewards*', knowledgeBase.coins.rewards.dstv)
  },

  // ── EDUCATION ──────────────────────────────────────────────
  {
    keywords: ['education', 'learn', 'modules', 'courses', 'financial education', 'study', 'show modules'],
    response: `📚 *Financial Education Modules*

${knowledgeBase.education.map((m, i) => `${i + 1}. ${m}`).join('\n')}

🪙 *Earn 25 coins* per module + *10 coins* per quiz!

Open the Nthoppa app to start learning 📲`
  },

  // ── CALCULATORS ────────────────────────────────────────────
  {
    keywords: ['calculator', 'calculate', 'calculators'],
    response: `🔢 *Financial Calculators on Nthoppa*

1️⃣ *Loan Calculator* — ${knowledgeBase.calculators.loan}
2️⃣ *Savings Calculator* — ${knowledgeBase.calculators.savings}
3️⃣ *Investment Calculator* — ${knowledgeBase.calculators.investment}
4️⃣ *Emergency Fund Calculator* — ${knowledgeBase.calculators.emergency}

Open the Nthoppa app to use these calculators 📱`
  },

  // ── LOAN CALCULATOR ────────────────────────────────────────
  {
    keywords: ['loan calculator', 'calculate loan', 'loan repayment'],
    response: `🏦 *Loan Calculator*

Use the Nthoppa app to calculate exact repayments.

📊 *Estimated interest rates:*
• Home Loan: 8–15%
• Car Loan: 12–20%
• Personal Loan: 15–25%

To see available loans, type _"show me loans"_ 💰`
  },

  // ── DOWNLOAD APP ───────────────────────────────────────────
  {
    keywords: ['download', 'app', 'get app', 'install'],
    response: `📲 *Download the Nthoppa App*

🟢 *Google Play Store:*
play.google.com/store/nthoppa

🍎 *Apple App Store:*
apps.apple.com/nthoppa

The app is *FREE* to download!

Once installed, create your account and start earning Nthoppa Coins right away 🪙`
  },

  // ── CONTACT / HELP ─────────────────────────────────────────
  {
    keywords: ['contact', 'help', 'support', 'speak to agent', 'human', 'agent', 'call', 'email', 'reach you'],
    response: `📞 *Contact Nthoppa*

📱 *Phone:* ${knowledgeBase.company.contact}
📧 *Email:* ${knowledgeBase.company.email}
🌐 *Website:* ${knowledgeBase.company.website}

⏰ *Business Hours:*
Mon–Fri: 8:00 AM – 5:00 PM
Saturday: 9:00 AM – 1:00 PM
Sunday: Closed

We'll get back to you as soon as possible! 😊`
  },

  // ── PRICING / COST ─────────────────────────────────────────
  {
    keywords: ['price', 'cost', 'how much', 'pricing', 'affordable', 'cheap', 'bwp'],
    response: `💵 *Nthoppa Pricing Overview*

📋 *Insurance (monthly premiums):*
• Life Insurance: from BWP 100/month
• Car Insurance: from BWP 250/month
• Health Insurance: from BWP 350/month
• Home Insurance: from BWP 150/month

💰 *Loans:*
• Personal Loans: from BWP 500/month
• Up to BWP 300,000 available

📈 *Investments:*
• Starting from BWP 500/month

Type the product name for detailed pricing, e.g. _"life insurance"_`
  },

  // ── COMPARE ────────────────────────────────────────────────
  {
    keywords: ['compare', 'best', 'which is better', 'recommend'],
    response: `🔍 *Compare Products on Nthoppa*

What would you like to compare?

• Type _"compare life insurance"_
• Type _"compare car insurance"_
• Type _"compare health insurance"_
• Type _"compare home insurance"_
• Type _"compare investments"_

I'll show you all available options with ratings! ⭐`
  },

  // ── PROFILE / ACCOUNT ──────────────────────────────────────
  {
    keywords: ['account', 'profile', 'sign up', 'register', 'login', 'create account'],
    response: `👤 *Nthoppa Account*

To create your account:
1. Download the Nthoppa app 📱
2. Tap *"Sign Up"*
3. Enter your details
4. Verify your phone number
5. Complete your profile (+10 Nthoppa Coins! 🪙)

Already have an account? Tap *"Login"* on the app.

*Download:* play.google.com/store/nthoppa`
  },

  // ── GOODBYE ────────────────────────────────────────────────
  {
    keywords: ['bye', 'goodbye', 'see you', 'thanks', 'thank you', 'ok thanks', 'done'],
    response: `😊 *Thank you for chatting with Nthoppa!*

We hope we were helpful. Remember, we're always here when you need us.

💚 *Stay financially well!*

Type _"hello"_ anytime to start again 👋`
  }
];

// ============================================================
// RESPONSE FORMATTING HELPERS
// ============================================================

/** Format a list of insurance/investment products */
function formatProductList(title, products) {
  const lines = products.map(p =>
    `✅ *${p.name}* (${p.rating})\n   Provider: ${p.provider}\n   Price: ${p.price}\n   Features: ${p.features}`
  ).join('\n\n');
  return `${title}\n\n${lines}\n\n📲 Open the Nthoppa app to compare and apply!`;
}

/** Format loan products (extra maxAmount field) */
function formatLoanList(title, loans) {
  const lines = loans.map(l =>
    `✅ *${l.name}* (${l.rating})\n   Provider: ${l.provider}\n   Repayment: ${l.price}\n   Max Amount: ${l.maxAmount}\n   Features: ${l.features}`
  ).join('\n\n');
  return `${title}\n\n${lines}\n\n📲 Open the Nthoppa app to apply for a loan!`;
}

/** Format a single reward category */
function formatRewardCategory(title, items) {
  const lines = items.map(r => `• ${r.item} — *${r.coins} coins*`).join('\n');
  return `${title}\n\n${lines}\n\n🪙 Type _"earn coins"_ to learn how to earn coins!`;
}

/** Format ALL reward categories */
function formatAllRewards() {
  const kb = knowledgeBase.coins.rewards;
  return `🎁 *Nthoppa Rewards Catalogue*

📱 *Airtime*
${kb.airtime.map(r => `• ${r.item} — *${r.coins} coins*`).join('\n')}

🎟️ *Cash Vouchers*
${kb.vouchers.map(r => `• ${r.item} — *${r.coins} coins*`).join('\n')}

⛽ *Fuel*
${kb.fuel.map(r => `• ${r.item} — *${r.coins} coins*`).join('\n')}

📺 *DStv*
${kb.dstv.map(r => `• ${r.item} — *${r.coins} coins*`).join('\n')}

🪙 Type _"earn coins"_ to start earning today!`;
}

// ============================================================
// CORE BOT LOGIC — getBotResponse(userMessage)
// ============================================================
function getBotResponse(userMessage) {
  if (!userMessage || userMessage.trim().length < 2) {
    return `👋 Hello! I'm the Nthoppa assistant. How can I help you today?\n\nType _"menu"_ to see all options.`;
  }

  const msg = userMessage.toLowerCase().trim();

  // 1. Check for unrelated topics first
  const isUnrelated = unrelatedTopics.some(topic => msg.includes(topic));
  if (isUnrelated) {
    return `🙏 I'm sorry, I can only help with questions about Nthoppa's financial services.\n\nI can assist you with:\n• 🛡️ Insurance (Life, Car, Health, Home)\n• 💰 Loans & Investments\n• 🪙 Nthoppa Coins & Rewards\n• 📚 Financial Education\n• 🔢 Calculators\n\nWhat would you like to know about Nthoppa?`;
  }

  // 2. Handle "coin amount" questions: "what can I get with 1000 coins"
  const coinAmountMatch = msg.match(/(\d[\d,]*)\s*coins?/);
  if (coinAmountMatch) {
    const coinCount = parseInt(coinAmountMatch[1].replace(',', ''));
    return getRewardsForCoins(coinCount);
  }

  // 3. Handle specific module number: "module 1", "module 3"
  const moduleMatch = msg.match(/module\s*(\d+)/);
  if (moduleMatch) {
    const moduleNum = parseInt(moduleMatch[1]);
    if (moduleNum >= 1 && moduleNum <= knowledgeBase.education.length) {
      const module = knowledgeBase.education[moduleNum - 1];
      return `📚 *${module}*\n\nThis module is available in the Nthoppa app. Complete it to earn *25 Nthoppa Coins* 🪙\n\nTake the quiz afterward for *10 more coins!*\n\n📲 Download: play.google.com/store/nthoppa`;
    }
  }

  // 4. Handle specific provider mentions
  if (msg.includes('liberty')) {
    const product = knowledgeBase.products.lifeInsurance.find(p => p.name.toLowerCase().includes('liberty'));
    if (product) return formatSingleProduct(product);
  }
  if (msg.includes('old mutual')) {
    const product = knowledgeBase.products.lifeInsurance.find(p => p.name.toLowerCase().includes('old mutual'));
    if (product) return formatSingleProduct(product);
  }
  if (msg.includes('hollard')) {
    const product = knowledgeBase.products.carInsurance.find(p => p.name.toLowerCase().includes('hollard'));
    if (product) return formatSingleProduct(product);
  }
  if (msg.includes('bomaid')) {
    const product = knowledgeBase.products.healthInsurance.find(p => p.provider.toLowerCase().includes('bomaid'));
    if (product) return formatSingleProduct(product);
  }
  if (msg.includes('allan gray')) {
    const product = knowledgeBase.products.investments.find(p => p.name.toLowerCase().includes('allan gray'));
    if (product) return formatSingleProduct(product);
  }
  if (msg.includes('fnb') || msg.includes('first national')) {
    const product = knowledgeBase.products.loans.find(p => p.name.toLowerCase().includes('fnb'));
    if (product) return formatSingleProduct(product, true);
  }

  // 5. Match against FAQ keywords
  for (const faq of faqs) {
    const matched = faq.keywords.some(keyword => msg.includes(keyword));
    if (matched) return faq.response;
  }

  // 6. Default fallback
  return `🤔 I'm not sure I understood that. Here's what I can help with:

1️⃣ Insurance (Life, Car, Health, Home)
2️⃣ Loans & Investments
3️⃣ Nthoppa Coins & Rewards
4️⃣ Financial Education Modules
5️⃣ Financial Calculators
6️⃣ Contact & Support

Try typing something like:
• _"show me life insurance"_
• _"how do I earn coins?"_
• _"compare car insurance"_

Or type _"help"_ to contact our support team 📞`;
}

/** Format a single product detail */
function formatSingleProduct(product, isLoan = false) {
  let text = `✅ *${product.name}* (${product.rating})\n\n`;
  text += `🏢 Provider: ${product.provider}\n`;
  text += `💵 Price: ${product.price}\n`;
  if (isLoan && product.maxAmount) text += `💰 Max Amount: ${product.maxAmount}\n`;
  text += `📋 Features: ${product.features}\n\n`;
  text += `📲 Apply via the Nthoppa app or visit ${knowledgeBase.company.website}`;
  return text;
}

/** Tell user what they can redeem with a specific coin count */
function getRewardsForCoins(coins) {
  const allRewards = [
    ...knowledgeBase.coins.rewards.airtime.map(r => ({ ...r, category: '📱 Airtime' })),
    ...knowledgeBase.coins.rewards.vouchers.map(r => ({ ...r, category: '🎟️ Voucher' })),
    ...knowledgeBase.coins.rewards.fuel.map(r => ({ ...r, category: '⛽ Fuel' })),
    ...knowledgeBase.coins.rewards.dstv.map(r => ({ ...r, category: '📺 DStv' }))
  ];

  const affordable = allRewards.filter(r => r.coins <= coins);

  if (affordable.length === 0) {
    return `🪙 With *${coins} coins*, you can't redeem anything yet.\n\nThe lowest reward starts at *500 coins* (BWP 50 Airtime).\n\nType _"earn coins"_ to learn how to earn more coins quickly! 💪`;
  }

  const lines = affordable.map(r => `• ${r.category}: ${r.item} (${r.coins} coins)`).join('\n');
  return `🎁 *With ${coins} coins you can get:*\n\n${lines}\n\nType _"redeem coins"_ to see the full rewards catalogue 🛍️`;
}

// ============================================================
// WHATSAPP API — Send Message
// ============================================================
async function sendWhatsAppMessage(to, text) {
  try {
    const url = `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`;
    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: to,
      type: 'text',
      text: { body: text }
    };

    const response = await axios.post(url, payload, {
      headers: {
        'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(`✅ Message sent to ${to}`);
    return response.data;
  } catch (err) {
    console.error(`❌ Failed to send message to ${to}:`, err.response?.data || err.message);
    throw err;
  }
}

// ============================================================
// ROUTES
// ============================================================

/** GET /webhook — WhatsApp verification handshake */
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('✅ Webhook verified by WhatsApp');
    res.status(200).send(challenge);
  } else {
    console.warn('❌ Webhook verification failed');
    res.sendStatus(403);
  }
});

/** POST /webhook — Receive and respond to messages */
app.post('/webhook', async (req, res) => {
  // Always return 200 OK immediately so WhatsApp doesn't retry
  res.sendStatus(200);

  try {
    const body = req.body;
    if (body.object !== 'whatsapp_business_account') return;

    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;

    // Ignore status updates (delivered, read, etc.)
    if (value?.statuses) return;

    const messages = value?.messages;
    if (!messages || messages.length === 0) return;

    const message = messages[0];

    // Only handle text messages
    if (message.type !== 'text') {
      const from = message.from;
      await sendWhatsAppMessage(from, "I can only understand text messages right now. Please type your question! 😊");
      return;
    }

    const from = message.from;
    const userText = message.text?.body || '';

    console.log(`📩 [${new Date().toISOString()}] From: ${from} | Message: ${userText}`);

    // Get bot response and send it
    const reply = getBotResponse(userText);
    await sendWhatsAppMessage(from, reply);

  } catch (err) {
    console.error('❌ Error processing webhook:', err.message);
    // No re-throw: we already sent 200 OK above
  }
});

/** GET /health — Health check */
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Nthoppa WhatsApp Chatbot',
    timestamp: new Date().toISOString()
  });
});

/** POST /test — Local testing without WhatsApp */
app.post('/test', (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Please provide a "message" field in the request body.' });
  }
  const reply = getBotResponse(message);
  res.json({ userMessage: message, botReply: reply });
});

// ============================================================
// START SERVER
// ============================================================
app.listen(PORT, () => {
  console.log('============================================');
  console.log('  🌿 NTHOPPA WhatsApp Chatbot is RUNNING');
  console.log('============================================');
  console.log(`  📡 Port: ${PORT}`);
  console.log(`  🔗 Webhook: http://localhost:${PORT}/webhook`);
  console.log(`  ❤️  Health:  http://localhost:${PORT}/health`);
  console.log(`  🧪 Test:    POST http://localhost:${PORT}/test`);
  console.log('============================================');
});
