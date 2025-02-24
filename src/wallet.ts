import elliptic from "elliptic";
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

}