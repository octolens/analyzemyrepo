import { DataURLType } from "@prisma/client";
import {
  TwitterButton,
  LinkedinButton,
  FacebookButton,
  SlackButton,
  DiscordButton,
  TelegramButton,
} from "./buttons";

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
  return (
    <div className="flex flex-col gap-4 items-center">
      <span className="text-lg font-bold">
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
    </div>
  );
};

export default ShareCard;
