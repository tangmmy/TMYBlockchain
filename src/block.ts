import crypto from "crypto";
import Transaction from "./transaction";
import MerkleTree from "./merkleTree";
export default class Block{
    
    constructor(
        public index : number,
        public timestamp : number,
        public previousHash : string ="",
        public transactions : MerkleTree<Transaction>,
        public nonce: number = 0,
        public minerAddress: string,
        public hash : string = "",
    ){
        this.hash = this.calculateHash();
        this.timestamp = this.timestamp || Date.now();
    }
    public calculateHash():string{
        return crypto.createHash("sha256")
                    .update(this.index + this.timestamp + this.transactions.getRootHash() + this.minerAddress+this.previousHash + this.nonce)
                    .digest("hex");
    }
    public mineBlock(difficulty: number): void {
        const target = "0".repeat(difficulty);
        while (!this.hash.startsWith(target)) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
    }
    public isValid():boolean{
        return this.hash === this.calculateHash();
    }
}

