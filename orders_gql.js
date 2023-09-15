function test_getOrdersGql() {
  const startDate = "2023-08-01T20:00:00";
  const orders = getOrdersGql(startDate)
  console.log(JSON.stringify(orders, null, 2))
}

// where startDate is an iso8601 date: "2023-08-01T20:00:00"
function getOrdersGql(startDate) {
  const query = `
    query OrdersQuery($merchantId: ID!, $startAt: DateTime) {
      orders(
        filter: {
          merchantId: { equalToAnyOf: [$merchantId] }
          state: {equalToAnyOf: OPEN },
          createdAt: {startAt: $startAt}
      }) {
          nodes {
            id
            createdAt
            totalMoney {
              amount
              currency
            }
            lineItems {
              name
              quantity
              totalMoney {
                amount
                currency
              }
              modifiers {
                name
              }
              grossSales {
                amount
              }
              totalDiscount {
                amount
              }
              itemVariation {
                name
                sku
              }
            }
            customer {
              id
              emailAddress
              familyName
              givenName
            }
            tenders {
              paymentId: id
              payment {
                cardDetails {
                  entryMethod
                  statementDescription
                  status
                }
              }
            }
          }
        }
    }`

  const body = {
    "query": query,
    "variables": {
      "startAt": `${startDate}+00:00`,
      "merchantId": secrets.merchantId
    },
    "operationName": "OrdersQuery"
  }

  const response = UrlFetchApp.fetch("https://connect.squareup.com/public/graphql",
  {
    "headers": {
      "accept": "application/json",
      "authorization": `Bearer ${secrets.accessToken}`,
      "content-type": "application/json",
    },
    "method": "POST",
    "payload": JSON.stringify(body),
  });
  const resData = JSON.parse(response.getContentText());
  const orders = resData?.data?.orders?.nodes;
  if (!orders) return orders;

  const filtered = orders.filter(o => {
    for (const tender of o.tenders) {
      if (tender.payment.cardDetails.status == "FAILED") return false;
    }
    return true;
  });
  return filtered;
}

// Sample Output
/*
[
  {
    "id": "<ORDER ID>",
    "lineItems": [
      {
        "name": "Team Registration - Second Robot",
        "quantity": "1",
        "totalMoney": {
          "amount": 17500,
          "currency": "USD"
        }
      }
    ],
    "customer": {
      "id": "<CUSTOMER ID>",
      "emailAddress": "<EMAIL>",
      "familyName": "<FIRST>",
      "givenName": "<LAST>"
    },
    "tenders": [
      {
        "paymentId": "<PAYMENT ID>"
      }
    ]
  },
  ...
]
*/







