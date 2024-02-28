const Header = () => {
  return (
    <div className="flex min-h-screen min-w-full justify-center px-8 py-12">
      <div className="flex flex-col items-start justify-center gap-2 md:gap-3 md:text-lg lg:gap-5 lg:text-xl">
        <h5 className="text-forest-300 text-sm md:text-base lg:text-xl">
          Hello, my name is
        </h5>
        <h1 className="text-forest-700 text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl xl:text-8xl">
          Jackie Wong.
        </h1>
        <h1 className="text-forest-700 text-pretty text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl xl:text-8xl">
          I build projects for the web.
        </h1>
        <h5 className="text-forest-300 w-3/4 text-pretty break-words text-sm md:w-1/2 md:text-base lg:text-xl">
          I am a software engineer based in Honolulu, HI specializing in
          frontend engineering.
        </h5>
      </div>
    </div>
  );
};

export default Header;
