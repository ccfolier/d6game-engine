type Dices = { [key: string]: number };
type Hands =
  | "Five Dice"
  | "Straight"
  | "Four Dice"
  | "Full House"
  | "Three Dice"
  | "Two Pair"
  | "One Pair"
  | "No hands";

const DICE_TYPE = 6;
const DICE_COUNT = Number(process.argv[2]) || 5;
const PICK = Math.min(5, DICE_COUNT);
const RATES = {
  "Five Dice": 10,
  "Four Dice": 5,
  Straight: 4,
  "Full House": 3,
  "Three Dice": 2,
  "Two Pair": 1,
  "One Pair": 0,
  "No hands": -5,
};

console.log(`roll ${DICE_COUNT} dices`);
console.log(JSON.stringify(main(), null, 4));

function main() {
  const array = createDicePattern(DICE_COUNT, DICE_TYPE);

  const results: Hands[] = array.map((arr) => {
    const patterns = combin(arr, PICK);
    const hands = patterns.map((pattern) => {
      const hand = detectHands(pattern);
      return hand;
    });
    hands.sort((a, b) => RATES[b] - RATES[a]);
    return hands[0];
  });

  const score = results.reduce((acc, cur) => {
    acc[cur] = acc[cur] || { value: 0, rate: 0 };
    acc[cur].value++;
    return acc;
  }, {} as { [key: string]: { value: number; rate: number } });

  Object.keys(score).forEach((key) => {
    score[key].rate = score[key].value / array.length;
  });

  return score;
}

function detectHands(array: number[]): Hands {
  const hands = toHands(array);
  if (hasFiveDice(hands)) return "Five Dice";
  if (hasStraight(hands)) return "Straight";
  if (hasFourDice(hands)) return "Four Dice";
  if (hasFullHouse(hands)) return "Full House";
  if (hasThreeDice(hands)) return "Three Dice";
  if (hasTwoPair(hands)) return "Two Pair";
  if (hasOnePair(hands)) return "One Pair";
  return "No hands";
}

function hasOnePair(dices: Dices): boolean {
  return Object.keys(dices).some((key) => dices[key] === 2);
}

function hasTwoPair(dices: Dices): boolean {
  return Object.keys(dices).filter((key) => dices[key] === 2).length === 2;
}

function hasThreeDice(dices: Dices): boolean {
  return Object.keys(dices).some((key) => dices[key] === 3);
}

function hasFullHouse(dices: Dices): boolean {
  return hasOnePair(dices) && hasThreeDice(dices);
}

function hasFourDice(dices: Dices): boolean {
  return Object.keys(dices).some((key) => dices[key] === 4);
}

function hasStraight(dices: Dices): boolean {
  const keys = Object.keys(dices).map((key) => parseInt(key));
  const min = Math.min(...keys);
  const max = Math.max(...keys);
  return max - min === 4 && keys.length === 5;
}

function hasFiveDice(dices: Dices): boolean {
  return Object.keys(dices).length === 1;
}

// utils
function createDicePattern(n: number, k: number): number[][] {
  const results = [] as number[][];
  const current: number[] = Array.from({ length: n }, () => 1);
  const isEnd = (array: number[]) => array.every((d) => d === k);
  while (!isEnd(current)) {
    results.push(current.slice());
    for (let i = 0; i < n; i++) {
      if (current[i] < k) {
        current[i]++;
        break;
      } else {
        current[i] = 1;
      }
    }
  }
  results.push(current.slice());
  return results;
}

function combin(array: number[], k: number): number[][] {
  const result = [] as number[][];
  const comb = (arr: number[], n: number[], k: number) => {
    if (k === 0) {
      result.push(n);
      return;
    }
    for (let i = 0; i < arr.length; i++) {
      comb(arr.slice(i + 1), n.concat(arr[i]), k - 1);
    }
  };
  comb(array, [], k);
  return result;
}

function toHands(array: number[]): Dices {
  return array.reduce((r, d) => {
    r[d] = r[d] || 0;
    r[d]++;
    return r;
  }, {} as Dices);
}
