import { navLabels } from "assets/lists";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="fixed left-0 top-0 flex h-[10vh] w-full items-center justify-between px-14">
      <div>
        <a
          href="/"
          className="text-3xl font-bold tracking-widest text-forest-700 no-underline"
        >
          JACKIE WONG
        </a>
      </div>
      <ul className="flex w-1/3 justify-around">
        {navLabels.map((label, key) =>
          label.name != "RESUME" ? (
            <li key={key} className="text-base font-medium text-forest-700">
              <Link href={`#${label.url}`}>{label.name}</Link>
            </li>
          ) : (
            <li key={key} className="text-base font-medium text-forest-700">
              <a
                href="/pdf/Jackie_Wong_Resume.pdf"
                target="_blank"
                rel="noreferrer"
              >
                RESUME
              </a>
            </li>
          ),
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
