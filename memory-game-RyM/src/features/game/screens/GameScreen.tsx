import Layout from '@/shared/components/ui/Layout';
import Button from '@/shared/components/ui/Button';
import { useEffect, useState } from 'react';
import { fetchCharacters } from '../services/rickAndMortyService';
import type { Character } from '../types/character';
import CharacterCard from '../components/CharacterCard';

const GameScreen = () => {
  const [characters, setCharacters] = useState<Character[]>([]);

  const handlePlay = async () => {
    console.log('Iniciando juego...');
  };

  useEffect(() => {
    const LoadData = async () => {
      try {
        const fetchCharactersData = await fetchCharacters(
          Math.floor(Math.random() * 5) + 1, // página random para variedad
          6
        );
        const chars = await fetchCharactersData;
        setCharacters(chars);
      } catch (error) {
        console.error('Error loading characters:', error);
      }
    };

    LoadData();
  }, []);

  console.log(characters);

  return (
    <Layout>
      <section className="w-full max-w-3xl rounded-[28px] border-2 border-[#1f3247] bg-[#FFFAC2] px-6 py-8 text-center shadow-[0_6px_0_#c8df3f] sm:px-10 sm:py-12">
        <CharacterCard character={characters[0]} />

        <div className="mt-8 flex justify-center">
          <Button className="px-8" onClick={handlePlay} type="button">
            Jugar
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default GameScreen;
