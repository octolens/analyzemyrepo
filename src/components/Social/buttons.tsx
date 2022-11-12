import { DataURLType } from "@prisma/client";
import Link from "next/link";
import {
  TiSocialTwitter,
  TiSocialLinkedin,
  TiSocialFacebook,
} from "react-icons/ti";
import { SiSlack, SiDiscord, SiTelegram } from "react-icons/si";

export const TwitterButton = ({
  org_name,
  repo_name,
  text,
  chart_type,
}: {
  org_name: string;
  repo_name: string;
  text: string;
  chart_type: DataURLType;
}) => {
  const url =
    "https://" +
    process.env.NEXT_PUBLIC_GLOBAL_URL +
    `/share/${chart_type.toLowerCase()}/${org_name}/${repo_name}`;

  const url_text = encodeURIComponent(text);
  const url_url = encodeURIComponent(url);

  return (
    <Link
      href={`https://twitter.com/intent/tweet?url=${url_url}`}
      className="cursor-pointer border border-black border-solid rounded-lg px-4 py-2 hover:border-primary"
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className="flex flex-row items-center gap-1 justify-center">
        Twitter
        <TiSocialTwitter size={30} color="#1DA1F2" />
      </span>
    </Link>
  );
};

export const LinkedinButton = ({
  org_name,
  repo_name,
  chart_type,
}: {
  org_name: string;
  repo_name: string;
  chart_type: DataURLType;
}) => {
  const url =
    "https://" +
    process.env.NEXT_PUBLIC_GLOBAL_URL +
    `/share/${chart_type.toLowerCase()}/${org_name}/${repo_name}`;

  return (
    <Link
      href={`https://linkedin.com/shareArticle?url=${url}`}
      className="cursor-pointer border border-black border-solid rounded-lg px-4 py-2 hover:border-primary"
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className="flex flex-row items-center gap-1 justify-center">
        LinkedIn
        <TiSocialLinkedin size={30} color="#0e76a8" className="mb-[0.2rem]" />
      </span>
    </Link>
  );
};

export const FacebookButton = ({
  org_name,
  repo_name,
  chart_type,
}: {
  org_name: string;
  repo_name: string;
  chart_type: DataURLType;
}) => {
  const url =
    "https://" +
    process.env.NEXT_PUBLIC_GLOBAL_URL +
    `/share/${chart_type.toLowerCase()}/${org_name}/${repo_name}`;

  const url_url = encodeURIComponent(url);

  return (
    <Link
      href={`https://facebook.com/sharer/sharer.php?u=${url_url}`}
      className="cursor-pointer border border-black border-solid rounded-lg px-4 py-2 hover:border-primary"
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className="flex flex-row items-center gap-1 justify-center">
        Facebook
        <TiSocialFacebook size={30} color="#4267B2" className="mb-[0.2rem]" />
      </span>
    </Link>
  );
};

export const SlackButton = ({
  org_name,
  repo_name,
  chart_type,
}: {
  org_name: string;
  repo_name: string;
  chart_type: DataURLType;
}) => {
  const url =
    "https://" +
    process.env.NEXT_PUBLIC_GLOBAL_URL +
    `/share/${chart_type.toLowerCase()}/${org_name}/${repo_name}`;
  return (
    <Link
      href={`slack://open`}
      className="cursor-pointer border border-black border-solid rounded-lg px-4 py-2 hover:border-primary flex flex-col justify-center"
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className="flex flex-row items-center gap-2 justify-center">
        <span>Slack</span>
        <SiSlack size={20} />
      </span>
    </Link>
  );
};

export const DiscordButton = ({
  org_name,
  repo_name,
  chart_type,
}: {
  org_name: string;
  repo_name: string;
  chart_type: DataURLType;
}) => {
  const url =
    "https://" +
    process.env.NEXT_PUBLIC_GLOBAL_URL +
    `/share/${chart_type.toLowerCase()}/${org_name}/${repo_name}`;
  return (
    <Link
      href={`discord://open`}
      className="cursor-pointer border border-black border-solid rounded-lg px-4 py-2 hover:border-primary flex flex-col justify-center"
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className="flex flex-row items-center gap-2 justify-center">
        <span>Discord</span>
        <SiDiscord size={25} color="#5865F2" />
      </span>
    </Link>
  );
};

export const TelegramButton = ({
  org_name,
  repo_name,
  chart_type,
}: {
  org_name: string;
  repo_name: string;
  chart_type: DataURLType;
}) => {
  const url =
    "https://" +
    process.env.NEXT_PUBLIC_GLOBAL_URL +
    `/share/${chart_type.toLowerCase()}/${org_name}/${repo_name}`;

  saveToClipboard(url);

  const url_url = encodeURIComponent(url);
  const text_url = encodeURIComponent("Nice chart!");
  return (
    <Link
      href={`tg://msg_url?url=${url_url}&text=${text_url}`}
      className="cursor-pointer border border-black border-solid rounded-lg px-4 py-2 hover:border-primary flex flex-col justify-center"
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className="flex flex-row items-center gap-2 justify-center">
        <span>Telegram</span>
        <SiTelegram size={25} color="#229ED9" />
      </span>
    </Link>
  );
};

const saveToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};
