import { Position } from "./slayer.tsx";
import { ItemI } from "./context.tsx";
import iconStyles from "./icons.module.scss";

interface IndexPositionMappingI {
  [key: number]: Position;
}

export function indexToPosition(index: number): Position {
  const mapping: IndexPositionMappingI = {
    0: { row: 4, col: 4 },
    1: { row: 4, col: 3 },
    2: { row: 4, col: 2 },
    3: { row: 4, col: 1 },
    4: { row: 4, col: 0 },
    5: { row: 3, col: 0 },
    6: { row: 2, col: 0 },
    7: { row: 1, col: 0 },
    8: { row: 0, col: 1 },
    9: { row: 0, col: 1 },
    10: { row: 0, col: 2 },
    11: { row: 0, col: 3 },
    12: { row: 1, col: 3 },
    13: { row: 1, col: 4 },
    14: { row: 2, col: 4 },
    15: { row: 3, col: 4 },
  };
  return mapping[index];
}

interface PositionIndexMappingI {
  [key: number]: {
    [key: number]: number;
  };
}

export function positionToIndex({ row, col }: Position): number {
  const mapping: PositionIndexMappingI = {
    0: { 0: 8, 1: 9, 2: 10, 3: 11 },
    1: { 0: 7, 1: 8, 3: 12, 4: 13 },
    2: { 0: 6, 4: 14 },
    3: { 0: 5, 4: 15 },
    4: { 0: 4, 1: 3, 2: 2, 3: 1, 4: 0 },
  };
  return mapping[row][col];
}

export function isDice(item: ItemI): boolean {
  return item.className === iconStyles.event_dice_x1;
}

export function tee<T>(value: T) {
  console.log(value);
  return value;
}
