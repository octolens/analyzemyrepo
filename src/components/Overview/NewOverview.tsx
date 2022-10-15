import { verdicts, checks } from "../../utils/rating";
import { trpc } from "../../utils/trpc";
import { useRouter } from "next/router";

// How to calculate verdict
// I have 5 categories - each of them could be positiive or negative depending on majority

// Insgihts - just share 2-3 positive and 2-3 negative

// results framework
// key format: adoption+contribution-diversity+community+growth-

const OverviewSection = ({ section_id = "New Overview" }) => {
  const router = useRouter();
  const { org_name, repo_name } = router.query;
  const repo = trpc.useQuery([
    "github.get_github_repo",
    { owner: org_name as string, repo: repo_name as string },
  ]);

  const repo_rank = trpc.useQuery([
    "postgres.get_repo_rank",
    {
      owner: org_name as string,
      repo: repo_name as string,
    },
  ]);
  return (
    <section
      className="p-4 mt-4 flex flex-col items-center rounded-md border border-black"
      id={section_id}
    >
      <h2 className="text-center font-extrabold text-3xl">Overview</h2>
      <div className="text-center w-fit py-2">
        <p className="text-center pt-1 text-gray-500">
          Main stats about the repo
        </p>
      </div>
      <div className="container flex flex-row">
        <div className="flex-1">Here will be insights</div>
        <div>Here will be chart</div>
      </div>
    </section>
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
