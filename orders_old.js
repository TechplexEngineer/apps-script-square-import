// this does not include customer info
function searchSquareOrders(startDate) { 
    // Set up API request parameters
    const url = 'https://connect.squareup.com/v2/orders/search';
    const headers = {
        'Authorization': `Bearer ${secrets.accessToken}`,
        'Square-Version': '2023-08-16',
        'Content-Type': 'application/json'
    };
    const payload = {
      "query": {
        "filter": {
          "state_filter": {
            "states": [
              "OPEN"
            ]
          },
          "date_time_filter": {
            "created_at": {
              "start_at": "2023-08-01T20:00:00+00:00"
            }
          }
        }
      },
      'location_ids': [
          secrets.locationId
      ],
      'return_entries': false,
      'limit': 500
    };
    const options = {
        'method': 'POST',
        'headers': headers,
        'payload': JSON.stringify(payload),
    };
    
    // Make API request and parse response
    const response = UrlFetchApp.fetch(url, options);
    const data = JSON.parse(response.getContentText());
    const orders = data.orders.filter(o => {
      for (const tender of o.tenders) {
        if (tender.card_details.status == "FAILED") return false;
      }
      return true;
    });

    // const debug = [["Debug Data"]];
    // for (let order of orders) {
    //   debug.push([JSON.stringify(order)])
    // }
    // writeDataToSheet(debug, "Debug")
    
    
    return orders;
}