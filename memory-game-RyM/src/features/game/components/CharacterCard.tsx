import type { Character } from "../types/character";
import BackCharacterCard from "./BackCharacterCard";
import FrontCharacterCard from "./FrontCharacterCard";

type Props = {
    character: Character;
};

export default function CharacterCard({ character }: Props) {
  return (
    <>
    <FrontCharacterCard character={character} />
    <BackCharacterCard />
    </>
  );
}
