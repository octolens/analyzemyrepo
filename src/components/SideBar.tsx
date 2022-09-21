interface SideBarProps {
  sections: SideBarItem[];
  className?: string;
}

interface SideBarItem {
  section_name: string;
  logo: React.ReactNode;
}

export default function Sidebar({ sections, className }: SideBarProps) {
  return (
    <aside
      className={"w-64 h-screen sticky top-0" + " " + className}
      aria-label="Sidebar"
    >
      <div className="overflow-y-auto py-4 px-3 bg-white rounded dark:bg-gray-800 border border-solid border-black">
        <ul className="space-y-2">
          {sections.map((item: SideBarItem, i: number) => (
            <li key={i}>
              <a
                href={`#${item.section_name}`}
                className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
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
