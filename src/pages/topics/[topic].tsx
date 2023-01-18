import { prisma } from "../../server/db/client";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import Header from "../../components/Headers/NewHeaderSecondary";
import Image from "next/image";
import { GiRoundStar } from "react-icons/gi";
import { EmailForm, Footer } from "../../components/Footer/Footer";

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ topic: string }>
) {
  const data = await prisma.github_clean_repos.findMany({
    where: {
      topics: {
        contains: context.params?.topic,
      },
    },
    orderBy: {
      stargazers_count: "desc",
    },
    take: 20,
    select: {
      full_name: true,
      description: true,
      stargazers_count: true,
      topics: true,
    },
  });

  return {
    props: {
      data: data,
      topic: context.params?.topic,
    },
  };
}

const capitalize = (s: string) => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const Topic = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const host = process.env.NEXT_PUBLIC_HOST;
  return (
    <>
      <Header />
      <div className="container mx-auto flex flex-col items-center">
        <h1 className="font-extrabold text-5xl pt-10 sticky before:content-['__#']">
          {props.topic && capitalize(props.topic)}
        </h1>
        {/* <ReposForTheTopic props={props} /> */}
        <div className="flex flex-col gap-4 pt-4">
          {props.data.map((repo, index) => (
            <div
              className="flex flex-col bg-white rounded-lg shadow-md p-4 mb-4 text-primary/90 dark:bg-gray-700 dark:text-gray-400 hover:shadow-lg"
              key={repo.full_name}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Image
                    className="w-10 h-10 rounded-full"
                    src={`https://github.com/${
                      repo.full_name?.split("/")[0]
                    }.png`}
                    alt="Repo Image"
                    priority={true}
                    loading="eager"
                    width={40}
                    height={40}
                  />
                  <div className="pl-3 pr-1 flex flex-col max-w-[200px] md:max-w-md lg:max-w-lg md:pr-0">
                    <div className="text-base flex flex-col gap-2 font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
                      <Link
                        href={`/analyze/${repo.full_name}`}
                        className="hover:underline whitespace-normal break-words"
                        prefetch={false}
                      >
                        {repo.full_name}
                      </Link>

                      {/* description of the repo */}
                      <p className="text-sm text-gray-500 dark:text-gray-400 whitespace-normal break-words">
                        {repo.description}
                      </p>

                      <div className="text-sm text-gray-500 dark:text-gray-400 flex flex-wrap gap-2">
                        {repo.topics?.split("|").map((topic, index) => (
                          <span
                            key={index}
                            className="bg-primary/10 px-2 rounded-lg"
                          >
                            <Link
                              href={`/topics/${topic}`}
                              className="hover:underline"
                            >
                              {topic}
                            </Link>
                          </span>
                        ))}
                      </div>

                      {/* stars */}
                      <div className="flex items-center mt-2">
                        <GiRoundStar className="text-yellow-400" />
                        <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">
                          {repo.stargazers_count?.toLocaleString("en-US")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <EmailForm />
      <Footer />
    </>
  );
};

export default Topic;

const ReposForTheTopic = ({
  props,
}: {
  props: InferGetServerSidePropsType<typeof getServerSideProps>;
}) => {
  return (
    <div
      className="relative shadow-md sm:rounded-lg"
      id="fastest-growing-section"
    >
      <table className="text-sm text-left text-gray-500 dark:text-gray-400 table-auto">
        <thead className="text-xs text-white bg-primary/90 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="py-3 px-1 md:px-6">
              Repo
            </th>
            <th scope="col" className="py-3 px-1 md:px-6">
              Description
            </th>
            <th scope="col" className="py-3 px-1 md:px-6">
              Stars
            </th>
          </tr>
        </thead>
        <tbody>
          {props.data.map((repo, index) => (
            <tr
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              key={repo.full_name}
            >
              <td className="">
                <div className="flex items-center py-3 px-1 md:px-6">
                  <span className="font-medium">{index + 1}</span>
                </div>
              </td>
              <th
                scope="row"
                className="flex items-center py-4 px-1 md:px-6 text-gray-900 whitespace-nowrap dark:text-white"
              >
                <Image
                  className="w-10 h-10 rounded-full"
                  src={`https://github.com/${
                    repo.full_name?.split("/")[0]
                  }.png`}
                  alt="Repo Image"
                  priority={true}
                  loading="eager"
                  width={40}
                  height={40}
                />
                <div className="pl-3 pr-1 flex max-w-[110px] md:max-w-xs md:pr-0">
                  <div className="text-base font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
                    <Link
                      href={`/analyze/${repo.full_name}`}
                      className="hover:underline"
                    >
                      {repo.full_name}
                    </Link>
                  </div>
                </div>
              </th>
              <td className="py-4 px-1 md:px-6">{repo.description}</td>
              <td className="py-4 px-1 md:px-6">
                <div className="flex items-center">1,000 stars</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
