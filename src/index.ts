import crypto from "crypto";
import elliptic from "elliptic";
const EC = new elliptic.ec("secp256k1");
import Transaction from "./transaction";

const keyPair = EC.genKeyPair();
const privateKey = keyPair.getPrivate("hex");
const publicKey = keyPair.getPublic("hex");

const tx = new Transaction(publicKey, "receiver-public-key", 10);
tx.signTransaction(privateKey);

console.log("Transaction Valid?", tx.isValid()); // Should return true
console.log("Transaction Data:", tx);