import OverviewSectionColumn from "./Column";
import type { GithubAPIRepoResponse } from "../../types/github_api";

interface OverViewSectionProps {
  section_id: string;
  response: GithubAPIRepoResponse;
  isLoading: boolean;
}

const OverviewSection = ({
  section_id,
  response,
  isLoading,
}: OverViewSectionProps) => {
  return (
    <section className="py-4 flex flex-col items-center" id={section_id}>
      <h2 className="text-center font-extrabold text-3xl">Overview</h2>
      <div className="grid grid-cols-2 gap-96">
        <OverviewSectionColumn column_title="Adoption Metrics">
          {isLoading ? (
            <>
              <TemplateCard />
              <TemplateCard />
              <TemplateCard />
            </>
          ) : (
            <>
              <Card>Stars: {response.stargazers_count}</Card>
              <Card>Forks: {response.forks_count}</Card>
              <Card>Open Issues: {response.open_issues_count}</Card>
            </>
          )}
        </OverviewSectionColumn>
        <OverviewSectionColumn column_title="Contribution Metrics">
          {isLoading ? (
            <>
              <TemplateCard />
              <TemplateCard />
              <TemplateCard />
            </>
          ) : (
            <>
              <Card>Stars: {response.stargazers_count}</Card>
              <Card>Forks: {response.forks_count}</Card>
              <Card>Open Issues: {response.open_issues_count}</Card>
            </>
          )}
        </OverviewSectionColumn>
      </div>
    </section>
  );
};

interface CardProps {
  children: React.ReactNode;
}

const Card = ({ children }: CardProps) => {
  return <div className="card w-80 bg-primary h-6">{children}</div>;
};

const TemplateCard = () => {
  return <div className="card w-80 h-6 bg-gray-200 animate-pulse"></div>;
};

export default OverviewSection;
