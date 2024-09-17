import handleOrderData from './handleOrderData';

const sortOrders = (orders: ReturnType<typeof handleOrderData>[]) => {
  return orders.sort((a, b) => a.startTripTime - b.startTripTime);
};

export default sortOrders;
