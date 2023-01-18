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
      OR: [
        {
          topics: {
            contains: `|${context.params?.topic}|`,
          },
        },
        {
          topics: {
            contains: `|${context.params?.topic}`,
          },
        },
        {
          topics: {
            contains: `${context.params?.topic}|`,
          },
        },
      ],
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
  return (
    <>
      <Header />
      <div className="container mx-auto flex flex-col items-center pt-28">
        <h1 className="text-center mb-4 text-4xl font-bold tracking-tight text-gray-900 lg:font-extrabold lg:text-6xl lg:leading-none dark:text-white lg:text-center xl:px-36 lg:mb-7 before:content-['#']">
          {props.topic && capitalize(props.topic)}
        </h1>
        <h2 className="mb-10 text-center text-lg font-normal text-gray-500 dark:text-gray-400 lg:text-center lg:text-xl xl:px-60 md:whitespace-nowrap">
          Most popular {props.topic && capitalize(props.topic)} repos on GitHub
        </h2>
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
