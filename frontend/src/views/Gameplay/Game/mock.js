import { Card } from "../../../components/type";

export const gameTestData = {
  playerCards: [
    Card.defuse,
    Card.common1,
    Card.common1,
    Card.common2,
    Card.common2,
    Card.common2,
    Card.common3,
    Card.common4,
    Card.common5,
    Card.attack,
    Card.favor,
    Card.nope,
    Card.seeTheFuture,
    Card.shuffle,
    Card.skip,
  ],
  seeTheFutureCards: [Card.attack, Card.defuse, Card.nope],
  latestUsedCard: Card.defuse,
};
