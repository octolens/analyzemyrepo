import SimpleTable from "./Table";
import { MdCancel, MdCheckCircle } from "react-icons/md";
import { trpc } from "../../utils/trpc";
import { useRouter } from "next/router";
import InsightCard from "../Cards/InsightCard";
import { count_community_score } from "../../utils/community";

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
      <div className="grid grid-cols-[1fr_auto] gap-2">
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
              key="conditional-icon-1"
            />,
            <ConditionalIcon
              condition={health_query.data.documentation !== null}
              key="conditional-icon-2"
            />,
            <ConditionalIcon
              condition={health_query.data.files.code_of_conduct !== null}
              key="conditional-icon-3"
            />,
            <ConditionalIcon
              condition={health_query.data.files.contributing !== null}
              key="conditional-icon-4"
            />,
            <ConditionalIcon
              condition={health_query.data.files.issue_template !== null}
              key="conditional-icon-5"
            />,
            <ConditionalIcon
              condition={health_query.data.files.pull_request_template !== null}
              key="conditional-icon-6"
            />,
            <ConditionalIcon
              condition={health_query.data.files.license !== null}
              key="conditional-icon-7"
            />,
            <ConditionalIcon
              condition={health_query.data.files.readme !== null}
              key="conditional-icon-7"
            />,
          ]}
        />
      </div>
      <div className="pt-4">
        {count_community_score(health_query.data) > 4 ? (
          <InsightCard
            color="positive"
            text={`More than half checks (${count_community_score(
              health_query.data
            )}/8)`}
          />
        ) : count_community_score(health_query.data) == 4 ? (
          <InsightCard
            color="neutral"
            text={`Half of the checks (${count_community_score(
              health_query.data
            )}/8)`}
          />
        ) : (
          <InsightCard
            color="negative"
            text={`Less than half checks (${count_community_score(
              health_query.data
            )}/8)`}
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
