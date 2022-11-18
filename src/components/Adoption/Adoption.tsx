import { GoStar, GoIssueOpened, GoRepoForked } from "react-icons/go";
import { UseQueryResult } from "react-query";
import { trpc } from "../../utils/trpc";
import { useRouter } from "next/router";
import StarChart from "./StarChart";
import { useState } from "react";
import InsightCard from "../Cards/InsightCard";
import RadioHorizontal from "../Radio/RadioHorizontal";
import { MdShare } from "react-icons/md";
import Modal from "../Modal/Modal";
import ShareCard from "../Social/all";

interface RepoDistributionMap {
  [name: string]: number;
}

const approximate_repo_distribution: RepoDistributionMap = {
  "0..0": 27772676,
  "1..10": 11239190,
  "11..20": 566932,
  "21..30": 232908,
  "31..40": 131208,
  "41..50": 85468,
  "51..60": 60969,
  "61..70": 45548,
  "71..80": 36049,
  "81..90": 29052,
  "91..100": 23731,
  "101..110": 19901,
  "111..120": 17258,
  "121..130": 15265,
  "131..140": 13058,
  "141..150": 11607,
  "151..160": 10371,
  "161..170": 9413,
  "171..180": 8537,
  "181..190": 7701,
  "191..200": 6842,
  "201..300": 46734,
  "301..400": 25608,
  "401..500": 16021,
  "501..600": 11000,
  "601..700": 8305,
  "701..800": 6267,
  "801..900": 4918,
  "901..999": 3830,
  "1000..100000000": 36816, //1% -- top 1%
};

const count_percent_rank = (stars: number, include_zeros = false) => {
  const values = Object.values(approximate_repo_distribution);

  let sum = values.reduce((accumulator, value) => {
    return accumulator + value;
  }, 0);

  const bins = Object.keys(approximate_repo_distribution);

  let result_bin = "0..0";
  let index_to_sum_from = 0;

  for (const value of bins) {
    const [left, right] = value.split("..");
    const left_bin = parseInt(left as string);
    const right_bin = parseInt(right as string);
    if (stars >= left_bin && stars <= right_bin) {
      result_bin = value;
      index_to_sum_from = bins.indexOf(result_bin);
      break;
    }
  }

  const upper_tail_sum = values
    .slice(index_to_sum_from)
    .reduce((accumulator, value) => {
      return accumulator + value;
    }, 0);

  if (!include_zeros) {
    sum -= approximate_repo_distribution["0..0"] as number;
  }

  const percentage = (upper_tail_sum / sum) * 100;

  return Math.ceil(percentage).toFixed(0);
};

const AdoptionSection = ({ section_id = "Adoption" }) => {
  const [field, setField] = useState<"stargazers_count" | "forks_count">(
    "stargazers_count"
  );

  const [isOpenShare, setIsOpenShare] = useState(false);

  const router = useRouter();
  const { org_name, repo_name } = router.query;

  const saveDataURL = trpc.useMutation("dataURL.upsert");

  const save_data_url = async () => {
    const node = document.getElementById("star-chart");
    const svg = node?.getElementsByTagName("svg")[0];
    const imageURL =
      "data:image/svg+xml;base64," +
      Buffer.from(svg?.outerHTML as string).toString("base64");
    await saveDataURL.mutateAsync({
      data_url: imageURL,
      owner: org_name as string,
      repo: repo_name as string,
      type: field == "stargazers_count" ? "StarChart" : "ForksChart",
    });
  };

  const history = trpc.useQuery([
    "postgres.get_repo_history",
    { owner: org_name as string, repo: repo_name as string },
  ]);

  return (
    <section
      className="p-4 mt-4 flex flex-col items-center rounded-md border border-black"
      id={section_id}
    >
      <div className="flex flex-row items-center gap-2">
        <h2 className="text-center font-extrabold text-3xl text-primary self-center pb-2">
          Adoption
        </h2>
        {history.data && history.data.length > 0 && (
          <>
            <MdShare
              className="hover:text-primary text-black cursor-pointer"
              onClick={async () => {
                save_data_url();
                setIsOpenShare(true);
              }}
            />
            <Modal
              isOpen={isOpenShare}
              setIsOpen={setIsOpenShare}
              content={
                <ShareCard
                  org_name={org_name as string}
                  repo_name={repo_name as string}
                  twitter_text="Share on Twitter"
                  chart_type={
                    field == "stargazers_count" ? "StarChart" : "ForksChart"
                  }
                />
              }
            />
          </>
        )}
      </div>
      <p className="text-center text-gray-500 pt-2">
        Metrics on how many people know and interact with the repo
      </p>
      {history.data && history.data.length > 0 ? (
        <div className="grid grid-cols-[2fr_1fr] gap-2">
          <div className="flex flex-col items-center justify-center gap-1">
            <h3 className="font-bold text-2xl self-start">
              {field == "stargazers_count" ? "Star Growth" : "Fork Growth"}
            </h3>
            <RadioHorizontal
              radio_names={["stargazers_count", "forks_count"]}
              active_radio_name={field}
              setRadioName={setField}
              id_modifier="adoption"
            />
            <div className="container mx-auto h-96 w-full" id="star-chart">
              <StarChart field={field} />
            </div>
          </div>
          <div className="flex flex-col items-center gap-2 justify-center">
            <AdoptionTable />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 justify-center mt-6">
          <AdoptionTable />
        </div>
      )}
      <Insights />
    </section>
  );
};

const TableRow = ({
  left,
  response,
  data,
  response_data_name,
}: {
  left: React.ReactNode;
  response?: UseQueryResult<any>;
  data?: string | number;
  response_data_name?: string;
}) => {
  return (
    <div className="flex flex-row gap-2">
      <CardSmall>{left}</CardSmall>
      <Card
        response={response}
        data={data}
        response_data_name={response_data_name}
      />
    </div>
  );
};

const AdoptionTable = () => {
  const router = useRouter();
  const { org_name, repo_name } = router.query;

  const response = trpc.useQuery([
    "github.get_github_repo",
    { owner: org_name as string, repo: repo_name as string },
  ]);

  return (
    <div className="flex flex-col gap-2">
      <TableRow
        left={
          <>
            <GoStar size={20} />
            Stars
          </>
        }
        response={response}
        response_data_name={"stargazers_count"}
      />
      <TableRow
        left={
          <>
            <GoIssueOpened size={20} />
            Open Issues
          </>
        }
        response={response}
        response_data_name={"open_issues_count"}
      />
      <TableRow
        left={
          <>
            <GoRepoForked size={20} /> Forks
          </>
        }
        response={response}
        response_data_name={"forks_count"}
      />
    </div>
  );
};

interface CardProps {
  response?: UseQueryResult<any>;
  response_data_name?: string;
  data?: string | number;
}

const Card = ({ response, data, response_data_name }: CardProps) => {
  if (response) {
    return (
      <>
        {response.isLoading ? (
          <TemplateCard />
        ) : (
          <div className="rounded-lg w-28 bg-white text-xl h-8 border boder-solid border-black px-2 flex flex-row justify-end items-center">
            {response_data_name
              ? (response.data[response_data_name] as number).toLocaleString()
              : response.data}
          </div>
        )}
      </>
    );
  }
  if (data) {
    return (
      <div className="rounded-lg w-28 bg-white h-8 border boder-solid border-black px-2 flex flex-row justify-end items-center">
        {data}
      </div>
    );
  }

  return (
    <div className="rounded-lg w-28 bg-white h-8 border boder-solid border-black px-2 flex flex-row justify-end items-center">
      There was a problem loading data
    </div>
  );
};

// always static content
const CardSmall = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-44 rounded-lg bg-white text-xl h-8 border boder-solid border-black px-2 flex flex-row items-center justify-start gap-2">
      {children}
    </div>
  );
};

const TemplateCard = () => {
  return <div className="rounded-lg w-32 h-6 bg-gray-200 animate-pulse"></div>;
};

const Insights = () => {
  const router = useRouter();
  const { org_name, repo_name } = router.query;

  const repo_rank_response = trpc.useQuery([
    "postgres.get_repo_rank",
    {
      owner: org_name as string,
      repo: repo_name as string,
    },
  ]);

  const response = trpc.useQuery([
    "github.get_github_repo",
    { owner: org_name as string, repo: repo_name as string },
  ]);

  const [nonZero, setNonZero] = useState(true);
  return (
    <div className="pt-10 flex">
      <div className="mx-auto">
        {repo_rank_response.isLoading && response.isLoading ? (
          <TemplateCard />
        ) : (
          <div className="flex flex-col items-center gap-2">
            <InsightCard
              text={
                repo_rank_response.data?.full_name
                  ? `№ ${repo_rank_response.data.rank} by stars on GitHub`
                  : response.data["stargazers_count"] > 0
                  ? `Top ${count_percent_rank(
                      response.data["stargazers_count"],
                      nonZero
                    )}% by stars on GitHub`
                  : "The repo has zero stars"
              }
              color={
                repo_rank_response.data?.full_name
                  ? "positive"
                  : response.data["stargazers_count"] > 0
                  ? "neutral"
                  : "negative"
              }
              // >1k stars - positive, less than 1k, neutral, if 0 stars, then red
            />
            {!repo_rank_response.data?.full_name &&
            response.data["stargazers_count"] > 0 ? (
              <label
                htmlFor="small-toggle"
                className="inline-flex relative items-center mb-5 cursor-pointer"
              >
                <input
                  type="checkbox"
                  id="small-toggle"
                  className="sr-only peer"
                  checked={nonZero}
                  onChange={() => setNonZero(!nonZero)}
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                  Include zero star repos
                </span>
              </label>
            ) : (
              ""
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdoptionSection;
