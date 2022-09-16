import Link from "next/link";

interface SideBarProps {
  sections: string[];
}

// stolen from here: https://larainfo.com/blogs/react-tailwind-css-sidebar-example

export default function Sidebar({ sections }: SideBarProps) {
  return (
    <aside className="w-64" aria-label="Sidebar">
      <div className="overflow-y-auto py-4 px-3 bg-white rounded dark:bg-gray-800 border border-solid border-black">
        <ul className="space-y-2">
          {sections.map((section_name: string, i: number) => (
            <li key={i}>
              <a
                href="#"
                className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <svg
                  aria-hidden="true"
                  className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                  <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
                </svg>
                <span className="ml-3">{section_name}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
