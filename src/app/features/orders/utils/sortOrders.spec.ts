import handleOrderData from './handleOrderData';
import sortOrders from './sortOrders';

describe('sortOrders', () => {
  const mockOrders: ReturnType<typeof handleOrderData>[] = [
    {
      orderId: 1,
      startCity: 'City A',
      endCity: 'City B',
      startTripTime: new Date('2023-01-01T12:00:00Z').getTime(),
      endTripTime: new Date('2023-01-01T14:00:00Z').getTime(),
      tripDuration: 7200000, // 2 hours in ms
      carriageType: 'Type A',
      carNumber: 1,
      seatNumber: 10,
      price: 100,
      owner: 'John Doe',
      status: 'active',
    },
    {
      orderId: 2,
      startCity: 'City C',
      endCity: 'City D',
      startTripTime: new Date('2023-01-01T10:00:00Z').getTime(),
      endTripTime: new Date('2023-01-01T12:00:00Z').getTime(),
      tripDuration: 7200000, // 2 hours in ms
      carriageType: 'Type B',
      carNumber: 2,
      seatNumber: 15,
      price: 150,
      owner: 'Jane Doe',
      status: 'completed',
    },
    {
      orderId: 3,
      startCity: 'City E',
      endCity: 'City F',
      startTripTime: new Date('2023-01-01T11:00:00Z').getTime(),
      endTripTime: new Date('2023-01-01T13:00:00Z').getTime(),
      tripDuration: 7200000, // 2 hours in ms
      carriageType: 'Type C',
      carNumber: 3,
      seatNumber: 20,
      price: 200,
      owner: 'Alice Smith',
      status: 'rejected',
    },
  ];

  it('should sort orders by startTripTime in ascending order', () => {
    const sortedOrders = sortOrders(mockOrders);

    expect(sortedOrders[0].orderId).toBe(2); // earliest start time
    expect(sortedOrders[1].orderId).toBe(3); // middle start time
    expect(sortedOrders[2].orderId).toBe(1); // latest start time
  });

  it('should handle an empty array', () => {
    const sortedOrders = sortOrders([]);

    expect(sortedOrders).toEqual([]);
  });

  it('should handle a single order without changing the array', () => {
    const singleOrder = [mockOrders[0]];
    const sortedOrders = sortOrders(singleOrder);

    expect(sortedOrders).toEqual(singleOrder);
  });
});
