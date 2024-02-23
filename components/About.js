import Image from "next/image";
import profileImg from "assets/profile_img.jpg";

const About = () => {
  const skills = [
    "JavaScript (ES6+)",
    "Next.js",
    "HTML & (S)CSS",
    "React.js",
    "Tailwind CSS",
    "Node.js",
  ];

  return (
    <div className="flex min-h-screen min-w-full flex-col items-center px-8 py-12">
      <div className="flex justify-center pb-16">
        <h1 className="text-forest-700 text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl xl:text-8xl">
          About Me
        </h1>
      </div>
      {/* ABOUT CONTENT */}
      <div className="flex w-4/5 flex-col items-center justify-around gap-6 px-16 text-left sm:w-3/4 xl:flex-row xl:items-center xl:justify-around xl:gap-20 2xl:gap-6">
        <div id="image" className="basis-1/2">
          <Image
            src={profileImg}
            width={500}
            height={500}
            alt="Jackie Wong Portrait Image"
            className="rounded-full md:shrink-0"
          />
        </div>
        <div
          id="caption"
          className="flex basis-1/2 flex-col items-start gap-6 text-pretty break-words text-left"
        >
          <h5 className="text-forest-300 text-sm lg:text-base xl:text-xl">
            Hi there! I&apos;m Jackie, a software engineer who graduated from
            the University of Hawai&apos;i at Manoa. I am currently based in
            Honolulu, HI and am passionate about building cool and scalable web
            apps that deliver a simple user interface and modern user
            experience, while utilizing current backend technologies when
            applicable.
          </h5>
          <h5 className="text-forest-300 text-sm lg:text-base xl:text-xl">
            I am currently working with React.js, Next.js, and Tailwind CSS.
          </h5>
          <h5 className="text-forest-300 text-sm lg:text-base xl:text-xl">
            A few technologies I&apos;ve worked with:
          </h5>
          <ul className="grid grid-cols-1 gap-x-20 gap-y-1.5 overflow-hidden sm:grid-cols-2 sm:gap-x-14 lg:gap-x-10">
            {skills.map((skill, i) => {
              return (
                <li
                  key={i}
                  className="text-forest-700 text-nowrap text-xs lg:text-sm xl:text-base"
                >
                  <span className="pr-1.5">❯</span> {skill}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;
