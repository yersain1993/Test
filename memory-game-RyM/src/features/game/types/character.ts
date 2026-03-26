export interface Character {
  id: string;
  name: string;
  image: string;
  status: string;
  species: string;
}

export interface Card {
  uid: string;        // único por carta (id + "_a" o "_b")
  characterId: string;
  name: string;
  image: string;
  status: string;
  species: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export type GameStatus = "idle" | "preview" | "playing" | "finished";