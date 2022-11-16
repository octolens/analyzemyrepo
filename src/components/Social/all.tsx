import { DataURLType } from "@prisma/client";
import {
  TwitterButton,
  LinkedinButton,
  FacebookButton,
  SlackButton,
  DiscordButton,
  TelegramButton,
} from "./buttons";
import { MdContentCopy } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaGithub } from "react-icons/fa";

const ShareCard = ({
  org_name,
  repo_name,
  twitter_text,
  chart_type,
}: {
  org_name: string;
  repo_name: string;
  twitter_text: string;
  chart_type: DataURLType;
}) => {
  const url =
    "https://" +
    process.env.NEXT_PUBLIC_GLOBAL_URL +
    `/share/${chart_type.toLowerCase()}/${org_name}/${repo_name}`;

  const image_url =
    "https://" +
    process.env.NEXT_PUBLIC_GLOBAL_URL +
    `/api/og_${chart_type.toLowerCase()}?org_name=${org_name}&repo_name=${repo_name}`;

  const markdown_code = `[![${chart_type} for ${org_name}/${repo_name}](${image_url})](${url})`;

  const notify = () => toast("Copied to clipboard!");

  return (
    <div className="flex flex-col gap-4 items-center">
      <span className="text-lg font-bold mb-5">
        Share this chart with your friends and colleagues
      </span>
      <div className="grid grid-cols-2 gap-4">
        <TwitterButton
          org_name={org_name}
          repo_name={repo_name}
          text={twitter_text}
          chart_type={chart_type}
        />
        <LinkedinButton
          org_name={org_name}
          repo_name={repo_name}
          chart_type={chart_type}
        />
        <FacebookButton
          org_name={org_name}
          repo_name={repo_name}
          chart_type={chart_type}
        />
        <SlackButton
          org_name={org_name}
          repo_name={repo_name}
          chart_type={chart_type}
        />
        <DiscordButton
          org_name={org_name}
          repo_name={repo_name}
          chart_type={chart_type}
        />
        <TelegramButton
          org_name={org_name}
          repo_name={repo_name}
          chart_type={chart_type}
        />
      </div>
      <p className="text-slate-500 text-sm">
        (For Slack and Discord link is copied to the clipboard)
      </p>
      <span className="flex flex-row items-center gap-2 justify-center mt-5">
        <span className="font-bold">Add this chart to your GitHub Readme</span>
        <FaGithub size={20} />
      </span>
      <div className="flex flex-row items-center gap-2">
        <input
          disabled
          value={markdown_code}
          className="w-96 py-3 px-2 bg-slate-100 text-ellipsis"
        ></input>
        <MdContentCopy
          size={20}
          className="cursor-pointer"
          onClick={() => {
            navigator.clipboard.writeText(markdown_code);
            notify();
          }}
        />
      </div>
      <ToastContainer
        position="top-center"
        autoClose={400}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="light"
      />
      <p className="font-bold">Copy URL</p>
      <div className="flex flex-row items-center gap-2">
        <input
          disabled
          value={url}
          className="w-96 py-3 px-2 bg-slate-100 text-ellipsis"
        ></input>
        <MdContentCopy
          size={20}
          className="cursor-pointer"
          onClick={() => {
            navigator.clipboard.writeText(url);
            notify();
          }}
        />
      </div>
      <ToastContainer
        position="top-center"
        autoClose={400}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="light"
      />
    </div>
  );
};

export default ShareCard;
