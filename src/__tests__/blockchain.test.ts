import Block from '../block';
import Transaction from '../transaction';
import BlockChain from '../blockchain';
import MerkleTree from '../merkleTree';

describe('BlockChain', () => {
  let blockchain: BlockChain;

  beforeEach(() => {
    blockchain = new BlockChain();
  });

  describe('Constructor', () => {
    it('should create a blockchain with a genesis block', () => {
      expect(blockchain.chain.length).toBe(1);
      expect(blockchain.chain[0].index).toBe(0);
    });

    it('should set default difficulty', () => {
      expect(blockchain.difficulty).toBe(2);
    });
  });

  describe('getLatestBlock', () => {
    it('should return the last block in the chain', () => {
      const latestBlock = blockchain.getLatestBlock();
      expect(latestBlock).toBe(blockchain.chain[blockchain.chain.length - 1]);
    });
  });

  describe('addNewBlock', () => {
    it('should add a new valid block to the chain', () => {
      // Create a block with valid transactions
      const mockTransaction = new Transaction(
        'sender', 
        'recipient', 
        100
      );
      mockTransaction.signTransaction('privateKey'); // Assuming sign method exists

      const newBlock = new Block(
        1, 
        Date.now(), 
        blockchain.getLatestBlock().hash, 
        new MerkleTree<Transaction>([mockTransaction]), 
        blockchain.difficulty, 
        ''
      );

      const initialLength = blockchain.chain.length;
      blockchain.addNewBlock(newBlock);

      expect(blockchain.chain.length).toBe(initialLength + 1);
      expect(blockchain.chain[blockchain.chain.length - 1]).toBe(newBlock);
    });

    it('should not add a block with invalid transactions', () => {
      // Create a block with an invalid transaction
      const mockTransaction = new Transaction(
        'sender', 
        'recipient', 
        100
      );
      // Do not sign the transaction to make it invalid

      const newBlock = new Block(
        1, 
        Date.now(), 
        blockchain.getLatestBlock().hash, 
        new MerkleTree<Transaction>([mockTransaction]), 
        blockchain.difficulty, 
        ''
      );

      const initialLength = blockchain.chain.length;
      blockchain.addNewBlock(newBlock);

      expect(blockchain.chain.length).toBe(initialLength);
    });
  });

  describe('isValidChain', () => {
    it('should return true for a valid blockchain', () => {
      // Add a block to the chain
      const mockTransaction = new Transaction(
        'sender', 
        'recipient', 
        100
      );
      mockTransaction.signTransaction('privateKey');

      const newBlock = new Block(
        1, 
        Date.now(), 
        blockchain.getLatestBlock().hash, 
        new MerkleTree<Transaction>([mockTransaction]), 
        blockchain.difficulty, 
        ''
      );
      blockchain.addNewBlock(newBlock);

      expect(blockchain.isValidChain()).toBe(true);
    });

    it('should return false if block hashes are tampered', () => {
      // Manually tamper with a block's hash
      blockchain.chain[1].hash = 'tampered-hash';
      expect(blockchain.isValidChain()).toBe(false);
    });
  });
});