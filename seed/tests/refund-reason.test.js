const assert = require('node:assert/strict');
const { approve } = require('../src/returns');

const returnRequest = {
    orderId: 'ORDER-001',
    approvedBy: null,
    approvedAt: null,
};

for (const reason of [undefined, null, '', '   ', '\t\n', 123]) {
    assert.throws(
        () => approve(returnRequest, 'CLERK-001', reason),
        { message: 'a refund approval must carry a reason' }
    );
}

const approved = approve(
    returnRequest,
    'CLERK-001',
    'The item was damaged'
);

assert.equal(approved.reason, 'The item was damaged');
assert.equal(approved.approvedBy, 'CLERK-001');
assert.equal(approved.orderId, 'ORDER-001');
assert.ok(Number.isFinite(Date.parse(approved.approvedAt)));

assert.equal(returnRequest.approvedBy, null);
assert.equal(returnRequest.approvedAt, null);

console.log('All refund reason tests passed.');