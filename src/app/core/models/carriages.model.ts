export type TCarriage = {
  code: string;
  name: string;
  rows: number;
  leftSeats: number;
  rightSeats: number;
};

export type TCarriageWithSeats = TCarriage & { seats: number };

export type CarriageMap = { [code: string]: TCarriageWithSeats };
