# 🌿 Nthoppa WhatsApp Customer Service Chatbot

A production-ready WhatsApp chatbot for **Nthoppa** — Botswana's financial wellness platform. Built with Node.js + Express using the **Meta WhatsApp Business API**.

---

## 📁 Project Files

```
nthoppa-whatsapp-bot/
├── whatsapp-chatbot.js   ← Complete bot (single file)
├── package.json
├── .env.example          ← Copy to .env and fill in values
├── test-bot.js           ← Local test helper
└── README.md
```

---

## ⚡ Quick Start

### Step 1 — Install dependencies
```bash
npm install
```

### Step 2 — Configure environment
```bash
cp .env.example .env
# Open .env and fill in your tokens (see "Getting API Keys" below)
```

### Step 3 — Start the bot
```bash
npm start
# OR for development with auto-reload:
npm run dev
```

---

## 🔑 Getting Your API Keys

### WhatsApp Business API (Meta)

1. Go to **https://developers.facebook.com**
2. Click **"My Apps"** → **"Create App"**
3. Choose **"Business"** → fill in details
4. In the dashboard, find **"WhatsApp"** and click **"Set up"**
5. You'll find:
   - **Phone Number ID** → copy to `WHATSAPP_PHONE_ID` in `.env`
   - **Temporary Token** (or generate permanent) → copy to `WHATSAPP_TOKEN`

---

## 🌐 Exposing Your Server (for local testing)

Install **ngrok**: https://ngrok.com/download

```bash
# In a new terminal:
ngrok http 3000
```

Copy the HTTPS URL (e.g. `https://abc123.ngrok.io`) — you'll need this for the webhook.

---

## 🔗 Setting Up the WhatsApp Webhook

1. In your Meta App Dashboard → **WhatsApp** → **Configuration**
2. Under **Webhook**, click **"Edit"**
3. Set **Callback URL**: `https://your-ngrok-url.ngrok.io/webhook`
4. Set **Verify Token**: `nthoppa_verify_token_123` (matches your `.env`)
5. Click **"Verify and Save"**
6. Subscribe to **"messages"** webhook field

---

## 🧪 Testing the Bot

### Test via HTTP (no WhatsApp needed):
```bash
curl -X POST http://localhost:3000/test \
  -H "Content-Type: application/json" \
  -d '{"message": "hello"}'

curl -X POST http://localhost:3000/test \
  -H "Content-Type: application/json" \
  -d '{"message": "show me life insurance"}'

curl -X POST http://localhost:3000/test \
  -H "Content-Type: application/json" \
  -d '{"message": "what can i get with 1000 coins"}'
```

### Health check:
```bash
curl http://localhost:3000/health
```

---

## 💬 Customer Interaction Examples

| Customer Message | Bot Response |
|---|---|
| "Hello" / "Dumela" | Welcome message with full menu |
| "What is Nthoppa?" | Company overview + app download links |
| "Show me life insurance" | All 3 life insurance plans with prices & ratings |
| "Compare car insurance" | All 3 car insurance plans |
| "Tell me about Liberty" | Liberty Life Cover details |
| "How do I earn coins?" | Full list of ways to earn Nthoppa Coins |
| "What can I get with 500 coins?" | All rewards achievable with 500 coins |
| "Redeem coins" | Full rewards catalogue (airtime, fuel, DStv, vouchers) |
| "Show education modules" | All 9 financial education modules |
| "Module 3" | Details on Module 3: Saving – Your Safety Net |
| "Loan calculator" | Interest rate guide + link to app |
| "Contact" / "Help" | Phone, email, website, hours |
| "Download app" | Play Store + App Store links |
| "Do you sell buns?" | Polite decline — not a financial topic |
| "What's the weather?" | Polite decline — not a financial topic |
| "Thank you" / "Bye" | Friendly farewell |

---

## 🚀 Deploying to Production

### Option A — Railway (easiest, free tier available)
```bash
# Install Railway CLI
npm i -g @railway/cli
railway login
railway init
railway up
```
Then set environment variables in Railway dashboard.

### Option B — Render
1. Push code to GitHub
2. Go to https://render.com → New Web Service
3. Connect your GitHub repo
4. Set environment variables
5. Deploy

### Option C — Heroku
```bash
heroku create nthoppa-chatbot
heroku config:set WHATSAPP_TOKEN=your_token
heroku config:set WHATSAPP_PHONE_ID=your_id
heroku config:set VERIFY_TOKEN=nthoppa_verify_token_123
git push heroku main
```

After deploying, update the webhook URL in Meta App Dashboard to your production URL.

---

## ✅ What the Bot Can Do

- 🛡️ **Insurance** — List and compare Life, Car, Health, Home insurance with prices & ratings
- 💰 **Loans** — FNB and Standard Bank loan options
- 📈 **Investments** — Allan Gray and Investec fund details
- 🪙 **Coins** — How to earn, and what rewards are available
- 📚 **Education** — All 9 financial education modules
- 🔢 **Calculators** — Loan, savings, investment, emergency fund
- 📲 **App Links** — Play Store and App Store download links
- 📞 **Contact** — Phone, email, website, business hours
- 🚫 **Off-topic handling** — Politely declines non-financial questions

---

## 🔧 Customization

To update the knowledge base (products, prices, coins, etc.), edit the `knowledgeBase` object near the top of `whatsapp-chatbot.js`.

To add new FAQ topics, add entries to the `faqs` array with `keywords` and `response`.

---

*Built for Nthoppa — Financial Wellness in Botswana 🇧🇼*
