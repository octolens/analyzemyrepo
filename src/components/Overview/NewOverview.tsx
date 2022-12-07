import { checks } from "../../utils/rating";
import { trpc } from "../../utils/trpc";
import { useRouter } from "next/router";
import ListSkeleton from "../Skeletons/ListSkeleton";
import { MdCheckCircle, MdInfo } from "react-icons/md";
import { RiErrorWarningFill } from "react-icons/ri";
import Modal from "../Modal/Modal";
import { useState, useMemo } from "react";
import { checks_texts as contribution_texts } from "../../utils/contributions";
import { checks_texts as adoption_texts } from "../../utils/adoption";
import { checks_texts as diversity_texts } from "../../utils/diversity";
import { checks_texts as community_texts } from "../../utils/community";
import { verdicts } from "../../utils/consts";
import RadarChart, { RadarSkeleton } from "./RadarChart";
import { MdShare } from "react-icons/md";
import ShareCard from "../Social/all";

// results framework
// key format: adoption+contribution-diversity+community+growth-

const sample_insights_from_checks = (checks: Record<string, any>) => {
  const MAX_GOOD_THINGS = 5;
  const MAX_BAD_THINGS = 3;
  const MAX_PER_CATEGORY = 2; // this is in both good and bad

  const CATEGORY_PRIORITIES: (keyof ChecksType)[] = [
    "diversity",
    "adoption",
    "contribution",
    "community",
  ];

  const checks_getter = (category: keyof ChecksType) => {
    if (category == "adoption") {
      return adoption_texts;
    }

    if (category == "community") {
      return community_texts;
    }

    if (category == "diversity") {
      return diversity_texts;
    }

    if (category == "contribution") {
      return contribution_texts;
    }
  };

  const PRIORITIES = {
    adoption: ["rating", "stars", "issues", "forks"],
    diversity: ["geo_diversity", "org_diversity", "geo_density", "org_density"],
    contribution: ["bus_factor", "serious_factor", "contributors_count"],
    community: [
      "code_of_conduct",
      "contributing",
      "issue_template",
      "pull_request_template",
      "license",
      "readme",
      "description",
      "documentation",
    ],
  };

  const good: string[] = [];
  const bad: string[] = [];

  for (const category of CATEGORY_PRIORITIES) {
    let category_count_good = 0;
    let category_count_bad = 0;
    for (const metric of PRIORITIES[category]) {
      if (checks[category][metric]) {
        if (
          good.length < MAX_GOOD_THINGS &&
          category_count_good < MAX_PER_CATEGORY
        ) {
          const obj = checks_getter(category);
          if (obj) {
            good.push(obj[metric].good);
            category_count_good += 1;
          }
        }
      }
      // we want to show only bad things, filtering no data insights
      else if (checks[category][metric] != null) {
        if (
          bad.length < MAX_BAD_THINGS &&
          category_count_bad < MAX_PER_CATEGORY
        ) {
          const obj = checks_getter(category);
          if (obj) {
            bad.push(obj[metric].bad);
            category_count_bad += 1;
          }
        }
      }
    }
  }

  return { good, bad };
};

const OverviewSection = ({ section_id = "Overview" }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpenShare, setIsOpenShare] = useState<boolean>(false);
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

  const saveDataURL = trpc.useMutation("dataURL.upsert");

  const save_data_url = async () => {
    const node = document.getElementById("radar-chart");
    const svg = node?.getElementsByTagName("svg")[0];
    const imageURL =
      "data:image/svg+xml;base64," +
      Buffer.from(svg?.outerHTML as string).toString("base64");
    await saveDataURL.mutateAsync({
      data_url: imageURL,
      owner: org_name as string,
      repo: repo_name as string,
      type: "Radar",
    });
  };

  const isLoading =
    rank.isLoading ||
    repo.isLoading ||
    gh_contributors.isLoading ||
    serious_contributors.isLoading ||
    total_contributions.isLoading ||
    geo.isLoading ||
    org.isLoading ||
    community.isLoading;

  const get_all_checks = useMemo(() => {
    if (isLoading) {
      return;
    }
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

    const checks_results = {
      adoption: adoption_checks.results,
      contribution: contribution_checks.results,
      diversity: diversity_checks.results,
      community: community_checks.results,
    };

    const get_verdict = () => {
      const plus_minus = (x: boolean) => (x ? "+" : "-");
      const key = `adoption${plus_minus(
        adoption_checks.verdict
      )}contribution${plus_minus(
        contribution_checks.verdict
      )}diversity${plus_minus(diversity_checks.verdict)}community${plus_minus(
        community_checks.verdict
      )}growth+`;

      return (verdicts as Record<string, any>)[key] as string;
    };

    return {
      scores: {
        adoption_score: adoption_checks.score,
        contribution_score: contribution_checks.score,
        diversity_score: diversity_checks.score,
        community_score: community_checks.score,
      },
      checks: checks_results,
      insights: sample_insights_from_checks(checks_results),
      verdict: get_verdict(),
    };
  }, [isLoading, org_name, repo_name]);
  return (
    <section
      className="p-4 flex flex-col items-center rounded-md border border-black"
      id={section_id}
    >
      <div className="flex flex-row items-center gap-2">
        <h2 className="text-center font-extrabold text-3xl text-primary self-center">
          Overview
        </h2>
        <MdShare
          className="hover:text-primary text-black cursor-pointer mt-[0.4rem]"
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
              chart_type="Radar"
            />
          }
        />
      </div>
      <div className="text-center w-fit py-2">
        <p className="text-center pt-1 text-gray-500">
          Summary of overall repo health
        </p>
      </div>
      <div className="container flex flex-col md:flex-row">
        <Summary
          modalIsOpen={isOpen}
          modalSetIsOpen={setIsOpen}
          isLoading={isLoading}
          data={get_all_checks?.checks}
          insights={get_all_checks?.insights}
        />
        <div className="flex flex-col order-first md:order-none">
          <div className="container flex flex-1" id="radar-chart">
            <div className="md:w-96 md:h-80 w-72 h-52">
              {/* make skeleton responsive */}
              {isLoading ? (
                <RadarSkeleton />
              ) : (
                <RadarChart
                  score_data={get_all_checks?.scores}
                  checks={get_all_checks?.checks}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row w-full justify-between pt-4 items-center">
        <button
          className="w-fit h-fit px-2 py-1 text-sm font-medium text-white bg-black rounded-md shadow bg-opacity-80 hover:bg-opacity-100"
          onClick={() => setIsOpen(true)}
        >
          See all checks
        </button>
        {get_all_checks?.verdict && (
          <div className="max-w-md text-center order-first pb-4 md:pb-0 md:order-none">
            <p className="text-lg font-semibold">Our overall assessment</p>
            <p className="text-md text-center">{get_all_checks?.verdict}</p>
          </div>
        )}
      </div>
    </section>
  );
};

const Summary = ({
  modalIsOpen,
  modalSetIsOpen,
  isLoading,
  data,
  insights,
}: {
  modalIsOpen: boolean;
  modalSetIsOpen: (x: boolean) => void;
  isLoading: boolean;
  data: ChecksType | undefined;
  insights: { good: any[]; bad: any[] } | undefined;
}) => {
  if (isLoading || !data || !insights) {
    return (
      <div className="flex-1">
        <ListSkeleton />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-row md:flex-col gap-2">
      <div>
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
          Highs
        </h3>
        <ul className="space-y-1 max-w-md list-inside text-gray-500 dark:text-gray-400">
          {insights.good.map((value) => (
            <GoodListItem text={value} key={`${value}-good-item-insight`} />
          ))}
        </ul>
      </div>
      {insights.bad.length > 0 ? (
        <div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
            Lows
          </h3>
          <ul className="space-y-1 max-w-md list-inside text-gray-500 dark:text-gray-400">
            {insights.bad.map((value) => (
              <BadListItem text={value} key={`${value}-bad-item-insight`} />
            ))}
          </ul>
        </div>
      ) : null}
      <Modal
        isOpen={modalIsOpen}
        setIsOpen={modalSetIsOpen}
        content={<ModalContents data={data} />}
      />
    </div>
  );
};

const GoodListItem = ({ text }: { text: string }) => {
  return (
    <li className="flex items-center gap-2 leading-tight">
      <span className="self-start">
        <MdCheckCircle color="green" size={"20px"} />
      </span>
      <span>{text}</span>
    </li>
  );
};

const BadListItem = ({ text }: { text: string }) => {
  return (
    <li className="flex items-start gap-2 leading-tight">
      <span className="self-start">
        <RiErrorWarningFill color="orange" size={"20px"} />
      </span>
      <span>{text}</span>
    </li>
  );
};

const NoDataListItem = ({ text }: { text: string }) => {
  return (
    <li className="flex items-center gap-2 leading-tight">
      <span>
        <MdInfo color="gray" size={"20px"} />
      </span>
      <span> {text}</span>
    </li>
  );
};

export type ChecksType = {
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
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3">
        <h3 className="text-xl font-extrabold">Adoption</h3>
        <ul>
          {Object.entries(data.adoption).map((value) =>
            value[1] ? (
              <GoodListItem text={adoption_texts[value[0]].good} />
            ) : value[1] == null ? (
              <NoDataListItem text={adoption_texts.default} />
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
            ) : value[1] == null ? (
              <NoDataListItem text={contribution_texts.default} />
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
            ) : value[1] == null ? (
              <NoDataListItem text={diversity_texts.default} />
            ) : (
              <BadListItem text={diversity_texts[value[0]].bad} />
            )
          )}
        </ul>
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="text-xl font-extrabold">Governance</h3>
        <ul>
          {Object.entries(data.community).map((value) =>
            value[1] ? (
              <GoodListItem text={community_texts[value[0]].good} />
            ) : value[1] == null ? (
              <NoDataListItem text={community_texts.default} />
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
