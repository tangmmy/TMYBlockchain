import BlockChain from "../blockchain";
import Block from "../block";
import Transaction from "../transaction";
describe("Blockchain", () => {
    let blockchain: BlockChain;
    const transaction = new Transaction("sender","receiver",100);
    const transactions = Array.from({ length: 100 }, () => transaction);
    beforeEach(() => {
        blockchain = new BlockChain();
    });

    it("should start with the genesis block", () => {
        expect(blockchain.chain.length).toBe(1);
        expect(blockchain.chain[0].previousHash).toBe("0");
    });

    it("should add new blocks", () => {
        const newBlock = new Block(1, Date.now(), blockchain.getLatestBlock().hash, transactions, 0);
        blockchain.addNewBlock(newBlock);
        expect(blockchain.chain.length).toBe(2);
        expect(blockchain.getLatestBlock().previousHash).toBe(blockchain.chain[0].hash);
    });

    it("should validate a correct chain", () => {
        blockchain.addNewBlock(new Block(1, Date.now(), blockchain.getLatestBlock().hash, transactions, 0));
        expect(blockchain.isValidChain()).toBe(true);
    });

    it("should detect an invalid chain", () => {
        blockchain.addNewBlock(new Block(1, Date.now(), blockchain.getLatestBlock().hash, transactions, 0));
        blockchain.chain[1].transactions = transactions; // Tampered data
        expect(blockchain.isValidChain()).toBe(false);
    });
});
