import  Transaction  from "./transaction";

export default class TransactionPool{
    private static transactions : Transaction[] = [];
    constructor(){
        TransactionPool.transactions = [];
    }


    public addTransaction(transaction: Transaction): boolean {//Adds a transaction to the pool.
        if(!transaction.isValid()) return false;
        if(TransactionPool.transactions.find(tx=>tx.hash == transaction.hash)) return false;
        TransactionPool.transactions.push(transaction);
        return true;
    }
    
    public getTransactions(): Transaction[]{//Retrieves all pending transactions.
        return TransactionPool.transactions;
    }

    public  clearPool():void {//Clears transactions once they are mined.
        TransactionPool.transactions=[];
    }
}