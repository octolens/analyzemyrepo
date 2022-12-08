import { useEffect, useState } from "react";

interface SideBarProps {
  sections: SideBarItem[];
  className?: string;
  active_section?: number;
}

interface SideBarItem {
  section_name: string;
  logo: React.ReactNode;
}

//
// if click is fired I want to make this item active immediately and igore intersection observer
// otherwise do debouncing as usuall

export default function Sidebar({ sections, className }: SideBarProps) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const options: IntersectionObserverInit = {
      root: null, // all viewport
      threshold: 0.5,
    };

    const callback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          setActive(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(callback, options);

    sections.forEach((value) => {
      observer.observe(
        document.getElementById(`${value.section_name}`) as Element
      );
    });
  }, []);

  return (
    <aside
      className={"w-64 h-screen sticky top-40" + " " + className}
      aria-label="Sidebar"
    >
      <div className="overflow-y-auto py-4 px-3 bg-white rounded dark:bg-gray-800 border border-solid border-black">
        <ul className="space-y-2">
          {sections.map((item: SideBarItem, index: number) => (
            <li
              key={index}
              // onClick={() => {
              //   setActive(item.section_name);
              // }}
            >
              <a
                href={`#${item.section_name}`}
                className={
                  "flex items-center p-2 text-base font-normal text-gray-900 rounded-lg" +
                  (item.section_name == active ? " bg-gray-200" : "")
                }
              >
                {item.logo}
                <span className="ml-3">{item.section_name}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
