import { inferQueryOutput } from "./trpc";

const calculate_factor = ({
  data,
  format = true,
}: {
  data: Record<string, number> | undefined;
  format?: boolean;
}) => {
  const perc =
    ((data?.serious_commiters ?? 0) / (data?.total_commiters ?? 1)) * 100;

  if (format) {
    return perc.toLocaleString("en-US", {
      maximumFractionDigits: 1,
      maximumSignificantDigits: 2,
      minimumFractionDigits: 0,
      minimumSignificantDigits: 2,
    });
  }

  return perc;
};

const calculate_factor_hack = (data: Record<string, any>[], format = true) => {
  const serious_commiters = data.filter(
    (value) => value["contributions"] > 1
  ).length;
  const total_commiters = data.length;
  // this method neeeded if the don't have commits of this repo in the database
  // it's approximate becuase it can count only top 100 contributors - but it should be ok for most cases

  const perc = ((serious_commiters ?? 0) / (total_commiters ?? 1)) * 100;

  if (format) {
    return perc.toLocaleString("en-US", {
      maximumFractionDigits: 1,
      maximumSignificantDigits: 2,
      minimumFractionDigits: 0,
      minimumSignificantDigits: 2,
    });
  }

  return perc;
};

export const handle_data_and_calculate_factor = ({
  data_db,
  data_gh,
  format = true,
}: {
  data_db: Record<string, any> | undefined;
  data_gh: Record<string, any>[];
  format: boolean;
}) => {
  if (data_db?.serious_commiters || data_db?.total_commiters) {
    return calculate_factor({ data: data_db, format: format });
  } else {
    return calculate_factor_hack(data_gh, format);
  }
};

export const check_bus_factor = (
  data: Record<string, any>[],
  total_contributions: number
) => {
  const bus_factor = calculate_bus_factor(data, total_contributions);
  return bus_factor.bus_factor > 3;
};

export const check_contributors_count = (
  data: inferQueryOutput<"postgres.get_serious_contributors">
) => {
  return data.total_commiters > 10;
};

export const check_serious_contributors = ({
  data_db,
  data_gh,
  format = true,
}: {
  data_db: Record<string, any> | undefined;
  data_gh: Record<string, any>[];
  format: boolean;
}) => {
  const serious_perc = handle_data_and_calculate_factor({
    data_db,
    data_gh,
    format: false,
  });

  return serious_perc > 0.5;
};

interface BusFactor {
  bus_factor: number | string;
  share: number;
}

export const calculate_bus_factor = (
  data: Record<string, any>[],
  total_contributions: number
): BusFactor => {
  // calculate number of contributors who consist more than 50% of commits
  if (data.length == 1) {
    return {
      bus_factor: 1,
      share: 100,
    };
  }
  const half = total_contributions / 2;
  let sum = 0;
  let i;
  for (i = 0; i < data.length; i++) {
    sum += (data[i] as any)["contributions"];
    if (sum >= half) {
      return {
        bus_factor: i + 1,
        share: Math.round((sum / total_contributions) * 100),
      };
    }
  }

  // at this point we understand that 100 people (or all people in the repo, which is strange) represent less 50% of commits

  return {
    bus_factor: 100,
    share: Math.round((sum / total_contributions) * 100),
  };
};
