import MerkleTree from '../merkleTree';
import crypto from 'crypto';

describe('MerkleTree', () => {
  describe('Basic functionality', () => {
    it('should create an empty tree', () => {
      const tree = new MerkleTree<string>([]);
      expect(tree.root).toBeNull();
      expect(tree.getRootHash()).toBe('');
    });

    it('should create a tree with a single node', () => {
      const data = ['data1'];
      const tree = new MerkleTree<string>(data);
      
      expect(tree.root).not.toBeNull();
      expect(tree.getRootHash()).not.toBe('');
      
      // Verify the hash matches what we expect
      const expectedHash = crypto
        .createHash('sha256')
        .update(JSON.stringify('data1'))
        .digest('hex');
      expect(tree.getRootHash()).toBe(expectedHash);
    });

    it('should create a tree with multiple nodes', () => {
      const data = ['data1', 'data2', 'data3', 'data4'];
      const tree = new MerkleTree<string>(data);
      
      expect(tree.root).not.toBeNull();
      expect(tree.getRootHash()).not.toBe('');
    });
  });

  describe('Hash verification', () => {
    it('should correctly calculate leaf node hashes', () => {
      const data = 'test data';
      const expectedHash = crypto
        .createHash('sha256')
        .update(JSON.stringify(data))
        .digest('hex');
      
      const tree = new MerkleTree<string>([data]);
      expect(tree.getRootHash()).toBe(expectedHash);
    });

    it('should correctly calculate parent node hashes', () => {
      const data = ['data1', 'data2'];
      const tree = new MerkleTree<string>(data);
      
      // Calculate the expected hash manually
      const hash1 = crypto
        .createHash('sha256')
        .update(JSON.stringify('data1'))
        .digest('hex');
      
      const hash2 = crypto
        .createHash('sha256')
        .update(JSON.stringify('data2'))
        .digest('hex');
      
      const expectedRootHash = crypto
        .createHash('sha256')
        .update(hash1 + hash2)
        .digest('hex');
      
      expect(tree.getRootHash()).toBe(expectedRootHash);
    });
  });

  describe('Proof and verification', () => {
    it('should generate valid proofs', () => {
      const data = ['a', 'b', 'c', 'd'];
      const tree = new MerkleTree<string>(data);
      
      // Get proof for index 1 ('b')
      const proof = tree.getProof(1);
      // For a 4-leaf tree, we need log2(4) = 2 levels of proof
      expect(proof.length).toBe(2); 
      
      // Verify the proof
      const isValid = tree.verify('b', proof, 1);
      expect(isValid).toBe(true);
    });

    it('should reject invalid data', () => {
      const data = ['a', 'b', 'c', 'd'];
      const tree = new MerkleTree<string>(data);
      
      // Get proof for index 1 ('b')
      const proof = tree.getProof(1);
      
      // Try to verify 'x' with the proof for 'b'
      const isValid = tree.verify('x', proof, 1);
      expect(isValid).toBe(false);
    });

    it('should reject tampered proofs', () => {
      const data = ['a', 'b', 'c', 'd'];
      const tree = new MerkleTree<string>(data);
      
      // Get proof for index 1 ('b')
      const proof = tree.getProof(1);
      
      // Tamper with the proof
      if (proof.length > 0) {
        const tamperedProof = [...proof];
        tamperedProof[0] = 'invalid_hash';
        
        const isValid = tree.verify('b', tamperedProof, 1);
        expect(isValid).toBe(false);
      } else {
        // Skip this test if proof is empty (which shouldn't happen)
        console.warn('Empty proof generated, skipping tampered proof test');
      }
    });
  });

  describe('Edge cases', () => {
    it('should handle odd number of nodes by duplicating last node', () => {
      const data = ['a', 'b', 'c'];
      const tree = new MerkleTree<string>(data);
      
      // Get proofs for all indices
      const proofA = tree.getProof(0);
      const proofB = tree.getProof(1);
      const proofC = tree.getProof(2);
      
      // Verify all proofs work
      expect(tree.verify('a', proofA, 0)).toBe(true);
      expect(tree.verify('b', proofB, 1)).toBe(true);
      expect(tree.verify('c', proofC, 2)).toBe(true);
    });

    it('should handle complex data types', () => {
      interface ComplexData {
        id: number;
        name: string;
        metadata: {
          created: string;
          tags: string[];
        };
      }
      
      const data: ComplexData[] = [
        { 
          id: 1, 
          name: 'item1', 
          metadata: { 
            created: '2023-01-01', 
            tags: ['important', 'urgent'] 
          } 
        },
        { 
          id: 2, 
          name: 'item2', 
          metadata: { 
            created: '2023-01-02', 
            tags: ['normal'] 
          } 
        }
      ];
      
      const tree = new MerkleTree<ComplexData>(data);
      expect(tree.getRootHash()).not.toBe('');
      
      const proof = tree.getProof(0);
      expect(tree.verify(data[0], proof, 0)).toBe(true);
    });
  });
});