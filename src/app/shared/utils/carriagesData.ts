import { CarriageMap } from '@/core/models/carriages.model';
import { CarriageData, Segment } from '@/core/models/search.model';
import { SeatsDataByType, TrainCarriageData } from '@/core/models/trip.model';

export function getSeatsData(
  trainCarriages: string[],
  occupiedSeats: number[],
  carriageMap: CarriageMap,
): TrainCarriageData[] {
  let firstCarriageSeat = 1;

  return trainCarriages.map((code, i) => {
    const maxSeats = carriageMap[code].seats;
    const lastCarriageSeat = firstCarriageSeat + maxSeats - 1;

    const occupiedInCarriage = occupiedSeats.filter(
      (seat) => seat >= firstCarriageSeat && seat <= lastCarriageSeat,
    );

    firstCarriageSeat = lastCarriageSeat + 1;

    return {
      code,
      carNumer: i + 1,
      emptySeats: maxSeats - occupiedInCarriage.length,
      occupiedSeats: occupiedInCarriage,
    };
  });
}

export function countEmptySeats(
  trainCarriages: string[],
  occupiedSeats: number[],
  carriageMap: CarriageMap,
) {
  const data = getSeatsData(trainCarriages, occupiedSeats, carriageMap);
  return data.reduce<{ [code: string]: number }>(
    (acc, { code, emptySeats }) => {
      acc[code] = (acc[code] || 0) + emptySeats;
      return acc;
    },
    {},
  );
}

export function getDataByCarriage(
  trainCarriages: string[],
  allOccupiedSeats: number[],
  carriageMap: CarriageMap,
) {
  const seatsData = getSeatsData(trainCarriages, allOccupiedSeats, carriageMap);
  return seatsData.reduce<SeatsDataByType>((acc, { code, ...data }) => {
    acc[code] = (acc[code] || []).concat(data);
    return acc;
  }, {});
}

export function getCarriageData(
  trainCarriages: string[],
  carriageMap: CarriageMap,
  ridePath: Segment[],
): CarriageData[] {
  const allOccupiedSeats = ridePath.reduce<number[]>((acc, segment) => {
    const { occupiedSeats } = segment;
    return Array.from(new Set(acc.concat(occupiedSeats)));
  }, []);

  const freeSeats = countEmptySeats(
    trainCarriages,
    allOccupiedSeats.sort((a, b) => a - b),
    carriageMap,
  );

  const ridePriceForCarriages = ridePath.reduce<{ [code: string]: number }>(
    (acc, { price }) => {
      Object.entries(price).forEach(([code, cost]) => {
        acc[code] = (acc[code] || 0) + cost;
      });
      return acc;
    },
    {},
  );

  const uniqueTrainCarriages = Object.keys(ridePriceForCarriages);
  return uniqueTrainCarriages.map((code) => {
    return {
      name: carriageMap[code].name,
      price: ridePriceForCarriages[code],
      freeSeats: freeSeats[code],
    };
  });
}
