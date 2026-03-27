import {
  FlipCard,
  FlipCardBack,
  FlipCardFront,
} from '../../animations/cards-animations/FlipAnimation';
import { useGameStore } from '../../store/useGameStore';
import type { Card } from '../../types/character';
import BackCharacterCard from './BackCharacterCard';
import FrontCharacterCard from './FrontCharacterCard';

type CharacterCardProps = {
  card: Card;
};

export default function CharacterCard({ card }: CharacterCardProps) {
  const flipCard = useGameStore((s) => s.flipCard);
  const status = useGameStore((s) => s.status);

  const handleClick = () => {
    if (status !== 'playing' || card.isMatched) return;
    flipCard(card.uid);
  };

  const showFace = status === 'preview' || card.isFlipped;

  console.log(status, card.isFlipped, card.isMatched);

  return (
    <FlipCard
      isFlipped={!showFace}
      className="relative h-72 w-53 cursor-pointer"
      onClick={handleClick}
    >
      <FlipCardFront>
        <FrontCharacterCard card={card} />
      </FlipCardFront>
      <FlipCardBack>
        <BackCharacterCard />
      </FlipCardBack>
    </FlipCard>
  );
}
