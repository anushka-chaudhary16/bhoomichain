const crypto = require('crypto');

function calculateHash(index, timestamp, previousHash, transactions, nonce) {
  const data = index + timestamp + previousHash + JSON.stringify(transactions) + nonce;
  return crypto.createHash('sha256').update(data).digest('hex');
}

function mineBlock(previousBlock, transactions, difficulty = 3) {
  const index = previousBlock.index + 1;
  const timestamp = Date.now();
  const previousHash = previousBlock.hash;
  let nonce = 0;
  let hash = calculateHash(index, timestamp, previousHash, transactions, nonce);

  // Simple Proof of Work simulation
  while (hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
    nonce++;
    hash = calculateHash(index, timestamp, previousHash, transactions, nonce);
  }

  return {
    index,
    timestamp,
    previousHash,
    hash,
    nonce,
    transactions
  };
}

function validateChain(blocks) {
  for (let i = 1; i < blocks.length; i++) {
    const currentBlock = blocks[i];
    const previousBlock = blocks[i - 1];

    if (currentBlock.previousHash !== previousBlock.hash) {
      return false;
    }

    const calculatedHash = calculateHash(
      currentBlock.index,
      currentBlock.timestamp,
      currentBlock.previousHash,
      currentBlock.transactions,
      currentBlock.nonce
    );

    if (currentBlock.hash !== calculatedHash) {
      return false;
    }
  }
  return true;
}

module.exports = {
  calculateHash,
  mineBlock,
  validateChain
};
