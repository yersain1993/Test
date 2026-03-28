import axios from 'axios';
import { describe, expect, it, vi } from 'vitest';
import { fetchCharacters } from './rickAndMortyService';

vi.mock('axios');

describe('fetchCharacters', () => {
  it('calls graphql endpoint and returns characters sliced by limit', async () => {
    const axiosPostMock = vi.mocked(axios.post);
    axiosPostMock.mockResolvedValueOnce({
      data: {
        data: {
          characters: {
            results: [
              {
                id: '1',
                name: 'Rick',
                image: 'rick.png',
                status: 'Alive',
                species: 'Human',
              },
              {
                id: '2',
                name: 'Morty',
                image: 'morty.png',
                status: 'Alive',
                species: 'Human',
              },
            ],
          },
        },
      },
    });

    const result = await fetchCharacters(4, 1);

    expect(axiosPostMock).toHaveBeenCalledWith(
      'https://rickandmortyapi.com/graphql',
      {
        query: expect.stringContaining('query GetCharacters'),
        variables: { page: 4 },
      }
    );
    expect(result).toEqual([
      {
        id: '1',
        name: 'Rick',
        image: 'rick.png',
        status: 'Alive',
        species: 'Human',
      },
    ]);
  });

  it('propagates axios errors', async () => {
    const axiosPostMock = vi.mocked(axios.post);
    axiosPostMock.mockRejectedValueOnce(new Error('request failed'));

    await expect(fetchCharacters(1, 6)).rejects.toThrow('request failed');
  });
});
