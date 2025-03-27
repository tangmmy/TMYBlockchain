import  WebSocket  , { WebSocketServer } from "ws";
import BlockChain from "./blockchain";
import Block from "./block";

export default class P2PNetwork{
    private sockets: WebSocket[] =[];
    private blockchain: BlockChain;


    constructor(blockchain:BlockChain){
        this.blockchain = blockchain;
    }


    public startServer(port:number):void{
        const server = new WebSocketServer({port});
        server.on("connection",(socket)=>this.handleConnection(socket));
        console.log("P2P server started");
    }

    public connectionToPeer(peerUrl:string):void{
        const socket = new WebSocket(peerUrl);
        socket.on("open",()=>this.handleConnection(socket));
    }

    private handleConnection(socket:WebSocket) : void{
        this.sockets.push(socket);
        console.log("New peer connected");
        socket.on("message",(message)=>this.handleMessage(message));
        socket.send(JSON.stringify(this.blockchain.chain));
    }
    private handleMessage(message:string):void{
        const data = JSON.parse(message);
        if(Array.isArray(data)){
            this.syncBlockchain(data);
        }
        else if(data.type == "NEW_TRANSACTION"){
            this.blockchain.addTransaction(data.transaction);

        }
    }

    public broadcastBlock(block:Block):void{
        this.sockets.forEach((socket)=>
            socket.send(JSON.stringify({type:"NEW_BLOCK",block}))
        );
    }

}