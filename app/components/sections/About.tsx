import Image from 'next/image';

export default function About() {
  return (
    <section
      id='about'
      className='flex justify-between mx-auto max-w-7xl min-h-screen p-6 lg:p-8'
    >
      <div className='flex items-center'>
        <div className='flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-16'>
          <div className='w-full max-w-3xl self-center lg:self-auto lg:w-1/2'>
            <Image
              src='/profile_img.jpg'
              alt='Picture of Jackie Wong'
              width={300}
              height={300}
              className='object-cover w-full h-auto rounded-lg'
            />
          </div>
          <div className='flex flex-col gap-6'>
            <div id='about-id'>
              <h2 className='font-sans font-semibold text-3xl'>About</h2>
              <div aria-hidden='true' className='mt-3 h-0.5 w-22 bg-fog-line' />
            </div>
            <div className='font-sans text-prose flex flex-col gap-4 text-sm sm:text-base'>
              <p>
                Hi there! I&apos;m Jackie, a computer science graduate from the
                University of Hawai&apos;i at Manoa currently based in Honolulu,
                HI. I bring a software background to my active pursuit of IT
                system administration, network engineering, and cybersecurity,
                bridging the gap between building clean web applications and
                ensuring robust, secure underlying infrastructure.
              </p>
              <p>
                I am currently building with React.js, Next.js, Node.js, and
                Tailwind CSS.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
