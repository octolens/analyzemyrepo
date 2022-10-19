import { checks } from "../../utils/rating";
import { trpc } from "../../utils/trpc";
import { useRouter } from "next/router";
import ListSkeleton from "../Skeletons/ListSkeleton";
import { MdCancel, MdCheckCircle } from "react-icons/md";
import Modal from "../Modal/Modal";
import { useState } from "react";
import { checks_texts as contribution_texts } from "../../utils/contributions";
import { checks_texts as adoption_texts } from "../../utils/adoption";
import { checks_texts as diversity_texts } from "../../utils/diversity";
import { checks_texts as community_texts } from "../../utils/community";

// How to calculate verdict
// I have 5 categories - each of them could be positiive or negative depending on majority

// Insgihts - just share 2-3 positive and 2-3 negative

// results framework
// key format: adoption+contribution-diversity+community+growth-

const OverviewSection = ({ section_id = "Overview" }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <section
      className="p-4 mt-5 flex flex-col items-center rounded-md border border-black"
      id={section_id}
    >
      <h2 className="text-center font-extrabold text-3xl">Overview</h2>
      <div className="text-center w-fit py-2">
        <p className="text-center pt-1 text-gray-500">
          Main stats about the repo
        </p>
      </div>
      <div className="container flex flex-row">
        <Summary modalIsOpen={isOpen} modalSetIsOpen={setIsOpen} />
        <div>Here will be chart</div>
      </div>
      <div className="self-start pt-4">
        <button
          className="px-2 py-1 text-sm font-medium text-white bg-black rounded-md shadow bg-opacity-80 hover:bg-opacity-100"
          onClick={() => setIsOpen(true)}
        >
          See all checks
        </button>
      </div>
    </section>
  );
};

const Summary = ({
  modalIsOpen,
  modalSetIsOpen,
}: {
  modalIsOpen: boolean;
  modalSetIsOpen: (x: boolean) => void;
}) => {
  const router = useRouter();
  const { org_name, repo_name } = router.query;

  const rank = trpc.useQuery([
    "postgres.get_repo_rank",
    { owner: org_name as string, repo: repo_name as string },
  ]);

  const repo = trpc.useQuery([
    "github.get_github_repo",
    { owner: org_name as string, repo: repo_name as string },
  ]);

  const gh_contributors = trpc.useQuery([
    "github.get_github_repo_contributors",
    { owner: org_name as string, repo: repo_name as string },
  ]);

  const serious_contributors = trpc.useQuery([
    "postgres.get_serious_contributors",
    { owner: org_name as string, repo: repo_name as string },
  ]);

  const total_contributions = trpc.useQuery([
    "github.get_contributions_count",
    { owner: org_name as string, repo: repo_name as string },
  ]);

  const geo = trpc.useQuery([
    "postgres.get_repo_contributors_countries",
    { owner: org_name as string, repo: repo_name as string },
  ]);

  const org = trpc.useQuery([
    "postgres.get_repo_contributors_companies",
    { owner: org_name as string, repo: repo_name as string },
  ]);

  const community = trpc.useQuery([
    "github.get_community_health",
    { owner: org_name as string, repo: repo_name as string },
  ]);

  const get_all_checks = () => {
    const adoption_checks = checks.adoption.calculate_verdict({
      rank_data: rank?.data,
      repo_data: repo.data,
    });

    const contribution_checks = checks.contribution.calculate_verdict({
      contributors_data: gh_contributors.data,
      serious_data: serious_contributors.data,
      contributions_count_data: total_contributions.data,
    });

    const diversity_checks = checks.diversity.calculate_verdict({
      geo_data: geo.data,
      org_data: org.data,
    });

    const community_checks = checks.community.calclulate_verdict(
      community.data
    );

    return {
      adoption_score: adoption_checks.score,
      contribution_score: contribution_checks.score,
      diversity_score: diversity_checks.score,
      community_score: community_checks.score,
      checks: {
        adoption: adoption_checks.results,
        contribution: contribution_checks.results,
        diversity: diversity_checks.results,
        community: community_checks.results,
      },
    };
  };

  // const calculate_adoption = ({
  //   rank_data,
  //   repo_data,
  // }: {
  //   rank_data: inferQueryOutput<"postgres.get_repo_rank">;
  //   repo_data: inferQueryOutput<"github.get_github_repo">;
  // }) => {
  //   const result = checks.adoption.calculate_verdict({ rank_data, repo_data });
  // };

  // const calculate_contributions = ({
  //   contributors_data,
  //   serious_data,
  //   contributions_data,
  // }: {
  //   contributors_data: inferQueryOutput<"github.get_github_repo_contributors">;
  //   serious_data: inferQueryOutput<"postgres.get_serious_contributors">;
  //   contributions_data: inferQueryOutput<"github.get_contributions_count">;
  // }) => {};

  if (repo.isLoading || rank.isLoading) {
    return (
      <div className="flex-1">
        <ListSkeleton />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <div>
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
          Highs
        </h3>
        <ul className="space-y-1 max-w-md list-inside text-gray-500 dark:text-gray-400">
          <GoodListItem text="Very good" />
        </ul>
      </div>
      <div>
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
          Lows
        </h3>
        <ul className="space-y-1 max-w-md list-inside text-gray-500 dark:text-gray-400">
          <li className="flex items-center gap-2">
            <BadListItem text="Very bad" />
          </li>
        </ul>
      </div>
      <Modal
        isOpen={modalIsOpen}
        setIsOpen={modalSetIsOpen}
        content={<ModalContents data={get_all_checks().checks} />}
      />
    </div>
  );
};

const GoodListItem = ({ text }: { text: string }) => {
  return (
    <li className="flex items-center gap-2">
      <MdCheckCircle color="green" size={18} />
      {text}
    </li>
  );
};

const BadListItem = ({ text }: { text: string }) => {
  return (
    <li className="flex items-center gap-2">
      <MdCancel color="red" size={18} />
      {text}
    </li>
  );
};

type ChecksType = {
  adoption: {
    forks: boolean | null;
    stars: boolean | null;
    issues: boolean | null;
    rating: boolean | null;
  };
  contribution: {
    bus_factor: boolean | null;
    serious_factor: boolean | null;
    contributors_count: boolean | null;
  };
  diversity: {
    geo_diversity: boolean | null;
    geo_density: boolean | null;
    org_diversity: boolean | null;
    org_density: boolean | null;
  };
  community: {
    description: boolean | null;
    documentation: boolean | null;
    code_of_conduct: boolean | null;
    contributing: boolean | null;
    issue_template: boolean | null;
    pull_request_template: boolean | null;
    license: boolean | null;
    readme: boolean | null;
  };
};

const ModalContents = ({ data }: { data: ChecksType }) => {
  return (
    <div className="flex flex-col overflow-y-auto gap-3">
      <div className="flex flex-col gap-3">
        <h3 className="text-xl font-extrabold">Adoption</h3>
        <ul>
          {Object.entries(data.adoption).map((value) =>
            value[1] ? (
              <GoodListItem text={adoption_texts[value[0]].good} />
            ) : (
              <BadListItem text={adoption_texts[value[0]].bad} />
            )
          )}
        </ul>
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="text-xl font-extrabold">Contribution</h3>
        <ul>
          {Object.entries(data.contribution).map((value) =>
            value[1] ? (
              <GoodListItem text={contribution_texts[value[0]].good} />
            ) : (
              <BadListItem text={contribution_texts[value[0]].bad} />
            )
          )}
        </ul>
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="text-xl font-extrabold">Diversity</h3>
        <ul>
          {Object.entries(data.diversity).map((value) =>
            value[1] ? (
              <GoodListItem text={diversity_texts[value[0]].good} />
            ) : (
              <BadListItem text={diversity_texts[value[0]].bad} />
            )
          )}
        </ul>
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="text-xl font-extrabold">Community</h3>
        <ul>
          {Object.entries(data.community).map((value) =>
            value[1] ? (
              <GoodListItem text={community_texts[value[0]].good} />
            ) : (
              <BadListItem text={community_texts[value[0]].bad} />
            )
          )}
        </ul>
      </div>
    </div>
  );
};

export default OverviewSection;

// I gonna have 5 categories
// adoption - 3 checks on stars, forks and issues (also need adoption section + maybe stars chart)
// contribution activity - bus factor check, serious ratio check (some other commits check)
// diversity - two geo checks + one organizational check
// community guidelines - 8 checks
// activity, growth, engagement - something like this

// I have to calculate all this checks in one place
// and also derive some insights to show
// probably need to export some common stuff to the "utils" section
