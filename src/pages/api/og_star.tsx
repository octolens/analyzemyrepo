import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const config = {
  runtime: "experimental-edge",
};

export default async function handler(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const org_name = searchParams.get("org_name");
  const repo_name = searchParams.get("repo_name");

  const host = process.env.NEXT_PUBLIC_GLOBAL_URL
    ? `https://${process.env.NEXT_PUBLIC_GLOBAL_URL}`
    : "http://localhost:3000";

  const request = await fetch(
    `${host}/api/get_data_url?org_name=${org_name}&repo_name=${repo_name}&type=StarChart`,
    {
      method: "GET",
    }
  );

  const { data } = await request.json();

  if (!data.data_url) {
    return new ImageResponse(<>Visit repoanalyzer.com</>, {
      width: 1200,
      height: 675,
    });
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          fontSize: 60,
          background: "#f6f6f6",
          width: "100%",
          height: "100%",
          paddingTop: 50,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "monospace",
        }}
      >
        <img width="500" height="430" src={data.data_url} />
        <p style={{ marginTop: "0" }}>
          <span style={{ color: "#e94f2e" }}>repoanalyzer.com</span>
        </p>
      </div>
    ),
    {
      width: 1200,
      height: 675,
    }
  );
}
