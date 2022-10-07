const GeoToolTip = () => {
  return (
    <div className="z-10 w-72 text-sm font-light text-gray-500 bg-white rounded-lg border border-gray-200 shadow-sm transition-opacity duration-300 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400">
      <div className="p-3 space-y-2">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          How map is calculated
        </h3>
        <p>
          We analyze all quailified commits to the repo and collect all users
          from them. Then we "parse" users location based on information in
          their public profile. Because not all users specify their location or
          sometimes specify something unindentifible, this map is only
          approximate, but still can provide some insights into geography of
          your contributors.
        </p>
        <h3 className="font-semibold text-gray-900 dark:text-white">
          Commits_count vs contributors_count
        </h3>
        <p>
          You can select how you want the map to be calculated.{" "}
          <b>Commits_count </b>
          option highlights countries by the number of commits originating from
          this country, while <b>contributors_count</b> highlight countries
          based on number of contributors coming from particular country.
        </p>
      </div>
    </div>
  );
};

export default GeoToolTip;
