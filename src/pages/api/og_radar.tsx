import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const config = {
  runtime: "experimental-edge",
};

export default async function handler(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const org_name = searchParams.get("org_name");
  const repo_name = searchParams.get("repo_name");

  const host = process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : "http://localhost:3000";

  const request = await fetch(
    `${host}/api/get_data_url?org_name=${org_name}&repo_name=${repo_name}&type=Radar`,
    {
      method: "GET",
    }
  );

  const { data } = await request.json();

  if (!data.data_url) {
    return new ImageResponse(<>Visit repoanalyzer.com</>, {
      width: 1000,
      height: 1000,
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
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p style={{ fontSize: "30", marginRight: "-70", marginBottom: "65" }}>
            Contribution
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <p
              style={{ fontSize: "30", marginBottom: "-20", marginLeft: "30" }}
            >
              Adoption
            </p>
            <img width="600" height="530" src={data.data_url} />
            <p style={{ fontSize: "30", marginTop: "-50", marginLeft: "20" }}>
              Community
            </p>
          </div>
          <p style={{ fontSize: "30", marginLeft: "-40", marginBottom: "65" }}>
            Diversity
          </p>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p
            style={{
              fontSize: "40",
              margin: "0",
              maxWidth: "600",
              textAlign: "center",
            }}
          >{`${org_name}/${repo_name}`}</p>
          <p>
            <span style={{ color: "#e94f2e" }}>repoanalyzer.com</span>
          </p>
        </div>
      </div>
    ),
    {
      width: 1000,
      height: 1000,
    }
  );
}
