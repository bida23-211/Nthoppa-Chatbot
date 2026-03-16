# 🌿 Nthoppa WhatsApp Chatbot

> **Financial Wellness Platform — Botswana 🇧🇼**  
> An automated WhatsApp customer service bot that helps customers learn about Nthoppa's financial products and services instantly, 24/7.

---

## 📱 What It Does

Customers can WhatsApp the Nthoppa number and instantly get answers about:

- 🛡️ **Insurance** — Life, Car, Health, Home plans with prices & ratings
- 💰 **Loans** — Personal loan options with amounts and interest rates
- 📈 **Investments** — Investment funds and expected returns
- 🪙 **Nthoppa Coins** — How to earn loyalty coins and redeem rewards
- 📚 **Financial Education** — 9 free financial literacy modules
- 🔢 **Calculators** — Loan, savings, investment & emergency fund tools
- 📲 **App Download** — Links to download the Nthoppa Android app
- 📞 **Contact Info** — Phone, email, website and business hours

---

## 🛠️ Built With

| Technology | Purpose |
|---|---|
| **Node.js** | JavaScript runtime that powers the bot |
| **Express.js** | Web server that handles incoming/outgoing messages |
| **Twilio** | Connects the bot to WhatsApp |
| **Render.com** | Cloud hosting — keeps the bot running 24/7 |
| **GitHub** | Code storage and version control |

---

## 🚀 Live Bot

| Detail | Value |
|---|---|
| **Bot URL** | https://nthoppa-chatbot.onrender.com |
| **Webhook** | https://nthoppa-chatbot.onrender.com/webhook |
| **Health Check** | https://nthoppa-chatbot.onrender.com/health |
| **Platform** | Twilio WhatsApp Sandbox |
| **Hosting** | Render.com (Free Tier) |

---

## 📁 Project Files

```
Nthoppa-Chatbot/
├── nthoppa-twilio-bot.js   ← Complete bot (single file)
├── package.json            ← Dependencies & start script
├── package-lock.json       ← Auto-generated, do not edit manually
└── README.md               ← You are here
```

---

## ⚡ Quick Start (Local)

### 1. Clone the repository
```bash
git clone https://github.com/bida23-211/Nthoppa-Chatbot.git
cd Nthoppa-Chatbot
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create your `.env` file
```
PORT=3000
```

### 4. Start the bot
```bash
npm start
```

You should see:
```
🌿 NTHOPPA WhatsApp Bot v2.0 — RUNNING
🔗 Webhook : POST http://localhost:3000/webhook
❤️  Health  : GET  http://localhost:3000/health
🧪 Test    : POST http://localhost:3000/test
```

### 5. Test the bot (no WhatsApp needed)
```bash
curl -X POST http://localhost:3000/test \
  -H "Content-Type: application/json" \
  -d '{"message": "hello"}'
```

---

## 🌐 Deployment (Render.com)

1. Push code to this GitHub repository
2. Go to [render.com](https://render.com) and open **Nthoppa-Chatbot**
3. Render automatically detects the push and redeploys
4. Wait ~2 minutes for the deploy to complete
5. Confirm in logs: `🌿 NTHOPPA WhatsApp Bot v2.0 — RUNNING`

### Environment Variables on Render
| Key | Value |
|---|---|
| `PORT` | `3000` |

---

## 📲 Twilio Webhook Setup

1. Log in to [console.twilio.com](https://console.twilio.com)
2. Go to **Messaging → Try it out → Send a WhatsApp message**
3. Click the **Sandbox settings** tab
4. Set **"When a message comes in"** to:
```
https://nthoppa-chatbot.onrender.com/webhook
```
5. Method: **HTTP POST**
6. Click **Save**

---

## 🧪 Testing

### Test without WhatsApp
```bash
# Greeting
curl -X POST http://localhost:3000/test \
  -H "Content-Type: application/json" \
  -d '{"message": "hello"}'

# Life insurance
curl -X POST http://localhost:3000/test \
  -H "Content-Type: application/json" \
  -d '{"message": "life insurance"}'

# Coin calculator
curl -X POST http://localhost:3000/test \
  -H "Content-Type: application/json" \
  -d '{"message": "what can I get with 1000 coins"}'

# Off-topic test
curl -X POST http://localhost:3000/test \
  -H "Content-Type: application/json" \
  -d '{"message": "do you sell buns"}'
```

### Test on WhatsApp (Sandbox)
Each tester must first send the Twilio join code:
```
Send to:  +1 415 523 8886
Message:  join <your-sandbox-code>
```
Then send any message to start chatting.

---

## 💬 Supported Commands

| Customer Says | Bot Response |
|---|---|
| `hello` / `hi` / `dumela` | Welcome menu |
| `life insurance` | All life insurance plans |
| `car insurance` | All car insurance plans |
| `health insurance` | All health insurance plans |
| `home insurance` | All home insurance plans |
| `loans` | Loan options with rates & limits |
| `investments` | Investment fund options |
| `earn coins` | How to earn Nthoppa Coins |
| `redeem` | Full rewards catalogue |
| `1000 coins` | What you can get with 1000 coins |
| `education` | All 9 financial modules |
| `module 3` | Details on Module 3 |
| `download app` | Google Play download link |
| `calculators` | Financial calculator guide |
| `contact` | Phone, email, website, hours |
| `do you sell buns` | Polite off-topic decline 😄 |
| `bye` / `thank you` | Friendly farewell |

---

## 📞 Nthoppa Contact Details

| Channel | Details |
|---|---|
| 📱 Phone | +267 75 736 600 |
| 📧 Email | info@nthoppa.co.bw |
| 🌐 Website | https://www.nthoppa.com/ |
| 📲 Android App | [Download on Google Play](https://play.google.com/store/search?q=nthoppa&c=apps&hl=en) |

> 🍎 **iOS / App Store:** Coming soon!

---

## ⚠️ Known Limitations

- **Render free tier sleeps** after 15 minutes of no activity — first message after sleep takes 30–60 seconds. Fix with [UptimeRobot](https://uptimerobot.com) (free).
- **Twilio sandbox** requires a join code for each new tester. Not needed on a live WhatsApp number.
- Bot uses **keyword matching** — not full AI/NLP understanding.

---

## 🔮 Planned Improvements

- [ ] Migrate to Meta WhatsApp Business API (free) using Nthoppa's own number (+267 75 736 600)
- [ ] Set up UptimeRobot to prevent Render sleep
- [ ] Connect knowledge base to a live database for easy content updates
- [ ] Add conversation memory for multi-turn context
- [ ] AI-powered natural language understanding

---

*Built with 💚 for Nthoppa — Stay Financially Well, Botswana!*
