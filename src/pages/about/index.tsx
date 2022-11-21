import { type NextPage } from "next";
import Head from "next/head";
import { GoMarkGithub } from "react-icons/go";
import Link from "next/link";
import Header from "../../components/Headers/NewHeader";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>analyzemyrepo.com | about</title>
        <meta
          name="description"
          content="Community Insights for GitHub repo | about"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
        <div className="relative w-full bg-white px-6 py-12 shadow-xl shadow-slate-700/10 ring-1 ring-gray-900/5 md:mx-auto md:max-w-3xl lg:max-w-4xl lg:pt-16 lg:pb-28">
          <div className="max-w-pros mx-auto lg:text-lg">
            <h1>
              <span className="block text-center text-base font-extrabold uppercase tracking-wide">
                About
              </span>
            </h1>
          </div>
          <div className="prose prose-slate mx-auto mt-8 lg:prose-lg">
            <p>
              The goal of this project is to provide a free tool to understand
              and grow your open-source project.
            </p>
            <p>
              All the data is collected from the GitHub API and is updated
              weekly for top repos and less frequently for the rest. Please note
              that the data may be incomplete. If you find any issues, email us
              at{" "}
              <a href="mailto:igor@crowd.dev" className="decoration-primary">
                igor@crowd.dev
              </a>
            </p>
            <p>
              Please don&#39;t take seriously <i>verdicts</i> that we show at
              the top of the page. This is just to summarize the data and give
              you a quick overview of the repo. The data is more useful when you
              explore it yourself.
            </p>
            <p>
              analyzemyrepo.com is brought to you by team at{" "}
              <a href="https://crowd.dev" className="decoration-primary">
                crowd.dev
              </a>
              .
            </p>
            <p className="text-center">
              <button
                className="h-14 w-28 rounded-md bg-black text-md font-bold capitalize text-white hover:bg-opacity-80"
                onClick={() =>
                  router.push("/analyze/freeCodeCamp/freeCodeCamp")
                }
              >
                Try it now
              </button>
            </p>
            <hr />
            <h2>Shoutout to technologies</h2>
            <p>
              This project is open-source and it&#39;s built with these amazing
              technologies:
            </p>
            <ul>
              <li>
                <strong>creat-t3-app</strong> for the Next.js app with Prisma,
                TailwindCSS, NextAuth and tRPC
              </li>
              <li>
                <strong>nivo.rocks</strong> for amazing charts
              </li>
              <li>
                <strong>vercel/satori</strong> for Open Graph image rendering
              </li>
              <li>
                and <strong>Prefect</strong> for data scripts and cron jobs
              </li>
            </ul>
            <div className="flex flex-row items-center">
              Source code is available on GitHub{"  "}
              <Link href="https://github.com">
                <span className="flex items-center pl-2">
                  <GoMarkGithub size={20} />
                </span>
              </Link>
            </div>
            <p>
              <em>All the best,</em>
            </p>
            <span className="block text-center text-3xl font-extrabold leading-8 tracking-tight text-primary sm:text-4xl">
              analyzemyrepo.com
            </span>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
