# Promotion - Analytics Module - UI Component Guide

## Analytics Overview

The Promotion Analytics module provides insights into referral performance, partner effectiveness, and campaign success metrics.

---

## API Endpoints

### Analytics
- `GET /internal/promotion/analytics/dashboard` - Get dashboard stats
- `GET /internal/promotion/analytics/partner/:partnerId` - Get partner analytics
- `GET /internal/promotion/analytics/post/:postId` - Get post analytics
- `GET /internal/promotion/analytics/source` - Get source analytics
- `GET /internal/promotion/analytics/clicks` - Get clicks by date range
- `GET /internal/promotion/analytics/conversion-rate` - Get conversion rate
- `GET /internal/promotion/analytics/top/partners` - Get top performing partners
- `GET /internal/promotion/analytics/top/posts` - Get top performing posts
- `GET /internal/promotion/analytics/export` - Export analytics report

---

## Analytics Dashboard (Conceptual)

### Dashboard Stats

**Key Metrics:**
- Total Clicks
- Total Conversions
- Overall Conversion Rate
- Total Commission Paid

### Date Range Filter
- From Date (date picker)
- To Date (date picker)
- Apply button

### Top Performers

**Top Partners Section:**
- List of top 10 partners by performance
- Shows: Name, Clicks, Conversions, Conversion Rate

**Top Posts Section:**
- List of top 10 posts by performance
- Shows: Title, Platform, Clicks, Conversions

### Source Analytics

**Performance by Source:**
- Facebook
- Instagram
- YouTube
- TikTok
- WhatsApp
- Threads
- Offline
- SMS Campaign
- Other

**Metrics per Source:**
- Total Clicks
- Conversions
- Conversion Rate

### Clicks Over Time

**Chart Display:**
- Line or bar chart showing clicks by date
- Date range filter
- Grouped by day/week/month

### Conversion Rate Trend

**Chart Display:**
- Line chart showing conversion rate over time
- Date range filter
- Percentage display

---

## Partner Analytics Page (Conceptual)

### URL: `/admin/promotion/analytics/partner/:partnerId`

### Page Header
- **Title**: "Partner Analytics - {Partner Name}"
- **Subtitle**: "Performance metrics and insights"

### Date Range Filter
- From Date
- To Date
- Apply button

### Performance Metrics

**Summary Cards:**
- Total Clicks
- Total Conversions
- Conversion Rate
- Total Commission

### Charts

**Clicks Over Time:**
- Line chart showing daily/weekly clicks

**Conversion Funnel:**
- Visual representation of click-to-conversion journey

**Source Breakdown:**
- Pie chart showing clicks by source

### Associated Posts Performance

**Table:**
- Post Title
- Clicks
- Conversions
- Conversion Rate

---

## Post Analytics Page (Conceptual)

### URL: `/admin/promotion/analytics/post/:postId`

### Page Header
- **Title**: "Post Analytics - {Post Title}"
- **Subtitle**: "Performance metrics for this promotional post"

### Date Range Filter
- From Date
- To Date
- Apply button

### Performance Metrics

**Summary Cards:**
- Total Clicks
- Total Conversions
- Conversion Rate
- Engagement Rate

### Charts

**Clicks Over Time:**
- Line chart showing daily clicks

**Source Distribution:**
- Pie chart showing which sources drove traffic

**Geographic Distribution:**
- Map or list showing clicks by location (if available)

---

## Export Report Feature

### Export Options
- **Format**: CSV or Excel
- **Date Range**: From and To dates
- **Content**: All analytics data for selected period

### Export Button
- Label: "Export Report"
- Icon: Download icon
- Triggers file download

### Report Contents
- Partner performance data
- Post performance data
- Source analytics
- Conversion metrics
- Time-series data

---

## Analytics Metrics Definitions

### Clicks
- Total number of times referral links were clicked
- Tracked by unique link visits

### Conversions
- Number of successful enrollments/sign-ups from referral links
- Tracked when user completes desired action

### Conversion Rate
- Percentage of clicks that resulted in conversions
- Formula: (Conversions / Clicks) × 100

### Commission
- Total commission earned by partner
- Calculated based on commission rate and conversions

### Engagement Rate
- Measure of post interaction
- May include likes, shares, comments (if tracked)

---

## Date Range Filtering

### Default Ranges
- Last 7 days
- Last 30 days
- Last 90 days
- Custom range

### Custom Range
- From Date: Date picker
- To Date: Date picker
- Apply button to refresh data

---

## Chart Types

### Line Charts
- Used for: Clicks over time, Conversion rate trends
- X-axis: Date
- Y-axis: Count or Percentage

### Bar Charts
- Used for: Comparing partners, Comparing posts
- X-axis: Partner/Post name
- Y-axis: Metric value

### Pie Charts
- Used for: Source distribution, Platform breakdown
- Shows: Percentage of total for each category

### Doughnut Charts
- Alternative to pie charts
- Center shows total value

---

## Performance Indicators

### Color Coding
- **Green**: High performance (above average)
- **Yellow**: Medium performance (average)
- **Red**: Low performance (below average)

### Trend Indicators
- **Up Arrow**: Increasing trend
- **Down Arrow**: Decreasing trend
- **Flat Line**: Stable trend

---

## Notes
- All analytics data is real-time or near real-time
- Date ranges are inclusive (from date to to date)
- Export format defaults to CSV
- Top performers limited to 10 by default
- Analytics may have a slight delay (5-15 minutes) for data processing
- Conversion tracking requires proper implementation on target pages
- Commission calculations based on partner's commission rate
- Geographic data requires IP tracking (may not be available)
- All percentages rounded to 2 decimal places
- Charts use responsive design for mobile viewing
