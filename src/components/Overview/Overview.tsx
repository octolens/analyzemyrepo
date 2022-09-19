import OverviewSectionColumn from "./Column";
import {
  GoStar,
  GoIssueOpened,
  GoRepoForked,
  GoGitPullRequest,
  GoGitCommit,
  GoGitBranch,
} from "react-icons/go";
import { UseQueryResult } from "react-query";

interface OverViewSectionProps {
  section_id: string;
  response: UseQueryResult<any>;
  commits_response: UseQueryResult<any>;
  open_prs_response: UseQueryResult<any>;
  branches_response: UseQueryResult<any>;
  repo_rank_response: UseQueryResult<any>;
}

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

const count_percent_rank = (stars: number) => {
  const values = Object.values(approximate_repo_distribution);

  const sum = values.reduce((accumulator, value) => {
    return accumulator + value;
  }, 0);

  const bins = Object.keys(approximate_repo_distribution);

  let result_bin: string = "0..0";
  let index_to_sum_from: number = 0;

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

  console.log("sum", sum);
  console.log("tail", upper_tail_sum);
  const percentage = (upper_tail_sum / sum) * 100;

  return Math.ceil(percentage).toFixed(0);
};

const OverviewSection = ({
  section_id,
  response,
  commits_response,
  open_prs_response,
  branches_response,
  repo_rank_response,
}: OverViewSectionProps) => {
  return (
    <section className="py-4 flex flex-col items-center" id={section_id}>
      <h2 className="text-center font-extrabold text-3xl">Overview</h2>
      <div className="text-center w-96 truncate py-2">
        {response.isLoading ? "description" : response.data.description}
      </div>
      <div className="grid grid-cols-2 gap-28">
        <OverviewSectionColumn column_title="Adoption Metrics">
          <AdoptionTable response={response} />
        </OverviewSectionColumn>
        <OverviewSectionColumn column_title="Contribution Metrics">
          <ContributionTable
            response_2={commits_response}
            response_3={open_prs_response}
            response_4={branches_response}
          />
        </OverviewSectionColumn>
      </div>
      {/* Insights section */}
      <div className="pt-10 flex">
        <div className="mx-auto">
          {repo_rank_response.isLoading && response.isLoading ? (
            <TemplateCard />
          ) : (
            <InsightCard
              color="positive"
              text={
                repo_rank_response.data.repos_rank.length > 0
                  ? `№ ${repo_rank_response.data.repos_rank[0].rank} by stars on GitHub`
                  : `Top ${count_percent_rank(
                      response.data["stargazers_count"]
                    )}% by stars on GitHub`
              }
            />
          )}
        </div>
      </div>
    </section>
  );
};

interface CardProps {
  response?: UseQueryResult<any>;
  response_data_name?: string;
  data?: string | number;
}

const InsightCard = ({
  color,
  text,
}: {
  color: "positive" | "negative" | "neutral";
  text: string;
}) => {
  const color_dict = {
    positive: "bg-green-200",
    negative: "bg-red-200",
    neutral: "bg-gray-200",
  };
  return (
    <div
      className={`rounded-lg w-64 h-6 border boder-solid border-black px-2 flex flex-row items-center ${color_dict[color]} justify-center`}
    >
      {text}
    </div>
  );
};

const Card = ({ response, data, response_data_name }: CardProps) => {
  if (response) {
    return (
      <>
        {response.isLoading ? (
          <TemplateCard />
        ) : (
          <div className="rounded-lg w-44 bg-white h-6 border boder-solid border-black px-2 flex flex-row justify-end items-center">
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
      <div className="rounded-lg w-44 bg-white h-6 border boder-solid border-black px-2 flex flex-row justify-end items-center">
        {data}
      </div>
    );
  }

  return <p>broken</p>;
};

// always static content
const CardSmall = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-32 rounded-lg bg-white h-6 border boder-solid border-black px-2 flex flex-row items-center justify-start gap-2">
      {children}
    </div>
  );
};

const TemplateCard = () => {
  return <div className="rounded-lg w-44 h-6 bg-gray-200 animate-pulse"></div>;
};

const TemplateCardSmall = () => {
  return <div className="rounded-lg w-32 h-6 bg-gray-200 animate-pulse"></div>;
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

const AdoptionTable = ({ response }: { response: UseQueryResult<any> }) => {
  return (
    <div className="flex flex-col gap-2">
      <TableRow
        left={
          <>
            <GoStar />
            Stars
          </>
        }
        response={response}
        response_data_name={"stargazers_count"}
      />
      <TableRow
        left={
          <>
            <GoIssueOpened />
            Open Issues
          </>
        }
        response={response}
        response_data_name={"open_issues_count"}
      />
      <TableRow
        left={
          <>
            <GoRepoForked /> Forks
          </>
        }
        response={response}
        response_data_name={"forks_count"}
      />
    </div>
  );
};

const ContributionTable = ({
  response_2,
  response_3,
  response_4,
}: {
  response_2: UseQueryResult<any>;
  response_3: UseQueryResult<any>;
  response_4: UseQueryResult<any>;
}) => {
  return (
    <div className="flex flex-col gap-2">
      <TableRow
        left={
          <>
            <GoGitBranch />
            Branches
          </>
        }
        response={response_4}
        response_data_name={"branches"}
      />
      <TableRow
        left={
          <>
            <GoGitPullRequest />
            Open PRs
          </>
        }
        response={response_3}
        response_data_name={"open_prs"}
      />
      <TableRow
        left={
          <>
            <GoGitCommit />
            Commits
          </>
        }
        response={response_2}
        response_data_name={"commits"}
      />
    </div>
  );
};

export default OverviewSection;
