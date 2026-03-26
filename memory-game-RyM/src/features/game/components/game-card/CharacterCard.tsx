import {
  FlipCard,
  FlipCardBack,
  FlipCardFront,
} from '../../animations/FlipAnimation';
import type { Character } from '../../types/character';
import BackCharacterCard from './BackCharacterCard';
import FrontCharacterCard from './FrontCharacterCard';

type CharacterCardProps = {
  character: Character;
};

const flipAnimationClass = true;

export default function CharacterCard({ character }: CharacterCardProps) {
  return (
    <FlipCard
      isFlipped={flipAnimationClass}
      className="relative h-72 w-53 cursor-pointer"
    >
      <FlipCardFront>
        <FrontCharacterCard character={character} />
      </FlipCardFront>
      <FlipCardBack>
        <BackCharacterCard />
      </FlipCardBack>
    </FlipCard>
  );
}
