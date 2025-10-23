# Sales Returns Guide - Full & Partial Returns with Notes

**Date**: 2025-10-23
**Status**: ✅ FULLY IMPLEMENTED

---

## ✅ YES - Your Store CAN Do All Of This:

1. ✅ **Add Products** - Unlimited, anytime
2. ✅ **Process Sales** - POS ready with 10 customers
3. ✅ **Handle Returns** - Full & partial with notes
4. ✅ **Return Notes** - Customer & internal notes supported

---

## 🔄 Complete Returns System

### Return Types Supported

1. **REFUND** - Money back (full or partial)
2. **REPLACEMENT** - Same product, new unit
3. **EXCHANGE** - Different product
4. **STORE_CREDIT** - Credit for future purchases

### Return Reasons Available

| Reason | Restocking Fee? |
|--------|-----------------|
| DEFECTIVE | ❌ No |
| WRONG_ITEM | ❌ No |
| NOT_AS_DESCRIBED | ❌ No |
| QUALITY_ISSUE | ❌ No |
| CHANGED_MIND | ✅ Yes (5%) |
| SIZE_ISSUE | ✅ Maybe |
| LATE_DELIVERY | ❌ No |
| OTHER | ✅ Case by case |

---

## 📝 Return Workflow

### Step 1: Create Return Request

**Location**: `/api/returns` (POST)

**Example: Full Return**
```json
{
  "customerId": "cust-001",
  "orderId": "sale-12345",
  "returnType": "REFUND",
  "returnReason": "DEFECTIVE",
  "reasonDetails": "Bottle cap was broken on arrival",
  "items": [
    {
      "productId": "prod-oud-50ml",
      "quantity": 3,
      "reason": "All 3 bottles have broken caps",
      "condition": "Damaged - caps broken"
    }
  ],
  "totalValue": 450.00,
  "customerNotes": "Received package with all bottles having broken caps. Box was damaged during shipping.",
  "photos": ["https://example.com/photo1.jpg", "https://example.com/photo2.jpg"]
}
```

**Example: Partial Return**
```json
{
  "customerId": "cust-002",
  "orderId": "sale-67890",
  "returnType": "PARTIAL_REFUND",
  "returnReason": "QUALITY_ISSUE",
  "reasonDetails": "2 out of 5 bottles have issues",
  "items": [
    {
      "productId": "prod-rose-100ml",
      "quantity": 2,
      "reason": "Perfume smells different than expected",
      "condition": "Opened, 2ml used from each"
    }
  ],
  "totalValue": 100.00,
  "customerNotes": "Tried 2 bottles but scent is not as described. Other 3 are fine."
}
```

**Result**: RMA number generated (e.g., RMA-000001), status: REQUESTED

---

### Step 2: Manager Approval

**Location**: `/api/returns/[id]/process` (POST)

**Approve Return**
```json
{
  "action": "APPROVE",
  "internalNotes": "Customer is a regular. Approve return with no restocking fee. Check inventory upon receipt."
}
```

**Reject Return**
```json
{
  "action": "REJECT",
  "internalNotes": "Return window expired (60 days policy). Customer purchased 90 days ago."
}
```

---

### Step 3: Inspection

**Location**: `/api/returns/[id]/process` (POST)

**Inspect Items**
```json
{
  "action": "INSPECT",
  "inspectionNotes": "Received 2 bottles. Both opened, ~10% used. Bottles in good condition, caps intact. Scent matches batch B-2024-03.",
  "itemsAccepted": [
    {
      "productId": "prod-rose-100ml",
      "quantity": 2
    }
  ],
  "itemsRejected": [],
  "internalNotes": "Items acceptable for restock. No damage. Customer likely has different scent preference."
}
```

---

### Step 4: Complete Return

**Location**: `/api/returns/[id]/process` (POST)

**Full Refund**
```json
{
  "action": "COMPLETE",
  "resolutionType": "FULL_REFUND",
  "refundAmount": 450.00,
  "restockingFee": 0,
  "internalNotes": "Defective items. No restocking fee. Items marked as damaged inventory, not restocked."
}
```

**Partial Refund**
```json
{
  "action": "COMPLETE",
  "resolutionType": "PARTIAL_REFUND",
  "refundAmount": 90.00,
  "restockingFee": 10.00,
  "internalNotes": "Original amount: 100 AED. Restocking fee: 10% = 10 AED. Net refund: 90 AED. Items restocked to inventory."
}
```

**Store Credit**
```json
{
  "action": "COMPLETE",
  "resolutionType": "STORE_CREDIT",
  "refundAmount": 100.00,
  "restockingFee": 0,
  "internalNotes": "Customer opted for store credit instead of refund. 100 AED credit added to account. Valid for 12 months."
}
```

---

## 📋 Return Notes System

### Customer Notes (Public)
- **Purpose**: Customer's explanation
- **Visible to**: Customer & staff
- **Examples**:
  - "Bottle arrived broken"
  - "Wrong scent delivered"
  - "Allergic reaction to product"
  - "Doesn't last as long as advertised"

### Internal Notes (Private)
- **Purpose**: Staff communication
- **Visible to**: Staff only
- **Examples**:
  - "Regular customer, waive restocking fee"
  - "Check with supplier about this batch"
  - "Items damaged in shipping, not customer fault"
  - "Policy exception approved by manager"

---

## 🎯 Common Return Scenarios

### Scenario 1: Full Return - Defective Product
```
Sale: 3 x Oud Perfume 50ml @ 150 AED = 450 AED
Issue: All bottles have broken caps
Return: ALL 3 items
```

**Process**:
1. Create return:
   - Type: REFUND
   - Reason: DEFECTIVE
   - Items: 3 x Oud Perfume
   - Customer notes: "All caps broken on arrival"
   - Photos: Yes

2. Approve:
   - Internal notes: "Shipping damage, approve immediately"

3. Inspect:
   - Accepted: 3 items
   - Rejected: 0 items
   - Inspection notes: "Confirmed - all caps broken, liquid leaking"

4. Complete:
   - Resolution: FULL_REFUND
   - Amount: 450 AED
   - Restocking fee: 0 AED
   - Items NOT restocked (damaged)
   - Internal notes: "Mark as damaged inventory, file claim with shipper"

---

### Scenario 2: Partial Return - Changed Mind
```
Sale: 5 x Rose Perfume 100ml @ 50 AED = 250 AED
Issue: Customer wants to return 2, keep 3
Return: 2 out of 5 items
```

**Process**:
1. Create return:
   - Type: PARTIAL_REFUND
   - Reason: CHANGED_MIND
   - Items: 2 x Rose Perfume
   - Customer notes: "Decided I prefer other scents"

2. Approve:
   - Internal notes: "Within 30-day window, approve with restocking fee"

3. Inspect:
   - Accepted: 2 items
   - Rejected: 0 items
   - Inspection notes: "Both bottles unopened, seals intact"

4. Complete:
   - Resolution: PARTIAL_REFUND
   - Original: 2 × 50 = 100 AED
   - Restocking fee: 5% = 5 AED
   - Net refund: 95 AED
   - Items restocked to inventory
   - Internal notes: "Restocked 2 units, customer keeps 3"

---

### Scenario 3: Exchange
```
Sale: 1 x Perfume A @ 100 AED
Issue: Customer wants Perfume B @ 120 AED instead
Return: Exchange
```

**Process**:
1. Create return:
   - Type: EXCHANGE
   - Reason: CHANGED_MIND
   - Items: 1 x Perfume A
   - Customer notes: "Want to try Perfume B instead"

2. Approve:
   - Internal notes: "Exchange approved, customer will pay 20 AED difference"

3. Inspect:
   - Accepted: 1 x Perfume A
   - Inspection notes: "Unopened, perfect condition"

4. Complete:
   - Resolution: EXCHANGE
   - Perfume A restocked
   - Perfume B sold
   - Additional payment: 20 AED
   - Internal notes: "Exchange completed, customer happy"

---

## 📊 Return Status Flow

```
REQUESTED → APPROVED → RECEIVED → INSPECTING → COMPLETED
     ↓
  REJECTED (end)
```

**Status Meanings**:
- **REQUESTED**: Customer submitted return
- **APPROVED**: Manager approved
- **REJECTED**: Manager rejected
- **RECEIVED**: Items physically received at store
- **INSPECTING**: Quality check in progress
- **COMPLETED**: Refund/credit processed, closed

---

## 🔍 Return Fields Explained

### Required Fields
- `customerId` - Who is returning
- `returnType` - REFUND/REPLACEMENT/EXCHANGE/STORE_CREDIT
- `returnReason` - Why they're returning
- `items[]` - What they're returning (can be partial)
  - `productId` - Product ID
  - `quantity` - How many (can be less than original)
  - `reason` - Why this specific item
  - `condition` - Current state
- `totalValue` - Amount to refund

### Optional Fields
- `orderId` - Link to original sale
- `shipmentId` - Link to shipment (if applicable)
- `reasonDetails` - More details about reason
- `customerNotes` - Customer's comments
- `photos[]` - Images of items
- `internalNotes` - Staff notes (private)

---

## 💡 Return Best Practices

### For Staff:
1. **Always add internal notes** - Helps future staff understand decisions
2. **Take photos during inspection** - Evidence for disputes
3. **Check return policy** - Ensure within time limits
4. **Verify original sale** - Confirm items match
5. **Inspect thoroughly** - Check condition before restocking

### For Managers:
1. **Review regularly** - Don't let returns sit too long
2. **Be consistent** - Apply policy fairly
3. **Track patterns** - If same product returns often, investigate
4. **Customer service** - Balance policy with loyalty
5. **Document exceptions** - Note why you made an exception

### For Inventory:
1. **Mark restocked items** - Note if returned
2. **Don't restock damaged** - Separate damaged inventory
3. **Update stock immediately** - Keep inventory accurate
4. **Track return rates** - Monitor by product

---

## 🎯 Quick Reference

### Create Return
```
POST /api/returns
Body: {customerId, returnType, returnReason, items, totalValue, customerNotes}
```

### Approve/Reject
```
POST /api/returns/[id]/process
Body: {action: "APPROVE" or "REJECT", internalNotes}
```

### Inspect
```
POST /api/returns/[id]/process
Body: {action: "INSPECT", inspectionNotes, itemsAccepted, itemsRejected}
```

### Complete
```
POST /api/returns/[id]/process
Body: {action: "COMPLETE", resolutionType, refundAmount, restockingFee, internalNotes}
```

### List All Returns
```
GET /api/returns
Query params: ?status=REQUESTED&customerId=cust-001
```

---

## ✅ Summary

Your store **CAN**:

1. ✅ **Add products** - Unlimited, anytime
2. ✅ **Process sales** - POS ready with 10 customers
3. ✅ **Full returns** - Refund entire sale
4. ✅ **Partial returns** - Return only some items from sale
5. ✅ **Customer notes** - Customer can explain why
6. ✅ **Internal notes** - Staff can add private comments
7. ✅ **Multiple types** - Refund/Exchange/Credit/Replacement
8. ✅ **Flexible reasons** - 8 standard reasons + custom
9. ✅ **Photo support** - Upload images of items
10. ✅ **Approval workflow** - Manager review required
11. ✅ **Inspection** - Quality check before refund
12. ✅ **Restocking** - Inventory automatically updated
13. ✅ **Partial refunds** - Calculate exact amounts
14. ✅ **Restocking fees** - Optional fee on some returns

---

**System Status**: ✅ Fully implemented and ready to use
**API Endpoints**: ✅ Working
**Database**: ✅ Ready
**Next Step**: Test on https://oud-erp.onrender.com/returns

---

**Last Updated**: 2025-10-23
**Feature**: Sales Returns (Full & Partial)
**Notes Support**: YES
**Status**: OPERATIONAL
