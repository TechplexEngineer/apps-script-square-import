function test_combineOrdersPayments() {
  const startDate = "2023-08-01T20:00:00";
  const orders = getOrdersGql(startDate);
  const paymentsMap = getPayments(startDate);

  const combined = combineOrdersPayments(orders, paymentsMap);
  console.log(JSON.stringify(combined, null, 2))
}

function combineOrdersPayments(orders, paymentsMap) {
  const result = [];
  for (const order of orders) {
    const res = Object.assign({}, order) 

    res.processingFee = res.tenders.reduce((total, tender)=>{
      // console.log(total, tender.paymentId, paymentsMap[tender.paymentId].processing_fee)
      total += paymentsMap[tender.paymentId].processing_fee?.reduce((feeTotal, feeObj) => {
        feeTotal += feeObj.amount_money.amount
        return feeTotal;
      }, 0);
      return total;
    }, 0)
    if (!res.customer) {
      const payment = paymentsMap[res.tenders[0].paymentId];
      
      res.customer = {
        emailAddress: payment.buyer_email_address,
        familyName: payment.shipping_address.last_name,
        givenName: payment.shipping_address.first_name,
      }
    }
    
    result.push(res)
  }
  return result;
}
