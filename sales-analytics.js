
var data = `Date,SKU,Unit Price,Quantity,Total Price
2019-01-01,Death by Chocolate,180,5,900
2019-01-01,Cake Fudge,150,1,150
2019-01-01,Cake Fudge,150,1,150
2019-01-01,Cake Fudge,150,3,450
2019-01-01,Death by Chocolate,180,1,180
2019-01-01,Vanilla Double Scoop,80,3,240
2019-01-01,Butterscotch Single Scoop,60,5,300
2019-01-01,Vanilla Single Scoop,50,5,250
2019-01-01,Cake Fudge,150,5,750
2019-01-01,Hot Chocolate Fudge,120,3,360
2019-01-01,Butterscotch Single Scoop,60,5,300
2019-01-01,Chocolate Europa Double Scoop,100,1,100
2019-01-01,Hot Chocolate Fudge,120,2,240
2019-01-01,Caramel Crunch Single Scoop,70,4,280
2019-01-01,Hot Chocolate Fudge,120,2,240
2019-01-01,Hot Chocolate Fudge,120,4,480
2019-01-01,Hot Chocolate Fudge,120,2,240
2019-01-01,Cafe Caramel,160,5,800
2019-01-01,Vanilla Double Scoop,80,4,320
2019-01-01,Butterscotch Single Scoop,60,3,180
2019-02-01,Butterscotch Single Scoop,60,3,180
2019-02-01,Vanilla Single Scoop,50,2,100
2019-02-01,Butterscotch Single Scoop,60,3,180
2019-02-01,Vanilla Double Scoop,80,1,80
2019-02-01,Death by Chocolate,180,2,360
2019-02-01,Cafe Caramel,160,2,320
2019-02-01,Pista Single Scoop,60,3,180
2019-02-01,Hot Chocolate Fudge,120,2,240
2019-02-01,Vanilla Single Scoop,50,3,150
2019-02-01,Vanilla Single Scoop,50,5,250
2019-02-01,Cake Fudge,150,1,150
2019-02-01,Vanilla Single Scoop,50,4,200
2019-02-01,Vanilla Double Scoop,80,3,240
2019-02-01,Cake Fudge,150,1,150
2019-02-01,Vanilla Double Scoop,80,5,400
2019-02-01,Hot Chocolate Fudge,120,5,600
2019-02-01,Vanilla Double Scoop,80,2,160
2019-02-01,Vanilla Double Scoop,80,3,240
2019-02-01,Hot Chocolate Fudge,120,5,600
2019-02-01,Cake Fudge,150,5,750
2019-03-01,Vanilla Single Scoop,50,5,250
2019-03-01,Cake Fudge,150,5,750
2019-03-01,Pista Single Scoop,60,1,60
2019-03-01,Butterscotch Single Scoop,60,2,120
2019-03-01,Vanilla Double Scoop,80,1,80
2019-03-01,Cafe Caramel,160,1,160
2019-03-01,Cake Fudge,150,5,750
2019-03-01,Trilogy,160,5,800
2019-03-01,Butterscotch Single Scoop,60,3,180
2019-03-01,Death by Chocolate,180,2,360
2019-03-01,Butterscotch Single Scoop,60,1,60
2019-03-01,Hot Chocolate Fudge,120,3,360
2019-03-01,Cake Fudge,150,2,300
2019-03-01,Cake Fudge,150,2,300
2019-03-01,Vanilla Single Scoop,50,4,100
2019-03-01,Cafe Caramel,160,0,160
2019-03-01,Cake Fudge,150,5,750
2019-03-01,Cafe Caramel,160,5,800
2019-03-01,Almond Fudge,150,1,150
2019-03-01,Cake Fudge,150,1,150`;

// =================
// Helper Functions
// =================

// Parse CSV string into array of objects
function parseCSV(csvData) {
  const lines = csvData.trim().split('\n').filter(line => line.trim());
  const headers = lines[0].split(',').map(h => h.trim());
  
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const row = {};
    
    headers.forEach((header, idx) => {
      row[header] = values[idx];
    });
    
    rows.push(row);
  }
  
  return { headers, rows };
}

// Get year-month string from date (YYYY-MM)
function getYearMonth(dateStr) {
  return dateStr.substring(0, 7);
}

// Check if date string is valid
function isValidDate(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return false;
  
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  if (!datePattern.test(dateStr)) return false;
  
  const date = new Date(dateStr);
  return date instanceof Date && !isNaN(date);
}

function formatCurrency(value) {
  return `₹${value.toFixed(2)}`;
}

function formatPercentage(value) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
}

// ================
// Data Validation
// ===============

function validateData(rows) {
  const validRows = [];
  const errors = [];
  
  rows.forEach((row, index) => {
    const rowNum = index + 2; // account for header and 0-index
    const issues = [];
    
    const unitPrice = parseFloat(row['Unit Price']);
    const quantity = parseInt(row['Quantity']);
    const totalPrice = parseFloat(row['Total Price']);
    const date = row['Date'];
    
    // Run all validation checks
    if (!isValidDate(date)) {
      issues.push('Malformed date');
    }
    
    if (isNaN(unitPrice) || unitPrice < 0) {
      issues.push('Unit Price < 0 or invalid');
    }
    
    if (isNaN(quantity) || quantity < 1) {
      issues.push('Quantity < 1 or invalid');
    }
    
    if (isNaN(totalPrice) || totalPrice < 0) {
      issues.push('Total Price < 0 or invalid');
    }
    
    // Check if unit price * quantity matches total price
    // Using tolerance because of floating point math issues in JS
    if (!isNaN(unitPrice) && !isNaN(quantity) && !isNaN(totalPrice)) {
      const expectedTotal = unitPrice * quantity;
      const tolerance = 0.01;
      
      if (Math.abs(expectedTotal - totalPrice) > tolerance) {
        issues.push(`Price mismatch: ${unitPrice} * ${quantity} = ${expectedTotal}, but got ${totalPrice}`);
      }
    }
    
    if (issues.length > 0) {
      errors.push({ row: rowNum, data: row, issues });
    } else {
      validRows.push({
        ...row,
        unitPrice,
        quantity,
        totalPrice,
        yearMonth: getYearMonth(date)
      });
    }
  });
  
  return { validRows, errors };
}

// ====================
// Analytics Functions
// ====================

function calculateTotalSales(rows) {
  return rows.reduce((sum, row) => sum + row.totalPrice, 0);
}

function calculateMonthWiseSales(rows) {
  const monthlySales = {};
  
  rows.forEach(row => {
    const month = row.yearMonth;
    monthlySales[month] = (monthlySales[month] || 0) + row.totalPrice;
  });
  
  return monthlySales;
}

function getMostPopularItemsByMonth(rows) {
  // First, group all data by month and item
  const monthItemData = {};
  
  rows.forEach(row => {
    const month = row.yearMonth;
    const sku = row['SKU'];
    
    if (!monthItemData[month]) {
      monthItemData[month] = {};
    }
    
    if (!monthItemData[month][sku]) {
      monthItemData[month][sku] = {
        totalQuantity: 0,
        quantities: []
      };
    }
    
    monthItemData[month][sku].totalQuantity += row.quantity;
    monthItemData[month][sku].quantities.push(row.quantity);
  });
  
  // Now find the most popular item for each month
  const results = {};
  
  Object.keys(monthItemData).forEach(month => {
    let maxQuantity = 0;
    let popularItem = null;
    
    Object.keys(monthItemData[month]).forEach(sku => {
      const itemData = monthItemData[month][sku];
      if (itemData.totalQuantity > maxQuantity) {
        maxQuantity = itemData.totalQuantity;
        popularItem = sku;
      }
    });
    
    // Calculate min, max, avg for the winner
    if (popularItem) {
      const quantities = monthItemData[month][popularItem].quantities;
      const min = Math.min(...quantities);
      const max = Math.max(...quantities);
      const avg = quantities.reduce((sum, q) => sum + q, 0) / quantities.length;
      
      results[month] = {
        item: popularItem,
        totalQuantity: maxQuantity,
        minQuantity: min,
        maxQuantity: max,
        avgQuantity: avg
      };
    }
  });
  
  return results;
}

function getHighestRevenueItemsByMonth(rows) {
  // Group revenue by month and item
  const monthItemRevenue = {};
  
  rows.forEach(row => {
    const month = row.yearMonth;
    const sku = row['SKU'];
    
    if (!monthItemRevenue[month]) {
      monthItemRevenue[month] = {};
    }
    
    monthItemRevenue[month][sku] = (monthItemRevenue[month][sku] || 0) + row.totalPrice;
  });
  
  // Find the top earner for each month
  const results = {};
  
  Object.keys(monthItemRevenue).forEach(month => {
    let maxRevenue = 0;
    let topItem = null;
    
    Object.keys(monthItemRevenue[month]).forEach(sku => {
      const revenue = monthItemRevenue[month][sku];
      if (revenue > maxRevenue) {
        maxRevenue = revenue;
        topItem = sku;
      }
    });
    
    results[month] = { item: topItem, revenue: maxRevenue };
  });
  
  return results;
}

function calculateMonthToMonthGrowth(rows) {
  // Build a map: month -> item -> revenue
  const monthItemRevenue = {};
  
  rows.forEach(row => {
    const month = row.yearMonth;
    const sku = row['SKU'];
    
    if (!monthItemRevenue[month]) {
      monthItemRevenue[month] = {};
    }
    
    monthItemRevenue[month][sku] = (monthItemRevenue[month][sku] || 0) + row.totalPrice;
  });
  
  const months = Object.keys(monthItemRevenue).sort();
  const itemGrowth = {};
  
  // Get all unique items
  const allSKUs = new Set();
  rows.forEach(row => allSKUs.add(row['SKU']));
  
  allSKUs.forEach(sku => {
    itemGrowth[sku] = {};
    
    // Compare each month with the previous one
    for (let i = 1; i < months.length; i++) {
      const currentMonth = months[i];
      const previousMonth = months[i - 1];
      
      const currentRevenue = monthItemRevenue[currentMonth][sku] || 0;
      const previousRevenue = monthItemRevenue[previousMonth][sku] || 0;
      
      if (previousRevenue === 0 && currentRevenue === 0) {
        itemGrowth[sku][currentMonth] = null; // item didn't exist in either month
      } else if (previousRevenue === 0) {
        itemGrowth[sku][currentMonth] = Infinity; // new item this month
      } else {
        const growth = ((currentRevenue - previousRevenue) / previousRevenue) * 100;
        itemGrowth[sku][currentMonth] = growth;
      }
    }
  });
  
  return itemGrowth;
}

// ===============
// Display Results
// ===============

function printHeader(title) {
  console.log('\n' + '='.repeat(80));
  console.log(title.toUpperCase());
  console.log('='.repeat(80));
}

function displayResults(validRows, errors, totalSales, monthlySales, popularItems, revenueItems, growth) {
  console.log('\n');
  console.log('╔' + '═'.repeat(78) + '╗');
  console.log('║' + ' '.repeat(20) + 'SALES ANALYTICS REPORT' + ' '.repeat(36) + '║');
  console.log('╚' + '═'.repeat(78) + '╝');
  
  // 1. Total Sales
  printHeader('1. Total Sales of the Store');
  console.log(`Total Revenue: ${formatCurrency(totalSales)}`);
  console.log(`Valid Transactions: ${validRows.length}`);
  
  // 2. Month-wise Sales
  printHeader('2. Month-wise Sales Totals');
  const sortedMonths = Object.keys(monthlySales).sort();
  sortedMonths.forEach(month => {
    console.log(`${month}: ${formatCurrency(monthlySales[month])}`);
  });
  
  // 3. Most Popular Items
  printHeader('3. Most Popular Item Per Month (by Quantity)');
  sortedMonths.forEach(month => {
    const item = popularItems[month];
    if (item) {
      console.log(`\n${month}:`);
      console.log(`  Item: ${item.item}`);
      console.log(`  Total Quantity Sold: ${item.totalQuantity} units`);
      console.log(`  Min Quantity per Order: ${item.minQuantity}`);
      console.log(`  Max Quantity per Order: ${item.maxQuantity}`);
      console.log(`  Avg Quantity per Order: ${item.avgQuantity.toFixed(2)}`);
    }
  });
  
  // 4. Highest Revenue Items
  printHeader('4. Highest Revenue Generating Item Per Month');
  sortedMonths.forEach(month => {
    const item = revenueItems[month];
    if (item) {
      console.log(`${month}: ${item.item} - ${formatCurrency(item.revenue)}`);
    }
  });
  
  // 5. Month-to-Month Growth
  printHeader('5. Month-to-Month Growth Per Item (%)');
  const itemsWithGrowth = Object.keys(growth).filter(sku => {
    return Object.values(growth[sku]).some(val => val !== null);
  }).sort();
  
  itemsWithGrowth.forEach(sku => {
    console.log(`\n${sku}:`);
    sortedMonths.slice(1).forEach(month => {
      const growthVal = growth[sku][month];
      if (growthVal === null) {
        console.log(`  ${month}: No data`);
      } else if (growthVal === Infinity) {
        console.log(`  ${month}: New item (no previous data)`);
      } else {
        console.log(`  ${month}: ${formatPercentage(growthVal)}`);
      }
    });
  });
  
  // 6. Data Validation
  printHeader('6. Data Validation Report');
  if (errors.length === 0) {
    console.log('✓ All rows passed validation!');
  } else {
    console.log(`✗ Found ${errors.length} invalid rows:\n`);
    errors.forEach(error => {
      console.log(`Row ${error.row}:`);
      console.log(`  Data: ${JSON.stringify(error.data)}`);
      console.log(`  Issues:`);
      error.issues.forEach(issue => {
        console.log(`    - ${issue}`);
      });
      console.log('');
    });
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('END OF REPORT');
  console.log('='.repeat(80) + '\n');
}

// =====
// Main
// =====

function main() {
  console.time('Execution Time');
  
  const { rows } = parseCSV(data);
  const { validRows, errors } = validateData(rows);
  
  const totalSales = calculateTotalSales(validRows);
  const monthlySales = calculateMonthWiseSales(validRows);
  const popularItems = getMostPopularItemsByMonth(validRows);
  const revenueItems = getHighestRevenueItemsByMonth(validRows);
  const growth = calculateMonthToMonthGrowth(validRows);
  
  displayResults(validRows, errors, totalSales, monthlySales, popularItems, revenueItems, growth);
  
  console.timeEnd('Execution Time');
}

main();

// ===============
// WRITTEN ANSWERS
// ===============
/*

1️. What was the most complex part and why?

The month-to-month growth calculation was definitely the trickiest part.

The main issue is that not every item sells in every month. So you end up with a bunch
of edge cases to handle:
- Item sold in both months → calculate normal percentage growth
- Item only sold in the current month → it's a new item, can't calculate growth (marked as Infinity)
- Item didn't sell in either month → no meaningful data (marked as null)

The other tricky bit was avoiding division by zero. If an item had 0 revenue last month
but has sales this month, dividing by 0 would break things. That's why I check for it
and mark it as a new item instead.

I went with building a nested object structure (item -> month -> revenue) first, then
looping through sorted months to compare consecutive ones. This keeps it simple and runs
in O(n) time since we only pass through the data once, then do some small loops over
months and items.

I considered sorting all the rows by date first, but that would add unnecessary O(n log n)
complexity. Also thought about comparing all month pairs instead of just consecutive ones,
but that would be wasteful since we only care about month-over-month changes.


2️. A bug you expect to hit and how to debug it

JavaScript floating point math is going to bite someone eventually.

The classic example: 0.1 + 0.2 doesn't equal 0.3 in JavaScript (or any language using
IEEE 754 floats). It equals 0.30000000000000004.

For this code, the issue would show up in price validation. Like if you have:
  Unit Price: 33.33
  Quantity: 3
  Expected: 99.99
  Actual: 99.98999999999999

Strict equality would flag this as invalid even though it's fine.

That's why I added a tolerance of 0.01 - if the difference is less than a penny, I let
it pass. Used Math.abs(expected - actual) > tolerance instead of ===.

If this bug showed up anyway, here's how I'd debug it:
1. Add console.log with more decimal places to see the actual values:
   console.log(`Expected: ${expected.toFixed(10)}, Got: ${actual.toFixed(10)}`);

2. Set a breakpoint in the validation and watch the calculation happen step by step

3. Write a quick test with known problematic values like 0.1, 0.2, 0.3 to confirm it's
   a floating point issue and not my logic

4. If I'm still not sure, log every validation that's close but not exact:
   if (diff > 0 && diff < 0.1) console.log(`Close call: ${diff}`);

In a real app where precision matters a lot (like financial calculations), you'd want to
use integers (work in cents not dollars) or bring in a decimal library. But for this
assignment we're avoiding dependencies, so the tolerance approach works fine.


3️. Does your solution scale to large datasets?

For most real-world use cases, yes. For truly massive datasets, there are some limits.

The good news:
- Everything runs in O(n) time where n = number of rows
- I'm using objects/maps for lookups which gives O(1) access instead of searching through arrays
- No nested loops that would make things quadratic
- Single pass through the data wherever possible

The code should handle a few million rows without breaking a sweat. Based on the algorithms,
I'd estimate:
- 1 million rows: ~2-3 seconds
- 10 million rows: ~20-30 seconds

Where it would struggle:
- Really huge files (100M+ rows) → everything's loaded into memory at once. Would need
  to switch to streaming the file line by line instead of loading it all.
  
- Lots of unique items over many months → if you have 10,000 items and 120 months, you're
  storing 1.2 million item-month combinations. Still manageable (probably ~120MB) but
  starts to add up.

- The sorting operations (Object.keys().sort()) are O(k log k) where k is the number of
  months or items, but this is just for display so it's not a big deal.

For a typical e-commerce store, even a large one, this solution would work fine. You'd hit
other bottlenecks (like reading the file from disk) before the processing logic becomes
the problem. If you truly needed to handle billions of rows, you'd need to rethink the
approach - maybe streaming, maybe a database, maybe chunking the work. But that's way
beyond what this assignment is asking for.

*/