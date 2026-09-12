const assert = require('node:assert/strict');
const { openReturn, approve } = require('../src/returns');

const lines = [{ productId: 'PRODUCT-001', quantity: 1 }];
const returnRequest = openReturn({ id: 'ORDER-001' }, lines);

assert.equal(returnRequest.refundMethod, null);

const originalRequest = JSON.parse(JSON.stringify(returnRequest));

// Invalid reasons must be rejected with either valid refund method.
for (const method of ['credit', 'cash']) {
    for (const reason of [undefined, null, '', '   ', '\t\n', 123]) {
        assert.throws(
            () => approve(returnRequest, 'CLERK-001', reason, method),
            { message: 'a refund approval must carry a reason' }
        );
    }
}

// Invalid refund methods must be rejected even with a valid reason.
for (const method of [undefined, null, '', 'bank', 'CASH', 123]) {
    assert.throws(
        () => approve(
            returnRequest,
            'CLERK-001',
            'The item was damaged',
            method
        ),
        { message: 'invalid refund method' }
    );
}

// Both supported methods must work with a valid reason.
for (const method of ['credit', 'cash']) {
    const approved = approve(
        returnRequest,
        'CLERK-001',
        'The item was damaged',
        method
    );

    assert.equal(approved.reason, 'The item was damaged');
    assert.equal(approved.refundMethod, method);
    assert.equal(approved.approvedBy, 'CLERK-001');
    assert.equal(approved.orderId, 'ORDER-001');
    assert.deepEqual(approved.lines, lines);
    assert.ok(Number.isFinite(Date.parse(approved.approvedAt)));
}

// Approval attempts must not change the original request.
assert.deepEqual(returnRequest, originalRequest);

console.log('All refund reason and method tests passed.');