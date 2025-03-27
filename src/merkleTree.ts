import crypto from "crypto";

/**
 * Represents a node in a Merkle Tree.
 */
class MerkleNode<T> {
  /**
   * Creates a new Merkle node.
   * @param left - Left child node
   * @param right - Right child node
   * @param data - Data to be stored in the node (for leaf nodes)
   */
  constructor(
    public left: MerkleNode<T> | null = null,
    public right: MerkleNode<T> | null = null,
    public data?: T
  ) {
    this.hash = this.calculateHash();
  }

  /**
   * The hash value of this node.
   */
  public readonly hash: string;

  /**
   * Calculates the hash of this node.
   * @returns The hash value as a hex string
   */
  private calculateHash(): string {
    if (this.isLeafNode()) {
      // Leaf node - hash data
      return crypto
        .createHash("sha256")
        .update(JSON.stringify(this.data))
        .digest("hex");
    } else {
      // Internal node - hash concatenated children hashes
      const leftHash = this.left ? this.left.hash : "";
      const rightHash = this.right ? this.right.hash : "";
      return crypto
        .createHash("sha256")
        .update(leftHash + rightHash)
        .digest("hex");
    }
  }

  /**
   * Checks if this node is a leaf node.
   * @returns True if this is a leaf node, false otherwise
   */
  public isLeafNode(): boolean {
    return this.left === null && this.right === null && this.data !== undefined;
  }
}

/**
 * A Merkle Tree implementation.
 */
export default class MerkleTree<T> {
  /**
   * The root node of the tree.
   */
  public readonly root: MerkleNode<T> | null;
  
  /**
   * The original leaf nodes.
   */
  private readonly leaves: MerkleNode<T>[];

  /**
   * Creates a new Merkle Tree from the given data.
   * @param data - Array of data to build the tree from
   */
  constructor(data: T[]) {
    // Create leaf nodes
    this.leaves = data.map(item => new MerkleNode<T>(null, null, item));
    
    if (this.leaves.length === 0) {
      this.root = null;
      return;
    }
    
    this.root = this.buildTree(this.leaves);
  }

  /**
   * Builds the Merkle Tree from leaf nodes.
   * @param nodes - Leaf nodes to build the tree from
   * @returns The root node of the built tree
   */
  private buildTree(nodes: MerkleNode<T>[]): MerkleNode<T> {
    if (nodes.length === 0) {
      throw new Error("Cannot build tree with empty nodes");
    }
    
    if (nodes.length === 1) {
      return nodes[0];
    }

    const parentNodes: MerkleNode<T>[] = [];

    // Process nodes two at a time to create parent nodes
    for (let i = 0; i < nodes.length; i += 2) {
      const left = nodes[i];
      // If we have an odd number of nodes, duplicate the last one
      const right = i + 1 < nodes.length ? nodes[i + 1] : nodes[i];
      
      // Create a parent node with two children but no data
      parentNodes.push(new MerkleNode<T>(left, right));
    }

    // Recursively build the tree
    return this.buildTree(parentNodes);
  }

  /**
   * Gets the root hash of the Merkle Tree.
   * @returns The root hash as a hex string, or empty string if the tree is empty
   */
  public getRootHash(): string {
    return this.root ? this.root.hash : "";
  }

  /**
   * Verifies if the given data exists in the tree using a proof.
   * @param data - The data to verify
   * @param proof - Array of hashes forming the proof
   * @param index - Index of the data in the original array
   * @returns True if the data is verified, false otherwise
   */
  public verify(data: T, proof: string[], index: number): boolean {
    if (!this.root || index < 0 || index >= this.leaves.length) {
      return false;
    }
    
    // Calculate the hash of the data
    let dataHash = crypto
      .createHash("sha256")
      .update(JSON.stringify(data))
      .digest("hex");
    
    // Compare with the hash in the tree as a basic check
    if (dataHash !== this.leaves[index].hash) {
      return false;
    }
    
    let currentHash = dataHash;
    let currentIndex = index;
    
    // Apply each proof hash
    for (const proofHash of proof) {
      // Determine if we're computing a left or right node
      if (currentIndex % 2 === 0) {
        // Even index - we're on the left, combine with right sibling
        currentHash = crypto
          .createHash("sha256")
          .update(currentHash + proofHash)
          .digest("hex");
      } else {
        // Odd index - we're on the right, combine with left sibling
        currentHash = crypto
          .createHash("sha256")
          .update(proofHash + currentHash)
          .digest("hex");
      }
      
      // Move up the tree
      currentIndex = Math.floor(currentIndex / 2);
    }
    
    // Final hash should match the root hash
    return currentHash === this.getRootHash();
  }

  /**
   * Generates a proof for the data at the given index.
   * @param index - Index of the data in the original array
   * @returns Array of hashes forming the proof
   */
  public getProof(index: number): string[] {
    if (!this.root || index < 0 || index >= this.leaves.length) {
      return [];
    }
    
    const proof: string[] = [];
    let currentIndex = index;
    let currentLevelNodes = [...this.leaves];
    
    while (currentLevelNodes.length > 1) {
      const sibling = this.getSibling(currentLevelNodes, currentIndex);
      if (sibling) {
        proof.push(sibling.hash);
      }
      
      // Prepare for next level up
      const nextLevelNodes: MerkleNode<T>[] = [];
      for (let i = 0; i < currentLevelNodes.length; i += 2) {
        const left = currentLevelNodes[i];
        const right = i + 1 < currentLevelNodes.length ? currentLevelNodes[i + 1] : currentLevelNodes[i];
        nextLevelNodes.push(new MerkleNode<T>(left, right));
      }
      
      currentLevelNodes = nextLevelNodes;
      currentIndex = Math.floor(currentIndex / 2);
    }
    
    return proof;
  }

  /**
   * Gets the sibling node at the given index in the current level.
   * @param nodes - Array of nodes at the current level
   * @param index - Index of the node whose sibling we want
   * @returns The sibling node or null if no sibling exists
   */
  private getSibling(nodes: MerkleNode<T>[], index: number): MerkleNode<T> | null {
    if (index < 0 || index >= nodes.length) {
      return null;
    }
    
    if (index % 2 === 0) {
      // Even index - get right sibling if it exists
      return index + 1 < nodes.length ? nodes[index + 1] : nodes[index];
    } else {
      // Odd index - get left sibling
      return nodes[index - 1];
    }
  }

  /**
   * Gets the number of leaf nodes in the tree.
   * @returns The number of leaf nodes
   */
  public getLeafCount(): number {
    return this.leaves.length;
  }

  public getLeaves():any {
    return this.leaves;
  }
}