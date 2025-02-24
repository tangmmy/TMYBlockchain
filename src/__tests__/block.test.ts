import Block from "../block";
import Transaction from "../transaction";

describe("Block", () => {
    const transaction = new Transaction("sender","receiver",100);
    const transactions = Array.from({ length: 100 }, () => transaction);

    it("should correctly calculate hash", () => {
      const block = new Block(1, Date.now(), "prevHash", transactions, 0);
        expect(block.hash).toBe(block.calculateHash());
    });

    it("should change hash when nonce changes", () => {
      const block = new Block(1, Date.now(), "prevHash", transactions, 0);
        const oldHash = block.hash;
        block.nonce++;
        expect(block.calculateHash()).not.toBe(oldHash);
    });
});
