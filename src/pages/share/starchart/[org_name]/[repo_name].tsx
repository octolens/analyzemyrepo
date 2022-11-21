import Head from "next/head";
import { GetServerSideProps, NextPage } from "next";
import { useEffect } from "react";
import { useRouter } from "next/router";

type MyProps = { org_name: string; repo_name: string };

export const getServerSideProps: GetServerSideProps<MyProps> = async (
  context
) => {
  return {
    props: {
      org_name: context.query.org_name as string,
      repo_name: context.query.repo_name as string,
    },
  };
};

const StarChartShare: NextPage<MyProps> = (props: MyProps) => {
  const host = process.env.NEXT_PUBLIC_GLOBAL_URL
    ? "https://" + process.env.NEXT_PUBLIC_GLOBAL_URL
    : "http://localhost:3000";
  const org_name = props.org_name;
  const repo_name = props.repo_name;

  const router = useRouter();

  useEffect(() => {
    router.push(`/analyze/${org_name}/${repo_name}`);
  });
  return (
    <>
      <Head>
        <meta
          name="og:url"
          content={`${host}/analyze/${org_name}${repo_name}`}
        />
        <meta name="og:type" content="website" />
        <meta
          name="og:title"
          content={`analyzemyrepo.com | ${org_name}/${repo_name}`}
        />
        <meta
          name="og:description"
          content={`Insights and analytics into ${org_name}/${repo_name} repository`}
        />
        <meta
          name="og:image"
          content={`${host}/api/og_starchart?org_name=${org_name}&repo_name=${repo_name}`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@CrowdDotDev" />
        <meta
          name="twitter:title"
          content={`analyzemyrepo.com | ${org_name}/${repo_name}`}
        />
        <meta
          name="twitter:description"
          content={`Insights and analytics into ${org_name}/${repo_name} repository`}
        />
        <meta
          name="twitter:image"
          content={`${host}/api/og_starchart?org_name=${org_name}&repo_name=${repo_name}`}
        />
      </Head>
      <div>{router.isReady && <h1>Redirecting...</h1>}</div>
    </>
  );
};

export default StarChartShare;
