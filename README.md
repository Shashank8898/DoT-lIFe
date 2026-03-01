# 💼 Dot-Life Wallet CLI

A simple command-line wallet application built with Node.js.

This project allows you to create and manage wallets directly from your terminal.

---

## 🚀 Features

- Create wallets
- Store wallet data locally
- Simple CLI-based interaction
- Environment variable support
- JSON-based storage

---

## 📦 Installation

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/Dot-Life.git
cd Dot-Life/Wallet

Install dependencies:

npm install
🔐 Environment Setup

Create a .env file in the Wallet directory:

touch .env

Add required variables:

SECRET_KEY=your_secret_key_here

⚠️ Make sure .env is listed in .gitignore.

🛠 Usage

Run commands using:

node wallet.js <command> [options]
📖 Commands
Create Wallet
node wallet.js create <walletName> <ownerName>

Example:

node wallet.js create main Shashank
View Wallet
node wallet.js view <walletName>
List Wallets
node wallet.js list
Delete Wallet
node wallet.js delete <walletName>
Help Command
node wallet.js help

Displays all available commands.

📁 Project Structure
Wallet/
│
├── wallet.js
├── wallet.json
├── package.json
├── .env
├── .gitignore
└── node_modules/
🧠 How It Works

Wallets are stored in wallet.json

Environment variables are loaded from .env

CLI arguments are processed using process.argv

⚠️ Security Notice

This is a learning project.

Do NOT use this wallet for storing real cryptocurrency or sensitive production secrets.

🏗 Built With

Node.js

dotenv

Native File System (fs)

📌 Future Improvements

Password hashing

Encryption for wallet data

Database integration

Better CLI UX

Unit tests

👨‍💻 Author

Shashank

📄 License

MIT


---

If you want, I can:

- Make it more professional
- Make it more minimal
- Add badges
- Add screenshots section
- Or make it recruiter-ready 😏

What vibe are you going for — clean student project or polished portfolio piece?
