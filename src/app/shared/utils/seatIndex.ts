import { CarriageMap } from '@/core/models/carriages.model';

export function getSeatIndex(
  carNumber: number,
  seat: number,
  carriages: string[],
  carriageMap: CarriageMap,
) {
  const seatsPerTrain = carriages.map((car) => carriageMap[car].seats);

  const previousSeats = seatsPerTrain
    .slice(0, carNumber - 1)
    .reduce((sum, seats) => sum + seats, 0);

  return previousSeats + seat;
}

export function getCarriageAndSeat(
  seatIndex: number,
  carriages: string[],
  carriageMap: CarriageMap,
): { carNumber: number; seat: number } {
  let cumulativeSeats = 0;

  for (let i = 0; i < carriages.length; i += 1) {
    const seatsInCarriage = carriageMap[carriages[i]].seats;
    cumulativeSeats += seatsInCarriage;

    if (seatIndex <= cumulativeSeats) {
      const seatInCarriage = seatIndex - (cumulativeSeats - seatsInCarriage);
      return { carNumber: i + 1, seat: seatInCarriage };
    }
  }

  throw Error('Invalid seat index');
}
