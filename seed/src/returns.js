// Returns handling for OrderDesk.
//
// A return covers one or more lines of an order. A refund against it must be
// approved by a refunds clerk before any money moves.

/**
 * Open a return request against an order.
 *
 * @param {object} order  the order being returned against
 * @param {Array}  lines  the order lines the customer is sending back
 * @returns {object} the new return request
 */
function openReturn(order, lines) {
  if (lines.length === 0) {
    throw new Error('a return must cover at least one line');
  }

  return {
    orderId: order.id,
    lines,
    raisedAt: new Date().toISOString(),
    approvedBy: null,
    approvedAt: null,
    refundMethod: null,
  };
}

// Preserve both stories: approval needs a meaningful reason and a valid refund method.
function approve(returnRequest, clerkId, reason, refundMethod) {
  if (typeof reason !== 'string' || reason.trim().length === 0) {
    throw new Error('a refund approval must carry a reason');
  }

  if (!['credit', 'cash'].includes(refundMethod)) {
    throw new Error('invalid refund method');
  }

  return {
    ...returnRequest,
    approvedBy: clerkId,
    approvedAt: new Date().toISOString(),
    reason,
    refundMethod,
  };
}

module.exports = { openReturn, approve };