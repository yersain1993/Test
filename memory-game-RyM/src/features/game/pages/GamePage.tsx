import Layout from '@/shared/components/ui/Layout';
import { useCharacters } from '../hooks/useCharacters';
import GridCard from '../components/GridCard';

const GamePage = () => {
  const { isLoading, error, startGame } = useCharacters();

  return (
    <Layout>
      <section className="w-full max-w-260 rounded-[28px] border-2 border-[#1f3247] bg-[#FFFAC2] px-6 py-8 text-center shadow-[0_6px_0_#c8df3f] sm:px-10 sm:py-12 md:min-h-max lg:max-h-max">
        <GridCard isLoading={isLoading} error={error} startGame={startGame} />
      </section>
    </Layout>
  );
};

export default GamePage;
