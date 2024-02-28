import { projectList } from "assets/projects_list";

const Projects = () => {
  return (
    <div className="flex min-h-screen flex-col items-center px-8 py-12">
      <div className="flex justify-center pb-16">
        <h1 className="text-forest-700 tracking-tigh text-4xl font-bold xl:text-8xl">
          Projects
        </h1>
      </div>
      <div className="grid w-3/5 grid-cols-1 gap-4 md:grid-cols-2 lg:w-4/5 lg:grid-cols-3 xl:w-3/5">
        {projectList.map((project, index) => {
          return <ProjectCard project={project} key={index} />;
        })}
      </div>
    </div>
  );
};

const ProjectCard = ({ project }) => {
  return (
    <div className="bg-forest-100 flex flex-col justify-between gap-4 rounded-md p-5 shadow-xl">
      <div className="text-forest-700 flex justify-between">
        <h5>link</h5>
        <h5>link</h5>
      </div>
      <div className="flex flex-col items-start justify-center gap-6 pb-10">
        <h2 className="text-forest-700 text-2xl font-semibold">
          {project.title}
        </h2>
        <h5 className="text-forest-800 text-lg">{project.description}</h5>
      </div>
      <div>
        <ul className="flex items-center justify-start">
          {project.tech_list.map((tech_name, index) => {
            return (
              <li key={index} className="text-forest-800 text-lg opacity-60">
                {tech_name}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Projects;
