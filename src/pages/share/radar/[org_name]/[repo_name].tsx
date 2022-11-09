import Head from "next/head";
import { useRouter } from "next/router";

export function getServersideProps() {
  //   return {
  //     props: {
  //       title: "Hello",
  //     },
  //   };
}

export default function RadarShare() {
  const router = useRouter();
  const { org_name, repo_name } = router.query;
  const host = process.env.VERCEL_URL
    ? "https://" + process.env.VERCEL_URL
    : "http://localhost:3000";
  return (
    <Head>
      <meta name="og:url" content={`${host}/analyze/${org_name}${repo_name}`} />
      <meta name="og:type" content="website" />
      <meta
        name="og:title"
        content={`repoanalyzer.com | ${org_name}/${repo_name}`}
      />
      <meta
        name="og:description"
        content={`Insights and analytics into ${org_name}/${repo_name} repository`}
      />
      <meta name="og:image" content="https://radar.vercel.app/logo.png" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@radar" />
      <meta name="twitter:creator" content="@radar" />
      <meta name="twitter:title" content="Radar" />
      <meta name="twitter:description" content="Radar" />
      <meta name="twitter:image" content="https://radar.vercel.app/logo.png" />
    </Head>
  );
}
