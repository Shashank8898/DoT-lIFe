dotenv.config()
import dotenv from "dotenv"
import { writeFileSync, existsSync } from "fs"
import crypto from "crypto"
import {
  generatePrivateKey,
  privateKeyToAccount
} from "viem/accounts"
import {
  createPublicClient,
  createWalletClient,
  http,
  formatEther,
  parseEther
} from "viem"
import { sepolia } from "viem/chains"


const command = process.argv[2]

if (!command || command === "help") {
  console.log(`
Available Commands:

node wallet.js create <password>
node wallet.js address <password>
node wallet.js balance <password>
node wallet.js send <password> <address> <amount>
node wallet.js help

`)
  process.exit(0)
}

const ALGO = "aes-256-cbc"

function encrypt(text, password) {
  const iv = crypto.randomBytes(16)
  const key = crypto.scryptSync(password, "salt", 32)
  const cipher = crypto.createCipheriv(ALGO, key, iv)

  let encrypted = cipher.update(text, "utf8", "hex")
  encrypted += cipher.final("hex")

  return iv.toString("hex") + ":" + encrypted
}

function decrypt(encryptedText, password) {
  const [ivHex, encrypted] = encryptedText.split(":")
  const iv = Buffer.from(ivHex, "hex")
  const key = crypto.scryptSync(password, "salt", 32)

  const decipher = crypto.createDecipheriv(ALGO, key, iv)

  let decrypted = decipher.update(encrypted, "hex", "utf8")
  decrypted += decipher.final("utf8")

  return decrypted
}

// Wallet Creation
if (command === "create") {
  if (existsSync(".env") && process.env.ENCRYPTED_KEY) {
    console.log("⚠ Wallet already exists")
    process.exit(0)
  }

  const password = process.argv[3]
  if (!password) {
    console.log("Usage: node wallet.js create <password>")
    process.exit(1)
  }

  const privateKey = generatePrivateKey()
  const account = privateKeyToAccount(privateKey)

  const encryptedKey = encrypt(privateKey, password)

  writeFileSync(
    ".env",
    `ENCRYPTED_KEY=${encryptedKey}\nRPC_URL=${process.env.RPC_URL || ""}`
  )

  console.log("Wallet Created")
  console.log("Address:", account.address)
  process.exit(0)
}

// Wallet Checkin
if (!process.env.ENCRYPTED_KEY) {
  console.log(" No wallet found. Run: node wallet.js create <password>")
  process.exit(1)
}

//  PASSWORD REQUIRED 
const password = process.argv[3]
if (!password) {
  console.log(" Password required")
  process.exit(1)
}

let privateKey
try {
  privateKey = decrypt(process.env.ENCRYPTED_KEY, password)
} catch (err) {
  console.log(" Wrong password")
  process.exit(1)
}

const account = privateKeyToAccount(privateKey)

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(process.env.RPC_URL)
})

const walletClient = createWalletClient({
  account,
  chain: sepolia,
  transport: http(process.env.RPC_URL)
})

//  ADDRESS 
if (command === "address") {
  console.log(" Address:", account.address)
}

//  BALANCE 
if (command === "balance") {
  const balance = await publicClient.getBalance({
    address: account.address
  })

  console.log(" Balance:", formatEther(balance), "ETH")
}

//  SEND 
if (command === "send") {
  const to = process.argv[4]
  const amount = process.argv[5]

  if (!to || !amount) {
    console.log("Usage: node wallet.js send <password> <address> <amount>")
    process.exit(1)
  }

  const hash = await walletClient.sendTransaction({
    to,
    value: parseEther(amount)
  })

  console.log("Transaction Sent")
  console.log("Tx Hash:", hash)
}

//  HELP 
if (!command) {
  console.log(`
Available Commands:

node wallet.js create <passworsd>
node wallet.js address <password>
node wallet.js balance <password>
node wallet.js send <password> <address> <amount>

`)
}
