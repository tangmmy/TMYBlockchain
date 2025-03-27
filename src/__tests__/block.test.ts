import Block from '../block';
import Transaction from '../transaction';
import MerkleTree from '../merkleTree';

describe('Block', () => {
  let mockTransactions: Transaction[];
  let mockMerkleTree: MerkleTree<Transaction>;
  let block: Block;
  
  beforeEach(() => {
    // Create mock transactions
    mockTransactions = [
      new Transaction('sender1', 'recipient1', 100),
      new Transaction('sender2', 'recipient2', 200)
    ];
    
    // Create mock MerkleTree
    mockMerkleTree = new MerkleTree<Transaction>(mockTransactions);
    
    // Create a new block
    block = new Block(
      1,
      Date.now(),
      'previousHash123',
      mockMerkleTree,
      0,
      'minerAddress123'
    );
  });
  
  describe('Construction', () => {
    it('should create a block with correct values', () => {
      expect(block.index).toBe(1);
      expect(block.previousHash).toBe('previousHash123');
      expect(block.minerAddress).toBe('minerAddress123');
      expect(block.nonce).toBe(0);
      expect(block.transactions).toBe(mockMerkleTree);
      expect(block.hash).not.toBe('');
    });
    
    it('should use current timestamp if none provided', () => {
      const now = Date.now();
      const newBlock = new Block(
        2,
        0, // Provide 0 as timestamp
        'prevHash',
        mockMerkleTree,
        0,
        'miner'
      );
      
      // Should be a timestamp close to now
      expect(newBlock.timestamp).toBeGreaterThanOrEqual(now - 100);
      expect(newBlock.timestamp).toBeLessThanOrEqual(now + 100);
    });
  });
  
  describe('Hash calculation', () => {
    it('should calculate a valid hash', () => {
      const originalHash = block.hash;
      const calculatedHash = block.calculateHash();
      
      expect(originalHash).toBe(calculatedHash);
    });
    
    it('should update hash when block properties change', () => {
      const originalHash = block.hash;
      
      // Change a property
      block.nonce = 1;
      
      // Recalculate hash
      const newHash = block.calculateHash();
      
      expect(newHash).not.toBe(originalHash);
      expect(newHash.length).toBe(64); // SHA-256 hash is 64 hex characters
    });
  });
  
  describe('Mining', () => {
    it('should mine a block with specified difficulty', () => {
      const difficulty = 2;
      
      // Mine the block
      block.mineBlock(difficulty);
      
      // Check that the hash starts with the required number of zeros
      expect(block.hash.startsWith('0'.repeat(difficulty))).toBe(true);
      
      // Verify nonce was incremented
      expect(block.nonce).toBeGreaterThan(0);
    });
    
    it('should require more work for higher difficulty', () => {
      // Create two identical blocks
      const block1 = new Block(
        1,
        Date.now(),
        'prevHash',
        mockMerkleTree,
        0,
        'minerAddress'
      );
      
      const block2 = new Block(
        1,
        block1.timestamp,
        'prevHash',
        mockMerkleTree,
        0,
        'minerAddress'
      );
      
      // Mine with different difficulties
      const startTime1 = Date.now();
      block1.mineBlock(1);
      const duration1 = Date.now() - startTime1;
      
      const startTime2 = Date.now();
      block2.mineBlock(2);
      const duration2 = Date.now() - startTime2;
      
      // Higher difficulty should take longer (or at least have a higher nonce)
      // Note: This is probabilistic, but should be true most of the time
      expect(block2.nonce).toBeGreaterThanOrEqual(block1.nonce);
    });
  });
  
  describe('Validation', () => {
    it('should detect if the block has been tampered with', () => {
      // Mine the block
      block.mineBlock(2);
      
      // Should be valid initially
      expect(block.isValid()).toBe(true);
      
      // Tamper with the block
      const originalMinerAddress = block.minerAddress;
      block.minerAddress = 'hacker';
      
      // Should be invalid after tampering (without rehashing)
      expect(block.isValid()).toBe(false);
      
      // Fix the block and verify it's valid again
      block.minerAddress = originalMinerAddress;
      expect(block.isValid()).toBe(true);
    });
  });
});