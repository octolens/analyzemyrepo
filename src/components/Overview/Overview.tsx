import OverviewSectionColumn from "./Column";
import {
  GoStar,
  GoIssueOpened,
  GoRepoForked,
  GoGitPullRequest,
  GoGitCommit,
  GoPerson,
} from "react-icons/go";
import { UseQueryResult } from "react-query";

interface OverViewSectionProps {
  section_id: string;
  response: UseQueryResult<any>;
  commits_response: UseQueryResult<any>;
}

const OverviewSection = ({
  section_id,
  response,
  commits_response,
}: OverViewSectionProps) => {
  return (
    <section className="py-4 flex flex-col items-center" id={section_id}>
      <h2 className="text-center font-extrabold text-3xl">Overview</h2>
      <div className="grid grid-cols-2 gap-28">
        <OverviewSectionColumn column_title="Adoption Metrics">
          <AdoptionTable response={response} />
        </OverviewSectionColumn>
        <OverviewSectionColumn column_title="Contribution Metrics">
          <ContributionTable
            response={response}
            response_2={commits_response}
          />
        </OverviewSectionColumn>
      </div>
    </section>
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
          <div className="rounded-lg w-44 bg-white h-6 border boder-solid border-black px-2 flex flex-row justify-end items-center">
            {response_data_name
              ? response.data[response_data_name]
              : response.data}
          </div>
        )}
      </>
    );
  }
  if (data) {
    return (
      <div className="rounded-lg w-44 bg-white h-6 border boder-solid border-black px-2 flex flex-row justify-end items-center">
        data
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
  response,
  response_2,
}: {
  response: UseQueryResult<any>;
  response_2: UseQueryResult<any>;
}) => {
  return (
    <div className="flex flex-col gap-2">
      <TableRow
        left={
          <>
            <GoPerson />
            Contributors
          </>
        }
        response={response}
        response_data_name={"stargazers_count"}
      />
      <TableRow
        left={
          <>
            <GoGitPullRequest />
            PRs
          </>
        }
        response={response}
        response_data_name={"stargazers_count"}
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
