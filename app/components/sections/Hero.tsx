export default function Hero() {
  return (
    <div
      className='flex items-center justify-center max-w-[1120] min-h-screen'
      data-navigation-hero
    >
      {/* Used by useScrollVisibility to switch the fixed navigation to its solid state. */}
      <h1 className='font-display text-5xl font-semibold'>Jackie Wong</h1>
    </div>
  );
}
