import { prisma } from "../../server/db/client";
import { InferGetStaticPropsType } from "next";
import { Prisma } from "@prisma/client";
import Header from "../../components/Headers/NewHeaderSecondary";
import { EmailForm, Footer } from "../../components/Footer/Footer";
import Link from "next/link";
import Head from "next/head";

type Topic = {
  topic: string;
  topic_count: number;
};

export async function getStaticProps() {
  const data = await prisma.$queryRaw<Topic[]>(
    Prisma.sql`select
                    topic,
                    topic_count::integer
                from
                (
                    select
                    unnest(string_to_array(topics, '|')) as topic,
                    count(*) as topic_count
                    from
                    github_clean_repos
                    group by
                    1
                ) q
                where topic is not null
                order by
                    2 desc
                limit 1000
                `
  );

  return {
    props: {
      data: data,
    },
  };
}

const Topics = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const host = process.env.NEXT_PUBLIC_HOST;
  return (
    <>
      <Head>
        <title>Most popular topics on GitHub</title>
        <meta name="title" content={`Most popular topics on GitHub`} />
        <meta
          name="description"
          content={`Find the most popular topics on GitHub ranked by number of repositories.`}
        />
        <meta name="og:url" content={`${host}/topics`} />
        <meta name="og:type" content="website" />
        <meta name="og:title" content={`Most popular topics on GitHub`} />
        <meta
          name="og:description"
          content={`Find the most popular topics on GitHub ranked by number of repositories.`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@CrowdDotDev" />
        <meta name="twitter:title" content={`Most popular topics on GitHub`} />
        <meta
          name="twitter:description"
          content={`Find the most popular topics on GitHub ranked by number of repositories.`}
        />
      </Head>
      <Header />
      <div className="container mx-auto flex flex-col items-center">
        <h1 className="font-extrabold text-5xl pt-28 sticky">
          The most popular topics on GitHub
        </h1>
        <h2 className="text-2xl text-gray-400 pt-4">
          Top 1,000 topics by number of repositories
        </h2>
        <div className="flex flex-wrap justify-between gap-4 pt-4 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xl">
          {props.data.map((topic, index) => (
            <div
              className="flex flex-col bg-primary/10 rounded-lg shadow-md p-4 mb-4 text-primary/90 dark:bg-gray-700 dark:text-gray-400 hover:shadow-lg"
              key={topic.topic}
            >
              <Link href={`/topics/${topic.topic}`} className="hover:underline">
                {topic.topic}
              </Link>
            </div>
          ))}
        </div>
        {/* <div className="w-[600px] h-[500px]">
          <PieChartWithTopics data={props.data.slice(0, 30)} />
        </div> */}
      </div>
      <EmailForm />
      <Footer />
    </>
  );
};

export default Topics;
