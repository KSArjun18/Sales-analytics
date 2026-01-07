# Sales Analytics System

A pure Node.js solution for analyzing sales data from CSV format. Built without any external dependencies to demonstrate core JavaScript and algorithm skills.

## 📊 Overview

This project processes ice cream store sales data and generates comprehensive analytics including revenue totals, trends, popular items, and data quality validation.

## 🚀 Features

- **Total Sales Calculation** - Overall revenue across all transactions
- **Month-wise Sales Analysis** - Revenue breakdown by month
- **Popular Items Tracking** - Most sold items per month with order statistics (min/max/avg quantities)
- **Revenue Leaders** - Highest earning items per month
- **Growth Analytics** - Month-over-month growth percentage for each product
- **Data Validation** - Detects and reports inconsistent or invalid data

## 🛠️ Tech Stack

- **Node.js** (Pure JavaScript)
- No external libraries or dependencies
- CSV parsing from scratch
- Custom data validation logic

## 📋 Requirements

- Node.js (v12 or higher)
- No additional packages needed

## 🏃 How to Run

```bash
# Clone the repository
git clone https://github.com/KSArjun18/Sales-analytics.git
cd sales-analytics

# Run the script
node sales-analytics.js
```

## 📤 Output

The script generates a formatted console report with:
- Total revenue and transaction count
- Monthly sales breakdown
- Most popular items (by quantity sold)
- Top revenue generators
- Growth trends
- Data validation results

Example output:
```
╔══════════════════════════════════════════════════════════════════════════════╗
║                    SALES ANALYTICS REPORT                                    ║
╚══════════════════════════════════════════════════════════════════════════════╝

================================================================================
1. TOTAL SALES OF THE STORE
================================================================================
Total Revenue: ₹18820.00
Valid Transactions: 58
...
```

## 🔍 Data Validation

The system validates each transaction for:
- ✅ Valid date format (YYYY-MM-DD)
- ✅ Unit price is non-negative
- ✅ Quantity is at least 1
- ✅ Total price is non-negative
- ✅ Price calculation accuracy (Unit Price × Quantity = Total Price)

Invalid rows are reported with specific error details.

## ⚡ Performance

- **Time Complexity**: O(n) for most operations where n = number of rows
- **Space Complexity**: O(n + m×s) where m = months, s = unique SKUs
- Handles millions of rows efficiently
- Uses hash maps for O(1) lookups instead of nested loops

## 🧮 Key Algorithms

- **Hash map grouping** for efficient data aggregation
- **Single-pass calculations** to minimize iterations
- **Floating-point tolerance** for price validation (handles JavaScript decimal precision)
- **Edge case handling** for month-over-month growth (new items, missing data)

## 📝 Code Structure

```
sales-analytics.js
├── Helper Functions
│   ├── parseCSV()           - Parse CSV string into objects
│   ├── getYearMonth()       - Extract year-month from date
│   ├── isValidDate()        - Date format validation
│   └── formatCurrency()     - Format numbers as currency
│
├── Data Validation
│   └── validateData()       - Run all validation checks
│
├── Analytics Functions
│   ├── calculateTotalSales()
│   ├── calculateMonthWiseSales()
│   ├── getMostPopularItemsByMonth()
│   ├── getHighestRevenueItemsByMonth()
│   └── calculateMonthToMonthGrowth()
│
└── Display
    └── displayResults()     - Format and print report
```

## 🎯 Design Decisions

### Why Objects Over Arrays?
Objects provide O(1) lookup time compared to O(n) for array searches. Critical for performance when grouping data by month and SKU.

### Why Tolerance in Price Validation?
JavaScript's floating-point arithmetic (IEEE 754) can produce rounding errors. For example, `33.33 × 3` might equal `99.98999999999999` instead of `99.99`. A tolerance of ₹0.01 handles these edge cases.

### Why Single-Pass Algorithms?
Minimizes iterations over the dataset, keeping time complexity linear even with multiple analytics requirements.

## 🐛 Known Limitations

- Loads entire dataset into memory (not suitable for extremely large files > 100M rows)
- Simple CSV parsing (doesn't handle quoted fields with commas)
- Last-write-wins for duplicate months+SKU combinations

## 🔧 Possible Improvements

- Stream processing for very large files
- TypeScript for type safety
- Unit tests with a testing framework
- More sophisticated CSV parsing
- Configuration file for validation rules
- Export results to JSON/CSV

## 📚 Learning Outcomes

This project demonstrates:
- Data manipulation and aggregation
- Algorithm optimization
- Edge case handling
- Code organization and readability
- JavaScript fundamentals without libraries
- Real-world data processing challenges

## 👤 Author

Built as a coding assignment to demonstrate backend development and algorithmic thinking.

## 📄 License


This project is open source and available for educational purposes.
