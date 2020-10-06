export const RoomType = {
    rank: 'Rank',
    custom: 'Custom',
}

export const Card = {
  explodingPuppy: "ExplodingPuppy", // Die if not have defuse
  defuse: "Defuse", // Use to prevent exploding puppy
  nope: "Nope", // Use to stop any action except explodingPuppy and defuse
  attack: "Attack", // Force next player to play 2 turns, can stack e.g. 4, 6, 8, ... turns
  skip: "Skip", // Immediately end your turn without drawing a card
  favor: "Favor", // Force any other player to give you 1 card from their hand
  seeTheFuture: "SeeTheFuture", // Privately view the top 3 cards from the Draw Pile
  shuffle: "Shuffle",
  common1: "Common1",
  common2: "Common2",
  common3: "Common3",
  common4: "Common4",
  common5: "Common5",
  backCard: "BackCard",
};

export function getCardImage(card) {
  // console.log(card);
  switch (card) {
    case Card.defuse:
      return defuse;
    case Card.attack:
      return attack;
    case Card.skip:
      return skip;
    case Card.shuffle:
      return shuffle;
    case Card.seeTheFuture:
      return see_the_future;
    case Card.nope:
      return nope;
    case Card.favor:
      return favor;
    case Card.common1:
      return common_1;
    case Card.common2:
      return common_2;
    case Card.common3:
      return common_3;
    case Card.common4:
      return common_4;
    case Card.common5:
      return common_5;
    case Card.explodingPuppy:
      return bomb;
    default:
      return card_back;
  }
}
