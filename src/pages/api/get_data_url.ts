import { DataURLType } from "@prisma/client";
import { prisma } from "../../server/db/client";
import { NextApiResponse, NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const client = prisma;
  const { org_name, repo_name, type } = req.query;
  const data = await client.data_url_for_sharing.findUnique({
    where: {
      full_name_type: {
        full_name: `${org_name}/${repo_name}`,
        type: type as DataURLType,
      },
    },
  });

  res.json({ data });
}
