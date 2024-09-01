import handleOrderData from './handleOrderData';

const sortOrders = (orders: ReturnType<typeof handleOrderData>[]) => {
  return orders.sort(
    (a, b) => a.startTripTime.getTime() - b.startTripTime.getTime(),
  );
};

export default sortOrders;
