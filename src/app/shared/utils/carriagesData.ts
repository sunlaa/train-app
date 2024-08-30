import { CarriageMap } from '@/core/models/carriages.model';
import { CarriageData, Segment } from '@/core/models/search.model';
import { RideCarriageData, TrainCarriageData } from '@/core/models/trip.model';

function getBaseData(
  trainCarriages: string[],
  occupiedSeats: number[],
  carriageMap: CarriageMap,
) {
  let firstCarriageSeat = 1;

  const seatsData: TrainCarriageData[] = [];

  const freeSeatsPerCarType: Record<string, number> = {};

  trainCarriages.forEach((code, i) => {
    const maxSeats = carriageMap[code].seats;
    const lastCarriageSeat = firstCarriageSeat + maxSeats - 1;

    const occupiedInCarriage = occupiedSeats.filter(
      (seat) => seat >= firstCarriageSeat && seat <= lastCarriageSeat,
    );

    const emptySeats = maxSeats - occupiedInCarriage.length;

    seatsData.push({
      code,
      carNumber: i + 1,
      firstSeat: firstCarriageSeat,
      emptySeats,
      occupiedSeats: occupiedInCarriage,
    });

    firstCarriageSeat = lastCarriageSeat + 1;

    freeSeatsPerCarType[code] = (freeSeatsPerCarType[code] || 0) + emptySeats;
  });
  return { seatsData, freeSeatsPerCarType };
}

export function getGeneralCarriageData(
  trainCarriages: string[],
  carriageMap: CarriageMap,
  ridePath: Segment[],
): CarriageData[] {
  const allOccupiedSeats = ridePath
    .reduce<number[]>((acc, segment) => {
      const { occupiedSeats } = segment;
      return Array.from(new Set(acc.concat(occupiedSeats)));
    }, [])
    .sort((a, b) => a - b);

  const { freeSeatsPerCarType } = getBaseData(
    trainCarriages,
    allOccupiedSeats,
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
      freeSeats: freeSeatsPerCarType[code],
    };
  });
}

export function getRideCarriagesData(
  trainCarriages: string[],
  carriageMap: CarriageMap,
  ridePath: Segment[],
): RideCarriageData[] {
  const allOccupiedSeats = ridePath
    .reduce<number[]>((acc, segment) => {
      const { occupiedSeats } = segment;
      return Array.from(new Set(acc.concat(occupiedSeats)));
    }, [])
    .sort((a, b) => a - b);
  const { seatsData, freeSeatsPerCarType } = getBaseData(
    trainCarriages,
    allOccupiedSeats,
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

  const generalCarriagesInfo = Object.keys(ridePriceForCarriages).map(
    (code) => ({
      name: carriageMap[code].name,
      price: ridePriceForCarriages[code],
      freeSeats: freeSeatsPerCarType[code],
    }),
  );

  return generalCarriagesInfo.map((data) => {
    const carriages = seatsData.filter(
      (d) => carriageMap[d.code].name === data.name,
    );
    const { rows, leftSeats, rightSeats } = carriageMap[carriages[0].code];
    return {
      itemHeader: data,
      carriages,
      carriageView: { rows, leftSeats, rightSeats },
    };
  });
}
