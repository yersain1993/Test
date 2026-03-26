import type { Character } from '../types/character';

type Props = {
  character: Character;
};

export default function FrontCharacterCard({ character }: Props) {
    
  return (
    <section className="w-53 h-65 flex flex-col items-center justify-center rounded-lg bg-white px-4 pt-4 pb-6 shadow-md gap-2 ">
      <img src={character?.image} alt={character?.name} className='w-44 h-44 rounded-lg' />
      <div className='flex flex-col items-start w-full'>
        <h2 className="text-[1rem] leading-5.5 font-bold">{character?.name}</h2>
        <span className="flex text-start">
          <p className='text-sm'>{`${character?.status} - ${character?.species}`}</p>
        </span>
      </div>
    </section>
  );
}
