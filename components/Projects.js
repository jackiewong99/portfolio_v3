import { projectList } from "assets/lists";
import { ArrowExpand01Icon, Folder01Icon, GithubIcon } from "hugeicons-react";

const Projects = () => {
  return (
    <div
      id="projects"
      className="flex min-h-screen flex-col items-center px-8 py-12"
    >
      <div className="flex justify-center pb-16">
        <h1 className="text-4xl font-bold tracking-tight text-forest-700 xl:text-8xl">
          Projects
        </h1>
      </div>
      <div className="grid w-4/5 grid-cols-1 gap-4 p-5 md:grid-cols-2 lg:grid-cols-3 2xl:w-3/5">
        {projectList.map((project, index) => {
          return <ProjectCard project={project} key={index} />;
        })}
      </div>
    </div>
  );
};

const ProjectCard = ({ project }) => {
  return (
    <div className="flex flex-col gap-5 rounded-md bg-forest-100 p-5 shadow-lg duration-100 ease-in hover:-translate-y-[5px] hover:transition-all">
      <div className="flex justify-between text-forest-700">
        <div className="flex cursor-pointer gap-3">
          <a
            href={project.website}
            target="_blank"
            className="duration-100 ease-in hover:opacity-60 hover:transition-all"
          >
            <Folder01Icon size={24} color="#5c8d89" strokeWidth={2.5} />
          </a>
          <a
            href={project.github_repo}
            target="_blank"
            className="duration-100 ease-in hover:opacity-60 hover:transition-all"
          >
            <GithubIcon size={24} color="#5c8d89" strokeWidth={2.5} />
          </a>
        </div>
        <div className="cursor-pointer duration-100 ease-in hover:opacity-60 hover:transition-all">
          <a href={project.github_repo} target="_blank">
            <ArrowExpand01Icon size={24} color="#5c8d89" strokeWidth={2.5} />
          </a>
        </div>
      </div>
      <div className="flex min-h-52 flex-col gap-5">
        <a
          href={project.website}
          target="_blank"
          className="cursor-pointer duration-100 ease-in hover:opacity-60 hover:transition-all"
        >
          <h2 className="text-2xl font-semibold text-forest-700">
            {project.title}
          </h2>
        </a>
        <h5 className="text-lg text-forest-800">{project.description}</h5>
      </div>
      <ul className="flex items-center justify-start gap-5">
        {project.tech_list.map((tech_name, index) => {
          return (
            <li key={index} className="text-sm text-forest-800 opacity-60">
              {tech_name}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Projects;
