const GovernanceToolTip = () => {
  return (
    <div className="z-10 w-72 text-sm font-light text-gray-500 bg-white rounded-lg border border-gray-200 shadow-sm transition-opacity duration-300 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400">
      <div className="p-3 space-y-2">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          Governance Docs Check
        </h3>
        <p>
          Governance docs are a set of documents that describe how a project is
          governed. They are usually found in the root of the project
          repository. It is important to have governance docs in place to ensure
          that the project is well maintained and that the community is healthy.
          <br />
          <br />
          <b>Note:</b> Currently GitHub API returns wrong results for Issue
          Template if a new format with a folder is used. We are working on a
          fix.
        </p>
      </div>
    </div>
  );
};

export default GovernanceToolTip;
