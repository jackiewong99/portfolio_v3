const Contact = () => {
  return (
    <div
      id="contact"
      className="flex min-h-[50vh] flex-col items-center px-8 py-24"
    >
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-4xl font-bold tracking-tight text-forest-700 xl:text-7xl">
          Say Hi
        </h1>
        <h5 className="max-w-lg text-center text-sm text-forest-300 lg:text-lg">
          I&apos;m always looking for new opportunities and my inbox is always
          open to any messages. I will get back to inquiries, questions, or any
          other messages as soon as possible!
        </h5>
        <a
          className="cursor-pointer rounded-md border-4 border-solid border-forest-700 bg-yellow-100 px-8 py-5 text-sm text-forest-300 duration-100 ease-in hover:bg-[#ececd399] hover:opacity-60 hover:transition-all active:bg-[#ececd34D] active:opacity-30 lg:text-lg"
          href="mailto:wongzjackie@gmail.com"
        >
          Get in Touch
        </a>
      </div>
    </div>
  );
};

export default Contact;
