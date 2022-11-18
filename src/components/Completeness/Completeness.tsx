import HealthTable from "../Table/HealthTable";
import Tooltip from "../Tooltip/Tooltip";

const CompletenessSection = ({ section_id = "Repo Checklist" }) => {
  return (
    <section
      className="p-4 mt-4 flex flex-col items-center gap-2 rounded-md border border-black"
      id={section_id}
    >
      <h2 className="text-center font-extrabold text-3xl py-2 text-primary">
        Community Guidelines
      </h2>
      <p className="text-center text-gray-500">
        Community guidelines docs{" "}
        <div className="inline align-middle">
          <Tooltip
            tip={<>Presence of important community docs in the repo </>}
            position_priority={"right"}
          />
        </div>
      </p>
      <HealthTable />
    </section>
  );
};

export default CompletenessSection;
