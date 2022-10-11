import HealthTable from "../Table/HealthTable";
import Tooltip from "../Tooltip/Tooltip";

const CompletenessSection = ({ section_id = "Repo Checklist" }) => {
  return (
    <section className="flex flex-col items-center gap-2" id={section_id}>
      <h2 className="text-center font-extrabold text-3xl py-2">
        Repo Checklist
      </h2>
      <p className="text-center text-gray-500">
        Community guidelines docs{" "}
        <div className="inline align-middle">
          <Tooltip
            tip={<>Here will be a tooltip</>}
            position_priority={"right"}
          />
        </div>
      </p>
      <HealthTable />
    </section>
  );
};

export default CompletenessSection;
