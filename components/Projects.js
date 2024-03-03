import { projectList } from "assets/projects_list";

const Projects = () => {
  return (
    <div className="flex min-h-screen flex-col items-center px-8 py-12">
      <div className="flex justify-center pb-16">
        <h1 className="text-forest-700 tracking-tigh text-4xl font-bold xl:text-8xl">
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
    <div className="bg-forest-100 flex flex-col gap-5 rounded-md p-5 shadow-xl">
      <div className="text-forest-700 flex justify-between">
        <h5>link</h5>
        <h5>link</h5>
      </div>
      <div className="flex min-h-52 flex-col gap-5">
        <h2 className="text-forest-700 text-2xl font-semibold">
          {project.title}
        </h2>
        <h5 className="text-forest-800 text-lg">{project.description}</h5>
      </div>
      <ul className="flex items-center justify-start gap-5">
        {project.tech_list.map((tech_name, index) => {
          return (
            <li
              key={index}
              className="text-forest-800 text-base opacity-60 md:text-xs xl:text-sm min-[1643px]:text-lg"
            >
              {tech_name}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Projects;
