import Link from "next/link";
import { TiSocialTwitter } from "react-icons/ti";

const TwitterButton = ({
  org_name,
  repo_name,
  text,
}: {
  org_name: string;
  repo_name: string;
  text: string;
}) => {
  const url =
    "https://" +
    process.env.NEXT_PUBLIC_VERCEL_URL +
    `/share/radar/${org_name}/${repo_name}`;

  const url_text = encodeURIComponent(text);
  const url_url = encodeURIComponent(url);

  return (
    <Link
      href={`https://twitter.com/intent/tweet?text=${url_text}&url=${url_url}&via=CrowdDotDev`}
      className="cursor-pointer"
    >
      <span>
        Post this chart on Twitter
        <TiSocialTwitter className="cursor-pokinter" size={30} />
      </span>
    </Link>
  );
};

export default TwitterButton;
