import { CarriageMap } from '@/core/models/carriages.model';
import { Order } from '@/core/models/orders.model';
import { StationMap } from '@/core/models/stations.model';
import { TUser } from '@/core/models/users.model';
import { getRideDates } from '@/shared/utils';
import { getCarriageAndSeat } from '@/shared/utils/seatIndex';
import maskEmail from './maskEmail';

const handleOrderData = (
  data: Order,
  stationMap: StationMap,
  carriageMap: CarriageMap,
  users: TUser[],
) => {
  const {
    path,
    stationStart,
    stationEnd,
    seatId,
    carriages,
    userId,
    status,
    id,
  } = data;
  const route = data.schedule.segments;

  const startIndex = path.indexOf(stationStart);
  const endIndex = path.indexOf(stationEnd);

  const ridePath = route.slice(startIndex, endIndex + 1);

  const startStationName = stationMap[stationStart].city;
  const endStationName = stationMap[stationEnd].city;

  const { departureDate, arrivalDate } = getRideDates(ridePath);
  const tripDuration = arrivalDate - departureDate;

  const { carNumber, seat } = getCarriageAndSeat(
    seatId,
    carriages,
    carriageMap,
  );

  const carriageCode = carriages[carNumber - 1];
  const carriageType = carriageMap[carriageCode].name;

  const priceForCarriage = ridePath.reduce<number>((acc, { price }) => {
    let sum = acc;
    sum += price[carriageCode] ?? 0;
    return sum;
  }, 0);

  const ownerObj = users.find((u) => u.id === userId);
  let owner: string | undefined;
  if (ownerObj?.name) {
    owner = ownerObj.name;
  } else if (ownerObj?.email) {
    owner = maskEmail(ownerObj.email);
  }

  return {
    orderId: id,
    startCity: startStationName,
    endCity: endStationName,
    startTripTime: departureDate,
    endTripTime: arrivalDate,
    tripDuration,
    carriageType,
    carNumber,
    seatNumber: seat,
    price: priceForCarriage,
    owner,
    status,
  };
};

export default handleOrderData;
