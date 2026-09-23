export default function Hero() {
  return (
    // Used by useScrollVisibility to switch the fixed navigation to its solid state.
    <div
      className='flex justify-between items-center mx-auto p-6 max-w-7xl min-h-screen lg:p-8'
      data-navigation-hero
      id='hero-section'
    >
      <div
        id='content'
        className='flex flex-col gap-4 xl:flex-row xl:items-center xl:gap-4'
      >
        <div id='inner-container-1' className='text-left'>
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
            <button className='bg-wayfinder-gold text-deep-water px-7 py-3 rounded-md cursor-pointer'>
              View Work
            </button>
            <button className='bg-transparent border-2 border-deep-water px-7 py-3 rounded-md cursor-pointer'>
              Get in Touch
            </button>
          </div>
        </div>
        <div
          id='inner-container-2'
          className='basis-1/2 font-mono text-xs text-left opacity-45 md:text-sm xl:text-right'
        >
          <p>21.3069° N</p>
          <p>157.8583° W</p>
        </div>
      </div>
    </div>
  );
}
