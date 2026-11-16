"use client";

import { useState } from "react";
import { MapPin, Sun, Wind } from "lucide-react";

const REFERENCE_CITY_POSITIONS = {
  coimbatore: { left: 12, top: 54 },
  theni: { left: 25.5, top: 66.6 },
  tirunelveli: { left: 23.5, top: 85.8 },
  tenkasi: { left: 20.5, top: 82.5 },
};

const CITY_PIN_OFFSETS = [
  [0, 0],
  [-3, -2],
  [3, -2],
  [-3, 2],
  [3, 2],
  [0, -4],
  [0, 4],
];

function getProjectCoordinates(project) {
  const rawLatitude = project.latitude ?? project.lat;
  const rawLongitude = project.longitude ?? project.lng;
  if (
    rawLatitude === null ||
    rawLatitude === undefined ||
    rawLatitude === "" ||
    rawLongitude === null ||
    rawLongitude === undefined ||
    rawLongitude === ""
  ) {
    return null;
  }

  const latitude = Number(rawLatitude);
  const longitude = Number(rawLongitude);
  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    latitude < 8 ||
    latitude > 13.6 ||
    longitude < 76.1 ||
    longitude > 80.5
  ) {
    return null;
  }

  return { latitude, longitude };
}

function getCityKey(location) {
  const city = String(location || "")
    .toLowerCase()
    .replace(/[^a-z]/g, "");

  if (city.includes("coimbatore")) return "coimbatore";
  if (city.includes("theni")) return "theni";
  if (city.includes("tirunelveli")) return "tirunelveli";
  if (city.includes("tenkasi")) return "tenkasi";
  return null;
}

function getMapPosition(project) {
  const coordinates = getProjectCoordinates(project);
  if (coordinates) {
    return {
      left: 5 + ((coordinates.longitude - 76.1) / (80.5 - 76.1)) * 80,
      top: 5 + ((13.6 - coordinates.latitude) / (13.6 - 8)) * 85,
      cityLevel: false,
    };
  }

  const city = getCityKey(project.location);
  const cityPosition = REFERENCE_CITY_POSITIONS[city];
  return cityPosition ? { ...cityPosition, cityLevel: true } : null;
}

function getProjectType(project) {
  const type = [
    project.project_type,
    project.project_type_name,
    project.type,
    project.technology,
    project.title,
    project.description,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (type.includes("solar")) return "solar";
  if (
    type.includes("wind") ||
    type.includes("turbine") ||
    ["gamesa", "vestas", "micon", "pioneer"].some((brand) =>
      type.includes(brand)
    )
  ) {
    return "wind";
  }
  return null;
}

function SolarArtworkIcon({ className = "h-6 w-6" }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden="true">
      <circle cx="36" cy="12" r="6" fill="#F59E0B" />
      <g stroke="#F59E0B" strokeWidth="2" strokeLinecap="round">
        <line x1="36" y1="2" x2="36" y2="4" />
        <line x1="36" y1="20" x2="36" y2="22" />
        <line x1="26" y1="12" x2="28" y2="12" />
        <line x1="44" y1="12" x2="46" y2="12" />
        <line x1="29" y1="5" x2="30.5" y2="6.5" />
        <line x1="41.5" y1="17.5" x2="43" y2="19" />
        <line x1="29" y1="19" x2="30.5" y2="17.5" />
        <line x1="41.5" y1="6.5" x2="43" y2="5" />
      </g>
      <g>
        <polygon
          points="6,34 16,16 34,16 38,34"
          fill="#2563EB"
          stroke="#1D4ED8"
          strokeWidth="1.5"
        />
        <line x1="15" y1="16" x2="16" y2="34" stroke="#93C5FD" strokeWidth="1" />
        <line x1="25" y1="16" x2="27" y2="34" stroke="#93C5FD" strokeWidth="1" />
        <line x1="11" y1="25" x2="36" y2="25" stroke="#93C5FD" strokeWidth="1" />
      </g>
      <path
        d="M22,34 L22,40 M16,40 L28,40"
        stroke="#475569"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function WindArtworkIcon({ className = "h-6 w-6", spinning = false }) {
  const firstRotorClass = spinning
    ? "origin-[20.5px_20px] animate-[spin_3s_linear_infinite]"
    : "origin-[20.5px_20px]";
  const secondRotorClass = spinning
    ? "origin-[32.8px_26px] animate-[spin_2.5s_linear_infinite]"
    : "origin-[32.8px_26px]";

  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden="true">
      <polygon points="18,44 19.5,20 21.5,20 23,44" fill="#1E293B" />
      <polygon
        points="31,44 32,26 33.5,26 34.5,44"
        fill="#475569"
        opacity="0.8"
      />
      <g
        className={firstRotorClass}
        style={{ transformOrigin: "20.5px 20px" }}
      >
        <circle cx="20.5" cy="20" r="2" fill="#0F172A" />
        <path d="M20.5,20 C19,13 20.5,5 21,5 C21.5,5 22.5,13 20.5,20 Z" fill="#0F172A" />
        <path d="M20.5,20 C27,22 34,28 33.5,28.5 C33,29 25,25 20.5,20 Z" fill="#0F172A" />
        <path d="M20.5,20 C14,24 8,30 7.5,29.5 C7,29 14,22 20.5,20 Z" fill="#0F172A" />
      </g>
      <g
        className={secondRotorClass}
        style={{ transformOrigin: "32.8px 26px" }}
      >
        <circle cx="32.8" cy="26" r="1.5" fill="#334155" />
        <path d="M32.8,26 C31.5,20 32.8,14 33.2,14 C33.6,14 34.2,20 32.8,26 Z" fill="#334155" />
        <path d="M32.8,26 C38,28 43,32 42.5,32.5 C42,33 36,30 32.8,26 Z" fill="#334155" />
        <path d="M32.8,26 C28,29 23,34 22.5,33.5 C22,33 27,27 32.8,26 Z" fill="#334155" />
      </g>
    </svg>
  );
}

function ProjectIcon({ project, className, spinning = false }) {
  const type = getProjectType(project);
  if (type === "solar") return <SolarArtworkIcon className={className} />;
  if (type === "wind") {
    return <WindArtworkIcon className={className} spinning={spinning} />;
  }
  return <MapPin className={className} aria-hidden="true" />;
}

function CalloutCard({
  project,
  selected,
  onSelect,
  onHover,
  onLeave,
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onFocus={onHover}
      onBlur={onLeave}
      aria-pressed={selected}
      aria-label={`Show ${project.title} in ${project.location || "the map"}`}
      className={`w-full cursor-pointer rounded-xl border bg-white px-2 py-1.5 text-center transition-all duration-200 ${
        selected
          ? "scale-105 border-[#15803D] shadow-lg ring-2 ring-[#15803D]/25"
          : "border-slate-800/80 shadow-sm hover:border-slate-900 hover:shadow"
      }`}
    >
      <span className="mb-0.5 flex justify-center">
        <ProjectIcon
          project={project}
          className="h-5 w-5"
          spinning={selected}
        />
      </span>
      <span className="block break-words text-[11px] font-bold leading-tight text-[#1E3A8A]">
        {project.location || "Project location"}
      </span>
      <span className="mt-0.5 line-clamp-2 block break-words text-[11px] font-extrabold leading-tight text-[#15803D]">
        {project.title}
      </span>
    </button>
  );
}

function ProjectPin({
  project,
  position,
  active,
  isCompleted,
  onSelect,
  onHover,
  onLeave,
}) {
  const type = getProjectType(project);

  return (
    <button
      type="button"
      onClick={onSelect}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onFocus={onHover}
      onBlur={onLeave}
      aria-label={`Show ${project.title} in ${project.location || "the map"}`}
      aria-pressed={active}
      title={`${project.location || ""}: ${project.title}`}
      style={{
        left: `${position.left}%`,
        top: `${position.top}%`,
        transform: "translate(-50%, -50%)",
      }}
      className="absolute z-20 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#15803D]"
    >
      <span className="pointer-events-none absolute -inset-2 animate-ping rounded-full bg-[#15803D]/30" />
      <span
        className={`relative z-10 flex items-center justify-center rounded-full text-white shadow-md transition-all duration-300 ${
          active
            ? "z-30 h-6 w-6 scale-125 bg-[#15803D] ring-4 ring-[#15803D]/30"
            : isCompleted
              ? "h-4 w-4 bg-amber-500 ring-2 ring-white"
              : "h-4 w-4 bg-cyan-600 ring-2 ring-white"
        }`}
      >
        {type === "solar" ? (
          <Sun className="h-2.5 w-2.5 stroke-[2.5]" aria-hidden="true" />
        ) : type === "wind" ? (
          <Wind className="h-2.5 w-2.5 stroke-[2.5]" aria-hidden="true" />
        ) : (
          <MapPin className="h-2.5 w-2.5 stroke-[2.5]" aria-hidden="true" />
        )}
      </span>
      {active && (
        <span className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-slate-700 bg-slate-900/95 px-4 py-2 text-xs font-bold shadow-xl">
          <span className="text-[#93C5FD]">
            {project.location || "Project"}:{" "}
          </span>
          <span className="text-[#4ADE80]">{project.title}</span>
        </span>
      )}
    </button>
  );
}

function MapImage({
  className,
  mapSvgUrl,
  sectionTitle,
  projectsWithPositions,
  selectedProjectId,
  isCompleted,
  onSelectProject,
  setHoveredId,
  setMapError,
}) {
  return (
    <div
      className={`relative mx-auto aspect-[1640/2032] w-full select-none ${className}`}
    >
      <img
        src={mapSvgUrl}
        alt={`Tamil Nadu map showing ${sectionTitle.toLowerCase()} locations`}
        className="pointer-events-none h-full w-full object-contain drop-shadow-sm"
        onError={() => setMapError("The reference map image could not be loaded.")}
      />
      {projectsWithPositions.map(({ project, position }) => {
        const isSelected =
          String(project.id) === String(selectedProjectId);

        return (
          <ProjectPin
            key={project.id}
            project={project}
            position={position}
            active={isSelected}
            isCompleted={isCompleted}
            onSelect={() => onSelectProject(project.id)}
            onHover={() => setHoveredId(project.id)}
            onLeave={() => setHoveredId(null)}
          />
        );
      })}
    </div>
  );
}

export default function InteractiveProjectsMap({
  sectionTitle,
  projects,
  selectedProjectId,
  onSelectProject,
}) {
  const [hoveredId, setHoveredId] = useState(null);
  const [mapError, setMapError] = useState("");
  const isCompleted = sectionTitle === "Completed Projects";
  const mapSvgUrl = `https://renfraenergy.com/images/tamil-nadu-${
    isCompleted ? "completed" : "ongoing"
  }.svg`;
  const projectsWithPositions = projects
    .map((project) => ({
      project,
      position: getMapPosition(project),
    }))
    .filter((entry) => entry.position);
  const cityPinCounts = new Map();
  projectsWithPositions.forEach(({ project, position }) => {
    if (!position.cityLevel) return;

    const city = getCityKey(project.location);
    const cityIndex = cityPinCounts.get(city) || 0;
    const [leftOffset, topOffset] =
      CITY_PIN_OFFSETS[cityIndex % CITY_PIN_OFFSETS.length];
    position.left = Math.min(97, Math.max(3, position.left + leftOffset));
    position.top = Math.min(97, Math.max(3, position.top + topOffset));
    cityPinCounts.set(city, cityIndex + 1);
  });
  const projectsWithoutCoordinates =
    projects.length - projectsWithPositions.length;
  const selectedProject = projects.find(
    (project) => String(project.id) === String(selectedProjectId)
  );
  const hoveredProject = projects.find(
    (project) => String(project.id) === String(hoveredId)
  );
  const activeProject = hoveredProject || selectedProject;
  const leftProjects = projects.filter((_, index) => index % 2 === 0);
  const rightProjects = projects.filter((_, index) => index % 2 === 1);
  const mapClassName =
    "relative w-full max-w-[450px] mx-auto";

  function renderCallout(project) {
    const selected = String(project.id) === String(selectedProjectId);

    return (
      <CalloutCard
        key={project.id}
        project={project}
        selected={selected}
        onSelect={() => onSelectProject(project.id)}
        onHover={() => setHoveredId(project.id)}
        onLeave={() => setHoveredId(null)}
      />
    );
  }

  return (
    <section
      className="mt-12 flex w-full flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/90 bg-[#F9FBFA] p-4 shadow-md sm:p-6 lg:p-7"
      aria-labelledby={`project-map-${isCompleted ? "completed" : "ongoing"}`}
    >
      <div className="border-b border-slate-200/70 pb-3">
        <h2
          id={`project-map-${isCompleted ? "completed" : "ongoing"}`}
          className="text-xl font-black tracking-tight sm:text-2xl"
        >
          <span className="text-[#1E3A8A]">
            {isCompleted ? "COMPLETED" : "ON GOING"}
          </span>{" "}
          <span className="text-[#15803D]">PROJECTS</span>
        </h2>
      </div>

      <div className="my-4 hidden gap-2 md:grid md:grid-cols-[minmax(90px,1fr)_minmax(0,4fr)_minmax(90px,1fr)]">
        <div className="flex flex-col justify-around gap-2">
          {leftProjects.map(renderCallout)}
        </div>

        <div className="flex flex-col items-center justify-between gap-2">
          <MapImage
            className={mapClassName}
            mapSvgUrl={mapSvgUrl}
            sectionTitle={sectionTitle}
            projectsWithPositions={projectsWithPositions}
            selectedProjectId={selectedProjectId}
            isCompleted={isCompleted}
            onSelectProject={onSelectProject}
            setHoveredId={setHoveredId}
            setMapError={setMapError}
          />
        </div>

        <div className="flex flex-col justify-around gap-2">
          {rightProjects.map(renderCallout)}
        </div>
      </div>

      <div className="my-4 flex flex-col items-center gap-4 md:hidden">
        <MapImage
          className="max-w-[300px]"
          mapSvgUrl={mapSvgUrl}
          sectionTitle={sectionTitle}
          projectsWithPositions={projectsWithPositions}
          selectedProjectId={selectedProjectId}
          isCompleted={isCompleted}
          onSelectProject={onSelectProject}
          setHoveredId={setHoveredId}
          setMapError={setMapError}
        />
        <div className="grid w-full grid-cols-2 gap-2">
          {projects.map(renderCallout)}
        </div>
      </div>

      {projects.length === 0 && (
        <p className="mb-3 text-sm text-slate-600" role="status">
          No {isCompleted ? "completed" : "ongoing"} projects are currently
          available.
        </p>
      )}

      {mapError && (
        <p className="mb-3 text-sm text-red-700" role="alert">
          {mapError}
        </p>
      )}

      <div className="mt-1 border-t border-slate-200 pt-3">
        {activeProject && (
          <div className="mb-3 rounded-2xl border border-slate-800/80 bg-white p-3 shadow-sm">
            <p className="text-sm font-bold text-[#1E3A8A]">
              {activeProject.title}
            </p>
            <p className="mt-1 text-sm font-semibold text-[#15803D]">
              {activeProject.location}
            </p>
            <p className="mt-1 text-xs text-slate-600">
              Status: {isCompleted ? "Completed" : "Ongoing"}
            </p>
          </div>
        )}
        {projectsWithoutCoordinates > 0 && (
          <p className="mb-3 text-sm text-amber-800" role="status">
            {projectsWithoutCoordinates}{" "}
            {projectsWithoutCoordinates === 1 ? "project needs" : "projects need"}{" "}
            valid coordinates before its map pin can be placed.
          </p>
        )}
        {projectsWithPositions.some(({ position }) => position.cityLevel) && (
          <p className="mb-3 text-xs text-slate-600">
            Pins without backend coordinates indicate the project city, not its
            exact site.
          </p>
        )}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-800/80 bg-white p-3 shadow-sm">
            <MapPin className="h-8 w-8 text-[#1E3A8A]" aria-hidden="true" />
            <div>
              <p className="text-xs font-bold text-[#1E3A8A] sm:text-sm">
                Projects in this section
              </p>
              <p className="text-base font-extrabold text-[#15803D] sm:text-lg">
                {projects.length}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-slate-800/80 bg-white p-3 shadow-sm">
            <MapPin className="h-8 w-8 text-[#15803D]" aria-hidden="true" />
            <div>
              <p className="text-xs font-bold text-[#1E3A8A] sm:text-sm">
                Locations pinned
              </p>
              <p className="text-base font-extrabold text-[#15803D] sm:text-lg">
                {projectsWithPositions.length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
