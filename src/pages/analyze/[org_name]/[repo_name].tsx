import { useRouter } from "next/router";
import Sidebar from "../../../components/SideBar";
import Image from "next/image";

const RepoPage = () => {
  const router = useRouter();
  const { org_name, repo_name } = router.query;

  const full_name = org_name + "/" + repo_name;

  return (
    <div className="flex">
      <Sidebar
        sections={[
          "Overview",
          "Community Health",
          "Repo Completeness",
          "More Insights",
        ]}
      />

      <div className="container mx-auto mt-12 flex flex-col">
        <div className="w-fit px-4 py-5 bg-white rounded-lg shadow mx-auto flex flex-row items-center gap-2">
          <div>
            <Image
              src={`https://github.com/${org_name}.png`}
              width="48"
              height="48"
              alt={full_name}
            />
          </div>
          <div className="text-xl text-gray-900 truncate">{full_name}</div>
          <a
            href={`https://github.com/${full_name}`}
            className="hover:text-primary"
          >
            <svg
              aria-hidden="true"
              role="img"
              viewBox="0 0 24 24"
              width="28"
              height="28"
              fill="currentColor"
            >
              <path d="M15.5 2.25a.75.75 0 01.75-.75h5.5a.75.75 0 01.75.75v5.5a.75.75 0 01-1.5 0V4.06l-6.22 6.22a.75.75 0 11-1.06-1.06L19.94 3h-3.69a.75.75 0 01-.75-.75z"></path>
              <path d="M2.5 4.25c0-.966.784-1.75 1.75-1.75h8.5a.75.75 0 010 1.5h-8.5a.25.25 0 00-.25.25v15.5c0 .138.112.25.25.25h15.5a.25.25 0 00.25-.25v-8.5a.75.75 0 011.5 0v8.5a1.75 1.75 0 01-1.75 1.75H4.25a1.75 1.75 0 01-1.75-1.75V4.25z"></path>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default RepoPage;
