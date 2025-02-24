# TMY Blockchain

A simple blockchain implementation in TypeScript, featuring transaction validation, mining, and proof-of-work.

## 📌 Features
- **Blocks & Blockchain**: Each block stores transactions, a hash, and a reference to the previous block.
- **Proof-of-Work (PoW)**: Mining requires solving a cryptographic puzzle.
- **Transactions**: Users can sign transactions using public/private key cryptography.
- **Transaction Pool**: Pending transactions are stored before being mined.
- **Wallet System**: Users can check their balance.

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v16+ recommended)
- TypeScript

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/tangmmy/TMYBlockChain.git
cd TMYBlockChain
```

### 2️⃣ Install Dependencies
```sh
npm install
```

### 3️⃣ Compile TypeScript
```sh
npm run build
```

### 4️⃣ Run Tests
```sh
npm test
```

---

## 🏗️ Project Structure
```
TMYBlockChain/
│── src/
│   ├── Block.ts            # Block structure and hashing logic
│   ├── Blockchain.ts       # Blockchain logic
│   ├── Transaction.ts      # Transaction logic
│   ├── TransactionPool.ts  # Pool for unconfirmed transactions
│── __tests__/              # Unit tests
│── package.json
│── tsconfig.json
│── README.md
```

---

## 🚀 Usage

### Create a New Blockchain
```ts
import Blockchain from "./src/Blockchain";

const myChain = new Blockchain();
console.log("Genesis Block:", myChain.getLatestBlock());
```

### Create and Add a Transaction
```ts
import Transaction from "./src/Transaction";
import TransactionPool from "./src/TransactionPool";

const transaction = new Transaction("Alice", "Bob", 50);
transaction.signTransaction(alicePrivateKey);

const pool = new TransactionPool();
pool.addTransaction(transaction);
```

### Mine Pending Transactions
```ts
myChain.minePendingTransactions("MinerWalletAddress");
```

### Check Balance
```ts
const balance = myChain.getBalance("Bob");
console.log("Bob's Balance:", balance);
```

---

## 🔥 Future Improvements
- **Networking**: Implement peer-to-peer communication.
- **Smart Contracts**: Allow execution of custom code on the blockchain.
- **More Efficient Storage**: Use Merkle Trees for transactions.

---

## 📜 License
This project is licensed under the MIT License.

