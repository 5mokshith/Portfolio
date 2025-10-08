import SectionIntro from "../components/SectionIntro";
import data from "../../data";
import Folder from "./Folder";
import GiantFolder from "./GiantFolder";

function Skills() {
  const palette = [
    "#5227FF", "#0EA5E9", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#14B8A6"
  ];

  return (
    <section className="py-20 overflow-hidden relative">
      <SectionIntro title={data.skills.title} tagline={data.skills.tagline} />

      <div className="relative z-20 max-w-7xl mx-auto px-4 mt-24 md:mt-28">
        {(() => {
          const subfolders = data.skills.skills.map((skill, index) => {
            const color = palette[index % palette.length];
            const lang = (skill.languages || []).slice(0, 3);
            const fw = (skill.frameWorks || []).slice(0, 3);
            const tools = (skill.tools || []).slice(0, 3);
            const items = [
              lang.length ? (
                <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-700 p-1">
                  {lang.join(" • ")}
                </div>
              ) : null,
              fw.length ? (
                <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-700 p-1">
                  {fw.join(" • ")}
                </div>
              ) : null,
              tools.length ? (
                <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-700 p-1">
                  {tools.join(" • ")}
                </div>
              ) : null,
            ].filter(Boolean);

            return (
              <div key={index} className="flex flex-col items-center">
                <Folder color={color} size={1.2} items={items} />
                <p className="mt-3 text-sm text-white/90 text-center max-w-[140px] leading-tight">
                  {skill.title}
                </p>
              </div>
            );
          });

          return (
            <GiantFolder
              color="#2563EB"
              size={1.1}
              subfolders={subfolders}
              title="Skills"
            />
          );
        })()}
      </div>
    </section>
  );
}

export default Skills;