function onMessage(message) {
    const roll = message.extend.roll;
    if (roll && roll.dices.length === 5 && !roll.secret) {
      const dices = roll.dices.map((d) => d.value);
      return {
        messages: [{ text: ">>> " + detectHands(dices) }]
      }      
    }
}

function detectHands(array) {
    const hands = toHands(array);
    if (hasFiveDice(hands))
        return "Five Dice [+10]";
    if (hasFourDice(hands))
        return "Four Dice [+5]";
    if (hasStraight(hands))
        return "Straight [+4]";
    if (hasFullHouse(hands))
        return "Full House [+3]";
    if (hasThreeDice(hands))
        return "Three Dice [+2]";
    if (hasTwoPair(hands))
        return "Two Pair [+1]";
    if (hasOnePair(hands))
        return "One Pair [0]";
    return "No hands [-5]";
}
function hasOnePair(dices) {
    return Object.keys(dices).some((key) => dices[key] === 2);
}
function hasTwoPair(dices) {
    return Object.keys(dices).filter((key) => dices[key] === 2).length === 2;
}
function hasThreeDice(dices) {
    return Object.keys(dices).some((key) => dices[key] === 3);
}
function hasFullHouse(dices) {
    return hasOnePair(dices) && hasThreeDice(dices);
}
function hasFourDice(dices) {
    return Object.keys(dices).some((key) => dices[key] === 4);
}
function hasStraight(dices) {
    const keys = Object.keys(dices).map((key) => parseInt(key));
    const min = Math.min(...keys);
    const max = Math.max(...keys);
    return max - min === 4 && keys.length === 5;
}
function hasFiveDice(dices) {
    return Object.keys(dices).length === 1;
}
function toHands(array) {
    return array.reduce((r, d) => {
        r[d] = r[d] || 0;
        r[d]++;
        return r;
    }, {});
}
