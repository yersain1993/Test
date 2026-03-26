import Layout from '@/shared/components/ui/Layout';
import Button from '@/shared/components/ui/Button';
import { useEffect, useState } from 'react';
import { fetchCharacters } from '../services/rickAndMortyService';
import type { Character } from '../types/character';
import GridCard from '../components/GridCard';

const GamePage = () => {
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

  return (
    <Layout>
      <section className="w-full max-w-260 rounded-[28px] border-2 border-[#1f3247] bg-[#FFFAC2] px-6 py-8 text-center shadow-[0_6px_0_#c8df3f] sm:px-10 sm:py-12 md:max-h-265.25 lg:max-h-265.25">
        <GridCard characters={characters} />
        <div className="mt-8 flex justify-center">
          <Button
            className="w-2/5 px-8 sm:w-2/6 md:w-2/6 lg:w-1/5"
            onClick={handlePlay}
            type="button"
          >
            Jugar
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default GamePage;
