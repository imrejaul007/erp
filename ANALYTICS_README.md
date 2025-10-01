# Business Intelligence (BI) Dashboard - Perfume & Oud ERP

A comprehensive Business Intelligence dashboard built for the Perfume & Oud ERP system, featuring real-time analytics, predictive insights, and advanced data visualizations.

## 🚀 Features

### 1. Executive Dashboard (Owner Dashboard)
- **Executive Summary**: Key performance indicators and business metrics
- **Daily Sales Overview**: Real-time sales data across all branches
- **Financial Metrics**: Revenue, profit, cash flow analysis
- **Inventory Health**: Turnover rates, aging analysis, dead stock identification
- **Customer Metrics**: Acquisition, retention, customer lifetime value

### 2. Sales Analytics
- **Best Selling Products**: Performance analysis of perfumes, oud oils, and accessories
- **Sales Performance**: Analysis by store, staff, and time periods
- **Seasonal Trends**: Historical patterns and forecasting
- **Product Mix Analysis**: Category performance and optimization
- **Pricing Effectiveness**: Price impact analysis and optimization recommendations

### 3. Inventory Intelligence
- **Inventory Aging**: Slow-moving stock identification and analysis
- **Stock Turnover Analysis**: Performance by category and location
- **Wastage Analysis**: Raw material losses and expired stock tracking
- **Reorder Point Optimization**: AI-powered stock level recommendations
- **Supplier Performance**: Reliability, quality, and delivery metrics

### 4. Predictive Analytics
- **Demand Forecasting**: ML-based sales predictions
- **Stock Out Prediction**: Early warning system for inventory shortages
- **Seasonal Planning**: Automated recommendations for seasonal preparation
- **Price Optimization**: AI-driven pricing strategy suggestions
- **Customer Churn Prediction**: Risk assessment and retention strategies

### 5. Financial Intelligence
- **Profitability Analysis**: Product, store, and period-based analysis
- **Cost Analysis**: Raw material to finished goods cost tracking
- **Cash Flow Forecasting**: Predictive cash flow management
- **ROI Analysis**: Marketing campaign performance tracking
- **Break-Even Analysis**: New product viability assessment

### 6. Operational Dashboards
- **Production Efficiency**: Real-time production metrics
- **Quality Control**: Defect rates, quality scores, and trends
- **Supplier Reliability**: Performance scoring and evaluation
- **Staff Productivity**: Individual and team performance metrics
- **Customer Satisfaction**: Reviews, ratings, and NPS tracking

### 7. Real-Time Monitoring
- **Live Sales Tracking**: Real-time sales data and alerts
- **Inventory Alerts**: Stock level warnings and notifications
- **System Health**: Performance monitoring and uptime tracking
- **User Activity**: Real-time user engagement metrics
- **Performance Metrics**: System performance and response times

### 8. Interactive Features
- **Drill-Down Capability**: Navigate from summary to detailed views
- **Advanced Filtering**: Date range, store, category, and product filters
- **Multi-Store Comparison**: Side-by-side performance analysis
- **Export Capabilities**: PDF, Excel, and CSV export options
- **Scheduled Reports**: Automated report generation and delivery

## 🛠 Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **UI Components**: Radix UI, Tailwind CSS
- **Charts & Visualizations**: Recharts, Chart.js
- **Data Visualization**:
  - Time Series Charts (sales trends)
  - Heat Maps (store performance)
  - Pie Charts (product mix)
  - Bar Charts (comparisons)
  - Gauge Charts (KPIs)
  - Scatter Plots (correlation analysis)
- **Real-time Updates**: WebSocket integration with polling fallback
- **State Management**: React hooks and context
- **Date Handling**: date-fns library
- **Export**: Client-side report generation

## 📊 Chart Types & Visualizations

### Available Chart Types
1. **Line Charts**: Trend analysis and time series data
2. **Area Charts**: Volume and cumulative data visualization
3. **Bar Charts**: Comparative analysis and rankings
4. **Pie Charts**: Composition and percentage breakdowns
5. **Doughnut Charts**: Multi-level categorical data
6. **Scatter Charts**: Correlation and relationship analysis
7. **Radar Charts**: Multi-dimensional performance analysis
8. **Gauge Charts**: KPI and performance indicators
9. **Heat Maps**: Geographic and matrix data visualization
10. **Composed Charts**: Multiple data types in single view

### Interactive Features
- **Hover Tooltips**: Detailed information on data points
- **Click Events**: Drill-down navigation
- **Zoom & Pan**: Detailed time series exploration
- **Legend Toggle**: Show/hide data series
- **Dynamic Filtering**: Real-time data filtering

## 🔄 Real-Time Features

### WebSocket Integration
```typescript
// Real-time connection with fallback
const wsUrl = 'ws://localhost:3001/ws';
const fallbackPolling = 5000; // 5 seconds
```

### Live Data Updates
- Sales transactions
- Inventory movements
- User activities
- System alerts
- Performance metrics

### Notification System
- Browser notifications for critical alerts
- In-app alert management
- Acknowledgment system
- Alert history tracking

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px
- **Large Desktop**: > 1440px

### Adaptive Features
- Responsive grid layouts
- Mobile-optimized charts
- Touch-friendly interfaces
- Collapsible sidebars
- Optimized data tables

## 🔧 API Architecture

### Analytics Endpoints
```
/api/analytics/dashboard     - Executive dashboard data
/api/analytics/sales         - Sales analytics and reports
/api/analytics/inventory     - Inventory intelligence data
/api/analytics/predictive    - AI/ML predictions and forecasts
/api/analytics/financial     - Financial metrics and analysis
/api/analytics/operational   - Production and quality metrics
```

### Query Parameters
- `dateRange`: Start and end dates
- `storeId`: Filter by specific store
- `category`: Product category filter
- `type`: Specific data type request
- `period`: Time period aggregation

### Response Format
```json
{
  "data": {},
  "lastUpdated": "2024-01-15T10:30:00Z",
  "metadata": {
    "total": 100,
    "filtered": 85,
    "confidence": 92.5
  }
}
```

## 📈 Key Performance Indicators (KPIs)

### Financial KPIs
- Gross Margin
- Net Profit Margin
- Return on Investment (ROI)
- Cash Flow
- Current Ratio
- Quick Ratio

### Sales KPIs
- Total Revenue
- Average Order Value
- Conversion Rate
- Sales Growth Rate
- Customer Acquisition Cost
- Customer Lifetime Value

### Inventory KPIs
- Inventory Turnover Rate
- Stock-out Rate
- Carrying Cost
- Dead Stock Percentage
- Supplier Performance Score

### Operational KPIs
- Production Efficiency
- Quality Score
- Defect Rate
- Customer Satisfaction
- Employee Productivity
- System Uptime

## 🔍 Filtering & Search

### Filter Types
- **Date Range**: Predefined and custom ranges
- **Geographic**: Store and region filtering
- **Product**: Category and individual product filters
- **Customer**: Segment and demographic filters
- **Performance**: Metric-based filtering

### Search Capabilities
- Global search across all data
- Autocomplete suggestions
- Saved search queries
- Search history
- Advanced search operators

## 📤 Export & Reporting

### Export Formats
- **PDF**: Executive reports with charts
- **Excel**: Detailed data with pivot tables
- **CSV**: Raw data for further analysis
- **PowerPoint**: Presentation-ready reports

### Scheduled Reports
- Daily operational reports
- Weekly performance summaries
- Monthly executive dashboards
- Quarterly business reviews
- Annual compliance reports

## 🔒 Security & Permissions

### Access Control
- Role-based dashboard access
- Feature-level permissions
- Data row-level security
- API endpoint protection
- Audit trail logging

### Data Privacy
- PII data masking
- Secure data transmission
- Encrypted data storage
- GDPR compliance features
- Data retention policies

## 🚀 Performance Optimization

### Frontend Optimization
- Component lazy loading
- Memoized calculations
- Virtual scrolling for large datasets
- Optimized re-rendering
- Bundle size optimization

### Backend Optimization
- Database query optimization
- Caching strategies
- API response compression
- Connection pooling
- Background job processing

## 📚 Usage Examples

### Basic Dashboard Integration
```typescript
import OwnerDashboard from '@/components/analytics/owner-dashboard';

function App() {
  const [filters, setFilters] = useState({
    dateRange: { start: new Date(), end: new Date() },
    stores: ['store_001'],
  });

  return (
    <OwnerDashboard
      dateRange={filters.dateRange}
      stores={filters.stores}
      realTime={true}
    />
  );
}
```

### Custom Chart Implementation
```typescript
import { DrillDownChart } from '@/components/analytics/interactive-features';

const handleDrillDown = (data: any) => {
  console.log('Drilling down to:', data);
  // Navigate to detailed view
};

<DrillDownChart
  data={salesData}
  onDrillDown={handleDrillDown}
  renderChart={(data, onItemClick) => (
    <BarChart data={data}>
      <Bar
        dataKey="value"
        fill="#8B4513"
        onClick={onItemClick}
      />
    </BarChart>
  )}
/>
```

### Real-time Data Integration
```typescript
import RealTimeMonitoring from '@/components/analytics/real-time-monitoring';

<RealTimeMonitoring
  wsUrl="ws://localhost:3001/ws"
  refreshInterval={5000}
  maxDataPoints={100}
/>
```

## 🔄 Development Workflow

### Getting Started
1. Install dependencies
2. Configure environment variables
3. Start development server
4. Access analytics dashboard

### Environment Variables
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_WS_URL=ws://localhost:3001/ws
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
```

### File Structure
```
components/analytics/
├── owner-dashboard.tsx
├── sales-analytics.tsx
├── inventory-intelligence.tsx
├── predictive-analytics.tsx
├── financial-intelligence.tsx
├── operational-dashboard.tsx
├── real-time-monitoring.tsx
└── interactive-features.tsx

app/analytics/
├── page.tsx
└── layout.tsx

types/
└── analytics.ts

app/api/analytics/
├── dashboard/route.ts
├── sales/route.ts
├── inventory/route.ts
├── predictive/route.ts
└── financial/route.ts
```

## 🔮 Future Enhancements

### Planned Features
- Machine Learning model integration
- Advanced forecasting algorithms
- Natural language query interface
- Mobile app companion
- API-first architecture improvements

### Roadmap
- Q1 2024: Enhanced predictive models
- Q2 2024: Mobile responsiveness improvements
- Q3 2024: Advanced export capabilities
- Q4 2024: AI-powered insights engine

## 📞 Support

For technical support or feature requests:
- Create an issue in the repository
- Contact the development team
- Review the documentation wiki
- Check the FAQ section

---

*Built with ❤️ for the Perfume & Oud industry*