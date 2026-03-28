import logo from '@/assets/card-logo.svg';

function Loader() {
  return (
    <section className="animate-spin">
      <img src={logo} alt="Rick and Morty" />
    </section>
  );
}

export default Loader;
