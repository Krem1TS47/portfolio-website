const Projects = () => {
  return (
    <main className="min-h-screen flex items-center justify-center px-8 page-transition relative overflow-hidden">
      {/* Teal-Cyan-Blue Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-950 via-slate-950 to-cyan-950"></div>
      <div className="absolute inset-0 bg-gradient-to-tl from-cyan-950/40 via-transparent to-teal-950/30"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-sky-800/10 via-transparent to-transparent"></div>
      
      <div className="max-w-4xl w-full relative z-10">
        <h1 className="text-5xl md:text-7xl font-light text-text-primary mb-8 tracking-tight">
          Projects
        </h1>
        <div className="h-px w-24 bg-accent mb-12"></div>
        <p className="text-xl text-text-secondary font-light">
          This page is ready for your content.
        </p>
      </div>
    </main>
  )
}

export default Projects

