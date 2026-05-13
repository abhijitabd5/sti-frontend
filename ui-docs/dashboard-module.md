# Dashboard Module - UI Documentation

## Overview
Admin dashboard with 6 widget sections displaying key metrics, charts, and analytics.

---

## Page Layout

### Dashboard Page
**Route**: `/internal/dashboard`

**Layout**: 6 sections arranged in rows
1. Row 1: Stats Cards (left) + Students per State Chart (right)
2. Row 2: Income vs Expenses vs Investment Bar Chart (full width)
3. Row 3: Students per Course Chart (full width)
4. Row 4: Social Traffic Table (full width)
5. Row 5: Income/Expenses by Category Doughnut Chart (full width)

---

## 1. Stats Cards Widget

### Components
- Two cards stacked vertically
- Total Students card
- Total Enquiries card with breakdown

### Total Students Card

**Fields**:
- Title: "Total Students"
- Value: Number (e.g., "1,234")
- Growth percentage badge (e.g., "+12%")

### Total Enquiries Card

**Fields**:
- Title: "Total Enquiries"
- Value: Number (e.g., "567")
- Growth percentage badge (e.g., "+8%")

**Breakdown List** (3 items):
- Course Enquiries: Number with blue dot
- Contact Us: Number with green dot
- Offline Enquiries: Number with orange dot

### API Endpoints
- `GET /internal/dashboard/students/stats` - Students data
- `GET /internal/dashboard/enquiries/stats` - Enquiries data with breakdown

---

## 2. Income vs Expenses vs Investment Chart

### Components
- Bar chart with 3 datasets
- Period dropdown
- Date range filters (month picker)
- Clear button

### Controls

**Period Dropdown**:
- Options: "Last 6 Months", "Current Year"

**Date Range Filters**:
- From: Month picker input
- To: Month picker input
- Clear button
- Validation: Max 12 months range

### Chart
- Type: Bar chart
- X-axis: Time periods (months)
- Y-axis: Amount
- 3 bars per period:
  - Income (sky blue)
  - Expenses (violet)
  - Investment (emerald green)

### API Endpoints
- `GET /internal/transactions/income-vs-expense?period={period}&from={from}&to={to}`

---

## 3. Income/Expenses by Category Chart

### Components
- Doughnut chart
- Type toggle (Expenses/Income)
- Date range filters
- Clear dates button

### Controls

**Type Dropdown**:
- Options: "Expenses", "Income"

**Date Range Filters**:
- From: Date picker input
- To: Date picker input
- Clear Dates button (text link)

### Chart
- Type: Doughnut chart
- Legend: Right side with category names and amounts
- Colors: 10 unique colors for up to 10 categories
- Tooltip: Shows amount and percentage

### API Endpoints
- `GET /internal/transactions/category-wise/{type}?start_date={start_date}&end_date={end_date}`
  - `{type}`: "expense" or "income"

---

## 4. Social Traffic Table

### Components
- Table with 5 time period columns
- Date range picker for custom column
- Source icons

### Table Columns
1. Source (with icon)
2. Today
3. Week
4. Month
5. Year
6. Custom (date range)

### Sources (5 rows)
- Facebook (blue icon)
- Instagram (pink icon)
- YouTube (red icon)
- WhatsApp (green icon)
- Other (purple icon)

### Data Display
Each cell shows:
- Clicks count (formatted, e.g., "1.2K")

### Controls
- Custom Range: Date range picker (from/to)

### API Endpoints
- `GET /internal/promotion/analytics/sources/periods?customFrom={customFrom}&customTo={customTo}`

---

## 5. Students per State Chart

### Components
- Chart (doughnut or bar)
- Chart type toggle (Pie/Bar)
- Region filter dropdown
- Date range filters
- Clear button

### Controls

**Chart Type Toggle**:
- Buttons: "Pie", "Bar"

**Region Filter Dropdown**:
- Options:
  - Top 10 States
  - Northern India
  - Southern India
  - Western India
  - Eastern India
  - Northeastern India
  - Central India

**Date Range Filters**:
- From: Date picker input
- To: Date picker input
- Clear button

### Chart Display
- Shows student count per state
- Doughnut: Legend on right with state names and counts
- Bar: X-axis shows state names, Y-axis shows counts
- Unique color per state

### Summary Text
- "Showing {filtered} of {total} total students"

### API Endpoints
- `GET /internal/dashboard/students/stats?dateFrom={dateFrom}&dateTo={dateTo}`
  - Returns `studentsByState` array with state data

---

## 6. Students per Course Chart

### Components
- Chart (doughnut or bar)
- Chart type toggle (Pie/Bar)
- Course type filter dropdown
- Date range filters
- Clear button

### Controls

**Chart Type Toggle**:
- Buttons: "Pie", "Bar"

**Course Type Filter Dropdown**:
- Options:
  - Top 10 Courses
  - Operator Training
  - Technician Training

**Date Range Filters**:
- From: Date picker input
- To: Date picker input
- Clear button

### Chart Display
- Shows student count per course
- Doughnut: Legend on right with course names and counts
- Bar: X-axis shows course names, Y-axis shows counts
- Unique color per course

### Summary Text
- "Showing {filtered} of {total} total students"

### API Endpoints
- `GET /internal/dashboard/students/stats?dateFrom={dateFrom}&dateTo={dateTo}`
  - Returns `studentsByCourse` array with course data

---

## Notes

- All charts show loading spinner while fetching data
- All charts show "No data available" message when empty
- Date range filters only fetch when both dates selected or both empty
- Stats cards show skeleton loaders during fetch
- Chart colors use CSS variables for theme consistency
- All dropdowns have custom arrow icons
- Social traffic table formats large numbers (1000+ as "1K")
