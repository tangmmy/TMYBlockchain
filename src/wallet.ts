import elliptic from "elliptic";
import Transaction from "./transaction";
export default class Wallet{
    private publicKey: string;
    private privateKey: string; 
    constructor(){
            const EC = new elliptic.ec("secp256k1"); // Bitcoin & Ethereum use secp256k1
            const keyPair = EC.genKeyPair(); 
            this.privateKey = keyPair.getPrivate("hex");
            this.publicKey = keyPair.getPublic("hex");
    }
    public getPublicKey():string{
        return this.publicKey;
    }
    private createTramsactopm(receiver:string, amount:number):Transaction{
        const tx = new Transaction(this.getPublicKey(),receiver,amount);
        tx.signTransaction(this.privateKey);
        return tx;
    }

}