const DEBUG = true;

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  const menu = ui.createMenu('Square Data');
  menu.addItem('Update Square Data', 'UpdateData');
  menu.addToUi();

  UpdateData();
}

function UpdateData() {

  // const startDate = readCell("Settings", "B2")
  const startDate = "2023-08-01T20:00:00";
  const ordersRaw = getOrdersGql(startDate);
  const paymentsMap = getPayments(startDate);

  const orders = combineOrdersPayments(ordersRaw, paymentsMap);

  

  if (true) {
    const debug = [["Order"]];
    for (const order of orders) {
      debug.push([JSON.stringify(order)])
    }
    writeDataToSheet(debug, "Debug-Orders")
  }
  
  if (DEBUG) {
    const debug = [["paymentsMap"]];
    for (const item of Object.entries(paymentsMap)) {
      debug.push([JSON.stringify(item)])
    }
    writeDataToSheet(debug, "Debug-payments")
  }

  createSheetOrders(orders);
  createSheetItems(orders);
}

function readCell(sheetName, cellAddress) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(sheetName);
  const cell = sheet.getRange(cellAddress);
  const value = cell.getValue();
  console.log(`The value of ${cellAddress} is ${value}`);
  return value;
}



function createSheetOrders(orders)
{
  const table = [['Order', 'Created', 'Amount', 'Fee', "Net", "Customer", "Customer Email", "Line Items"]];
  for (let i = 0; i < orders.length; i++) {
    const order = orders[i];
    const row = [
      `https://squareup.com/dashboard/orders/overview/${order.id}`,
      order.createdAt,
      order.totalMoney.amount/100,
      order.processingFee/100,
      (order.totalMoney.amount - order.processingFee)/100,
      `${order.customer?.givenName||''} ${order.customer?.familyName||''}`,
      order.customer?.emailAddress,
      JSON.stringify(order.lineItems, ["name", "amount", "modifiers"])
      ];
    table.push(row);
  }

  // Write table data to Google Spreadsheet
  writeDataToSheet(table, "Orders")
}

function createSheetItems(orders)
{
  const itemSales = [['Timestamp', 'Order', 'Item', 'Qty', 'Variation', 'Sku', 'Modifiers', 'Gross', 'Discounts', 'Net Before Fee', 'Square Fee', 'Net', 'customer', 'Customer Email']];
  for (let i = 0; i < orders.length; i++) {
    const order = orders[i];

    const orderFee = order.processingFee;
    const orderTotal = order.totalMoney.amount

    for (let lineItem of order.lineItems) {
      const itemFee = (orderFee * (lineItem.totalMoney.amount/orderTotal));
      const row = [
        order.createdAt,
        `https://squareup.com/dashboard/orders/overview/${order.id}`,
        lineItem.name,
        lineItem.quantity,
        lineItem.itemVariation.name,
        lineItem.itemVariation.sku, //@todo
        lineItem.modifiers.map((m)=>m.name).join(", "),
        lineItem.grossSales.amount/100,
        lineItem.totalDiscount.amount/100,
        lineItem.totalMoney.amount/100,
        itemFee/100,
        (lineItem.totalMoney.amount-itemFee)/100,
        `${order.customer?.givenName||''} ${order.customer?.familyName||''}`,
        order.customer?.emailAddress,
      ];
    itemSales.push(row);
    }
    
    
  }
  writeDataToSheet(itemSales, "Items")
}
  
function writeDataToSheet(data, sheetName) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  let sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
  }
  sheet.clearContents();
  sheet.getRange(1, 1, data.length, data[0].length).setValues(data);
}























