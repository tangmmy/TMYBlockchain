import crypto from "crypto";
import elliptic from "elliptic";
const EC = new elliptic.ec("secp256k1");
export default class Transaction{
    public sender : string;
    public receiver : string;
    public amount : number;
    public timestamp : number;
    public signature: string | null = null;
    public hash:string = "";
    constructor(sender:string,receiver:string,amount:number){
        this.sender = sender;
        this.receiver = receiver;
        this.amount = amount;
        this.timestamp = Date.now();
        this.hash = this.calculateHash();
    }
    public calculateHash():string{
            return crypto.createHash("sha256")
                        .update(this.sender + this.receiver + this.amount + this.timestamp )
                        .digest("hex");
    }
    public signTransaction(privateKey:string):void{
        const keyPair = EC.keyFromPrivate(privateKey,"hex");
        if(keyPair.getPublic("hex")!= this.sender)
            throw new Error("cannot sign")
        const signature = keyPair.sign(this.hash,"hex");
        this.signature = signature.toDER("hex");
    }

    public isValid():boolean{
        if(!this.signature || this.sender== "System") return true;//reward

        const publicKey = EC.keyFromPublic(this.sender,"hex");
        return publicKey.verify(this.hash,this.signature);

    }



}