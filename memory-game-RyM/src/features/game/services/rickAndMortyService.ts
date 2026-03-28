// services/rickAndMortyService.ts
import axios from 'axios';
import type { Character } from '@/features/game/types/character';

const GQL_URL = 'https://rickandmortyapi.com/graphql';

const GET_CHARACTERS_QUERY = `
  query GetCharacters($page: Int!) {
    characters(page: $page) {
      results {
        id
        name
        image
        status
        species
      }
    }
  }
`;

export const fetchCharacters = async (
  page: number,
  limit: number
): Promise<Character[]> => {
  const { data } = await axios.post<{
    data: { characters: { results: Character[] } };
  }>(GQL_URL, {
    query: GET_CHARACTERS_QUERY,
    variables: { page },
  });

  return data.data.characters.results.slice(0, limit);
};
