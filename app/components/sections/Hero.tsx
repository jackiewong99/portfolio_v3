export default function Hero() {
  return (
    // Used by useScrollVisibility to switch the fixed navigation to its solid state.
    <div
      className='flex items-stretch mx-auto p-6 max-w-7xl min-h-screen lg:p-8 xl:items-center'
      data-navigation-hero
      id='hero-section'
    >
      <div
        id='content'
        className='flex flex-col gap-4 xl:flex-row xl:items-center'
      >
        <div id='inner-container-1' className='mt-auto text-left xl:mt-0'>
          <div className='flex flex-col gap-6 font-sans'>
            <p className='font-normal text-lg md:text-xl'>
              Frontend Engineer / IT System Administrator
            </p>
            <h1 className='font-display text-4xl font-semibold md:text-6xl'>
              I build fast, considered interfaces - currently with React,
              Next.js, and Node.
            </h1>
          </div>
          <div className='my-9 font-sans font-normal text-lg md:text-xl'>
            <p>Based in Honolulu, Hawai&apos;i.</p>
          </div>
          <div className='flex justify-start items-center gap-5 font-sans font-medium text-lg md:text-xl'>
            <button className='bg-wayfinder-gold text-deep-water px-7 py-3 rounded-md cursor-pointer transition hover:brightness-90 ease-in duration-150'>
              View Work
            </button>
            <button className='bg-transparent border-2 border-deep-water px-7 py-3 rounded-md cursor-pointer transition-colors hover:bg-sea-foam ease-in duration-150'>
              Get in Touch
            </button>
          </div>
        </div>
        <div
          id='inner-container-2'
          className='mt-auto font-mono text-xs text-left opacity-45 md:text-sm xl:text-right xl:basis-1/2 xl:mt-0'
        >
          <p>21.3069° N</p>
          <p>157.8583° W</p>
        </div>
      </div>
    </div>
  );
}
