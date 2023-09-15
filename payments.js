function test_getPayments() {
  const startDate = "2023-08-01T20:00:00";
  const payments = getPayments(startDate);
  console.log(JSON.stringify(payments, null, 2));
}

// startDate is an iso8601 formated date time
function getPayments(startDate) {
  const url = `https://connect.squareup.com/v2/payments?begin_time=${startDate}`
  
  const response = UrlFetchApp.fetch(url, {
    'method': 'GET',
    'headers': {
      'Authorization': `Bearer ${secrets.accessToken}`,
      'Square-Version': '2023-08-16',
      'Content-Type': 'application/json'
    },
  });
  const data = JSON.parse(response.getContentText());
  const paymentsMap = data.payments.reduce(function(map, obj) {
      map[obj.id] = obj;
      return map;
  }, {});
  return paymentsMap;
}
// Sample Output
/*
{
  "10Bc1YhxVMzDR0zJBE52CHCMhcIZY": {
    "id": "10Bc1YhxVMzDR0zJBE52CHCMhcIZY",
    "created_at": "2023-09-12T12:01:27.345Z",
    "updated_at": "2023-09-12T12:01:31.699Z",
    "amount_money": {
      "amount": 17500,
      "currency": "USD"
    },
    "status": "COMPLETED",
    "delay_duration": "PT168H",
    "source_type": "CARD",
    "card_details": {
      "status": "CAPTURED",
      "card": {
        "card_brand": "MASTERCARD",
        "last_4": "6025",
        "exp_month": 6,
        "exp_year": 2026,
        "fingerprint": "sq-1-yAaqK8_WTwlZnljlTU7UBbDRYs44Obn6bD5EX8-TxecRuc8x2pUzPwBhr6nbwqOkqA",
        "card_type": "DEBIT",
        "prepaid_type": "NOT_PREPAID",
        "bin": "526913"
      },
      "entry_method": "KEYED",
      "cvv_status": "CVV_ACCEPTED",
      "avs_status": "AVS_ACCEPTED",
      "auth_result_code": "462553",
      "statement_description": "SQ *TEAM 4909 INC.",
      "card_payment_timeline": {
        "authorized_at": "2023-09-12T12:01:28.134Z",
        "captured_at": "2023-09-12T12:01:28.489Z"
      }
    },
    "location_id": "LP96G97G7C0QC",
    "order_id": "cHs4FKte7K8xutf7hTmvhJDafRQZY",
    "reference_id": "1222789686",
    "risk_evaluation": {
      "created_at": "2023-09-12T12:03:30.754Z",
      "risk_level": "NORMAL"
    },
    "processing_fee": [
      {
        "effective_at": "2023-09-12T14:01:29.000Z",
        "type": "INITIAL",
        "amount_money": {
          "amount": 538,
          "currency": "USD"
        }
      }
    ],
    "buyer_email_address": "katie@littletonrobotics.org",
    "billing_address": {
      "postal_code": "01460",
      "country": "US"
    },
    "shipping_address": {
      "address_line_1": "8 Colburn Lane",
      "locality": "Littleton",
      "administrative_district_level_1": "MA",
      "postal_code": "01460",
      "country": "US",
      "first_name": "Katie",
      "last_name": "Bonner"
    },
    "customer_id": "8M23T3ETHN1NV3SQEB1YNJHVR8",
    "total_money": {
      "amount": 17500,
      "currency": "USD"
    },
    "approved_money": {
      "amount": 17500,
      "currency": "USD"
    },
    "receipt_number": "10Bc",
    "receipt_url": "https://squareup.com/receipt/preview/10Bc1YhxVMzDR0zJBE52CHCMhcIZY",
    "delay_action": "CANCEL",
    "delayed_until": "2023-09-19T12:01:27.345Z",
    "application_details": {
      "square_product": "ECOMMERCE_API",
      "application_id": "sq0idp-w46nJ_NCNDMSOywaCY0mwA"
    },
    "version_token": "1p3tktOqsNJmWdGpFLqtf8y1ywiCXOTJ7mBTcErjFLP6o"
  },
}
*/
