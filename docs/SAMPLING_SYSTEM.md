# Showroom Sampling & Customer Trial Management System

## Overview

The Sampling & Trial Management System is designed specifically for perfume and oud businesses to track customer testing sessions, monitor tester stock consumption, analyze conversion rates, and understand why customers don't purchase.

## Key Features

### 1. Sampling Session Management
- **Create New Sessions**: Record walk-in customer trials with full tracking
- **Anonymous or Named Customers**: Flexible customer identification
- **Product Testing Tracking**: Monitor which products were shown and tested
- **Tester Usage Recording**: Track exact quantities used (ml, grams)
- **Automatic Cost Calculation**: Real-time tester cost computation

### 2. Customer Conversion Tracking
- **Purchase Outcomes**: Mark sessions as purchased or not purchased
- **Sale Amount Recording**: Capture revenue from conversions
- **Feedback Collection**: Detailed reasons for non-purchase:
  - Price too high
  - Didn't like fragrance
  - Will decide later
  - Found better option elsewhere
  - Wanted different packaging/size
  - Stock not available
  - Custom notes

### 3. Tester Stock Management
- **Inventory Integration**: Automatic deduction from tester stock
- **Stock Level Monitoring**: Real-time tester inventory tracking
- **Low Stock Alerts**: Notifications when tester stock is low
- **Refill Management**: Track tester stock refills from main inventory
- **Usage Analytics**: Monthly consumption reports per product

### 4. Analytics & Insights

#### Conversion Metrics
- Total sampling sessions
- Conversion rate (%)
- Lost opportunities count
- Revenue from conversions

#### ROI Analysis
- Total tester cost
- Revenue generated
- Return on investment (%)
- Cost per conversion

#### Lost Sale Analysis
- Breakdown of reasons for non-purchase
- Percentage distribution
- Actionable insights for improvement

#### Staff Performance
- Sessions per staff member
- Conversion rates by staff
- Average sale amount
- Best performers

### 5. Reports Available

1. **Tester Consumption Report**
   - Total sessions
   - Total tester cost
   - Revenue vs cost
   - Product-wise breakdown

2. **Conversion Funnel Report**
   - Sessions → Purchases flow
   - Drop-off analysis
   - Success rate metrics

3. **Lost Sale Analysis Report**
   - Top reasons for lost sales
   - Pricing sensitivity
   - Product preference insights

4. **Staff Performance Report**
   - Individual conversion rates
   - Revenue contribution
   - Session handling efficiency

## Technical Implementation

### Core Services

#### `sampling-service.ts`
Main service handling all sampling operations:

```typescript
// Create sampling session with inventory integration
createSamplingSession(sessionData) → Promise<SamplingSession>

// Get consumption report
getTesterConsumptionReport(startDate, endDate) → Promise<Report>

// Get lost sale analysis
getLostSaleAnalysis(startDate, endDate) → Promise<Analysis>

// Get staff performance
getStaffPerformance(startDate, endDate) → Promise<Performance[]>

// Refill tester stock
refillTesterStock(productId, quantity, sourceType) → Promise<void>
```

### Inventory Integration

When a sampling session is created:

1. **Tester Stock Deduction**
   - Automatically deducts used quantities from tester stock
   - Updates inventory records
   - Logs deduction with reference to session ID

2. **Sale Recording** (if purchased)
   - Creates sale record in POS system
   - Deducts from main inventory
   - Links sale to sampling session

3. **Stock Alerts**
   - Checks tester stock levels after each deduction
   - Triggers alerts when below minimum threshold
   - Notifies managers to refill

### API Endpoints

#### Create Sampling Session
```
POST /api/sampling/sessions
Body: {
  customer: { ... },
  testedProducts: [...],
  outcome: 'purchased' | 'not_purchased',
  ...
}
```

#### Deduct Tester Stock
```
POST /api/inventory/deduct-tester
Body: {
  productId: string,
  quantity: number,
  referenceId: string
}
```

#### Refill Tester Stock
```
POST /api/inventory/refill-tester
Body: {
  productId: string,
  quantity: number,
  sourceType: 'main_inventory' | 'purchase'
}
```

## Data Flow

### New Sampling Session Flow

```
1. Staff creates new session
   ↓
2. Add customer details (or mark anonymous)
   ↓
3. Search and add products to test
   ↓
4. Record quantity used for each product
   ↓
5. Select outcome (purchased/not purchased)
   ↓
6. If not purchased → capture reason
   ↓
7. If purchased → record sale amount
   ↓
8. Save session
   ↓
9. System automatically:
   - Deducts tester stock
   - Creates sale record (if purchased)
   - Checks stock alerts
   - Updates analytics
```

### Inventory Deduction Flow

```
1. Session saved with tested products
   ↓
2. For each product:
   - Get product ID and quantity used
   - Deduct from tester stock
   - Log transaction with session reference
   ↓
3. Check tester stock levels
   ↓
4. If below minimum → trigger alert
   ↓
5. Notify manager to refill
```

## User Roles & Permissions

- **OWNER**: Full access to all features and reports
- **MANAGER**: Full access to all features and reports
- **SALES_STAFF**: Can create sessions, view own performance

## Business Benefits

### 1. Reduce Invisible Stock Loss
- Every ml/gram of tester usage is tracked
- No more unaccounted inventory shrinkage
- Clear visibility of tester consumption

### 2. Understand Customer Psychology
- Know exactly why customers don't buy
- Identify pricing sensitivity
- Understand fragrance preferences

### 3. Improve Sales Conversion
- Data-driven insights on lost sales
- Staff performance metrics
- Product popularity analysis

### 4. Optimize Tester Investment
- ROI tracking for tester stock
- Identify high-converting products
- Reduce wastage of expensive testers

### 5. Staff Training & Motivation
- Performance-based insights
- Best practice identification
- Conversion improvement strategies

## Best Practices

### For Staff
1. **Always record sessions immediately** after customer interaction
2. **Be accurate with quantities** - record actual usage
3. **Capture detailed feedback** when customer doesn't purchase
4. **Mark anonymous** if customer doesn't want to share details
5. **Add notes** for special requests or observations

### For Managers
1. **Review daily conversion reports** to identify trends
2. **Monitor tester stock levels** weekly
3. **Analyze lost sale reasons** to improve offerings
4. **Track staff performance** for training needs
5. **Refill testers proactively** before stock-outs

### For Owners
1. **Review ROI monthly** to optimize tester budget
2. **Analyze product performance** to adjust inventory
3. **Study seasonal trends** in conversion rates
4. **Benchmark staff performance** across locations
5. **Use insights** for pricing and marketing decisions

## Future Enhancements

- [ ] AI-powered product recommendations based on customer preferences
- [ ] WhatsApp follow-up integration for non-purchases
- [ ] Multi-location tester stock transfer
- [ ] Customer preference profiling
- [ ] Automated reordering for low tester stock
- [ ] Integration with loyalty program for converters
- [ ] Video recording of sampling sessions (with consent)
- [ ] Fragrance pairing suggestions based on testing history

## Support

For technical support or feature requests, contact the development team.

---

**Version**: 1.0.0
**Last Updated**: October 2024
**Module**: Sampling & Trial Management
