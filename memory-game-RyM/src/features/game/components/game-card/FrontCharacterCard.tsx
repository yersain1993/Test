import type { Card } from '../../types/character';

type FrontCharacterCardProps = {
  card: Card;
};

export default function FrontCharacterCard({ card }: FrontCharacterCardProps) {
  return (
    <section className="flex h-72 w-53 rounded-lg bg-white px-4 pt-4 pb-6 shadow-md">
      <div className="flex h-55.5 flex-col items-center gap-2">
        <img
          src={card.image}
          alt={card.name}
          className="size-45 rounded-lg object-cover"
        />
        <div className="flex h-auto w-full flex-col items-start justify-center">
          <h2 className="h-11 text-start text-[1rem] leading-5.5 font-bold">
            {card.name}
          </h2>
          <span className="flex h-3 text-start">
            <p className="text-[12px]">{`${card.status} - ${card.species}`}</p>
          </span>
        </div>
      </div>
    </section>
  );
}
