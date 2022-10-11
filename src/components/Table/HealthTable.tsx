import SimpleTable from "./Table";
import { MdCancel, MdCheckCircle } from "react-icons/md";
import { trpc } from "../../utils/trpc";
import { useRouter } from "next/router";
import InsightCard from "../Cards/InsightCard";

const count_score = (data: Record<string, any>) => {
  const one_if_not_null = (value: any) => (value !== null ? 1 : 0) as number;

  const score = [
    data.description,
    data.documentation,
    data.files.code_of_conduct,
    data.files.contributing,
    data.files.issue_template,
    data.files.pull_request_template,
    data.files.license,
    data.files.readme,
  ]
    .map(one_if_not_null)
    .reduce((prev, curr) => prev + curr);

  return score;
};

const HealthTable = () => {
  const router = useRouter();

  const { org_name, repo_name } = router.query;

  const health_query = trpc.useQuery([
    "github.get_community_health",
    { owner: org_name as string, repo: repo_name as string },
  ]);

  if (health_query.isLoading) {
    return null;
  }

  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-2 gap-2 w-96">
        <SimpleTable
          header={false}
          column_name="Metrics"
          alternate_colors={false}
          rows={[
            "Description",
            "Website",
            "Code of Conduct",
            "Contributing.md",
            "Issue Template",
            "PR Template",
            "License",
            "README",
          ].map(MetricName)}
        />
        <SimpleTable
          header={false}
          column_name="Checks"
          rows={[
            <ConditionalIcon
              condition={health_query.data.description !== null}
            />,
            <ConditionalIcon
              condition={health_query.data.documentation !== null}
            />,
            <ConditionalIcon
              condition={health_query.data.files.code_of_conduct !== null}
            />,
            <ConditionalIcon
              condition={health_query.data.files.contributing !== null}
            />,
            <ConditionalIcon
              condition={health_query.data.files.issue_template !== null}
            />,
            <ConditionalIcon
              condition={health_query.data.files.pull_request_template !== null}
            />,
            <ConditionalIcon
              condition={health_query.data.files.license !== null}
            />,
            <ConditionalIcon
              condition={health_query.data.files.readme !== null}
            />,
          ]}
        />
      </div>
      <div className="pt-4">
        {count_score(health_query.data) > 4 ? (
          <InsightCard
            color="positive"
            text={`More than half checks (${count_score(
              health_query.data
            )} / 8)`}
          />
        ) : count_score(health_query.data) == 4 ? (
          <InsightCard
            color="neutral"
            text={`Half of the checks (${count_score(health_query.data)} / 8)`}
          />
        ) : (
          <InsightCard
            color="negative"
            text={`Less than half checks (${count_score(
              health_query.data
            )} / 8)`}
          />
        )}
      </div>
    </div>
  );
};

const MetricName = (metric_name: string) => {
  return <div className="flex flex-row justify-center">{metric_name}</div>;
};

const ConditionalIcon = ({ condition = true }) => {
  if (condition) {
    return (
      <div className="flex flex-row justify-center">
        <MdCheckCircle color="green" size={20} />
      </div>
    );
  }

  return (
    <div className="flex flex-row justify-center">
      <MdCancel color="red" size={20} />
    </div>
  );
};

export default HealthTable;
