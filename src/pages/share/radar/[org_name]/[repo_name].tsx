import Head from "next/head";
import { useRouter } from "next/router";

export default function RadarShare() {
  const router = useRouter();
  const { org_name, repo_name } = router.query;
  const host = process.env.NEXT_PUBLIC_VERCEL_URL
    ? "https://" + process.env.NEXT_PUBLIC_VERCEL_URL
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
      <meta
        name="og:image"
        content={`${host}/api/og_radar?org_name=${org_name}&repo_name=${repo_name}`}
      />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@CrowdDotDev" />
      <meta
        name="twitter:title"
        content={`repoanalyzer.com | ${org_name}/${repo_name}`}
      />
      <meta
        name="twitter:description"
        content={`Insights and analytics into ${org_name}/${repo_name} repository`}
      />
      <meta
        name="twitter:image"
        content={`${host}/api/og_radar?org_name=${org_name}&repo_name=${repo_name}`}
      />
    </Head>
  );
}
