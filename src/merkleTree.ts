import crypto from "crypto";
class MerkleNode{
    public left : MerkleNode;
    public right : MerkleNode;
    public data : any;
    public hash : string;
    constructor(left: MerkleNode, right:MerkleNode, data:any,hash:string){
        this.left = left;
        this.right = right;
        this.data = data;
        this.hash = this.calculateHash(this);
    }
    private calculateHash(node : MerkleNode): string{
        if(node.data == null){
            return crypto.createHash("sha256")
                                .update( JSON.stringify(this.left)+JSON.stringify(this.right))
                                .digest("hex");
        }
        else{
            return crypto.createHash("sha256")
                                .update( JSON.stringify(this.data) + JSON.stringify(this.left)+JSON.stringify(this.right))
                                .digest("hex");
        }
    }

}
export default class MerkleTree{
    public root : MerkleNode;
    constructor(root:MerkleNode){
        this.root = root;
    }
}