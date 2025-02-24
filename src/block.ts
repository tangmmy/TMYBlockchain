import crypto from "crypto";
import Transaction from "./transaction";
export default class Block{
    
    constructor(
        public index : number,
        public timestamp : number,
        public previousHash : string ="",
        public transactions : Transaction[],
        public nonce: number = 0,
        public hash : string = "",
    ){
        this.hash = this.calculateHash();
        this.timestamp = this.timestamp || Date.now();
    }
    public calculateHash():string{
        return crypto.createHash("sha256")
                    .update(this.index + this.timestamp + JSON.stringify(this.transactions) + this.previousHash + this.nonce)
                    .digest("hex");
    }
    public mineBlock(difficulty:number):void{
        while(!this.nonce.toString().startsWith("0".repeat(difficulty))){
            this.nonce++;
            this.hash = this.calculateHash();
        }
    }
}

