import cardLogo from '@/assets/card-logo.svg';

export default function BackCharacterCard() {
  return (
    <section className="flex h-72 w-53 flex-col items-center justify-center gap-2 rounded-lg bg-[#A2F2F9] px-4 pt-4 pb-6 shadow-md">
      <img src={cardLogo} alt="Card logo" className="size-45 rounded-lg" />
    </section>
  );
}
