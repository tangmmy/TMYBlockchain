import { timeStamp } from "console";
import Block from "./block";
import Transaction from "./transaction";
import TransactionPool from "./transactionpool";
import MerkleTree from "./merkleTree";
export default class BlockChain{
    public chain : Block[];
    public difficulty : number = 2;

    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
    }

    public createGenesisBlock():Block{
        const genesisBlock = new Block(0, Date.now(), "", new MerkleTree<Transaction>([]), this.difficulty, "");
        genesisBlock.mineBlock(this.difficulty);
        return(genesisBlock);
    }
    public getLatestBlock():Block{
        return this.chain[this.chain.length-1];
    }
    public addNewBlock(newBlock : Block){
        const transactions = newBlock.transactions.getLeaves();
        
        for (const transaction of transactions) {
            if (!transaction.isValid()) return;
        }
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }
    public isValidChain():boolean{
        for(let i = 1; i  < this.chain.length; i++){
            if(this.chain[i-1].hash != this.chain[i].previousHash) return false; 
            if(this.chain[i].calculateHash() != this.chain[i].hash ) return false;
        }
        return true;
    }
    public minePendingTransactions():void{
        const pool : TransactionPool = new TransactionPool();
        const txs : Transaction[] = pool.getTransactions();

    }
};