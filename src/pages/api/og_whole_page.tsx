import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const config = {
  runtime: "experimental-edge",
};

export default async function handler(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const org_name = searchParams.get("org_name");
  const repo_name = searchParams.get("repo_name");
  if (!org_name) {
    return new ImageResponse(
      <>Visit with &quot;?org_name=CrowdDotDev&repo_name=crowd.dev&quot;</>,
      {
        width: 1200,
        height: 630,
      }
    );
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
        }}
      >
        <img
          width="256"
          height="256"
          src={`https://github.com/${org_name}.png`}
          style={{
            borderRadius: 128,
          }}
        />
        <p>
          <strong>{` ${org_name}/${repo_name}`}</strong>
        </p>
        <p>
          <span style={{ color: "#e94f2e" }}>analyzemyrepo.com</span>
        </p>
      </div>
    ),
    {
      width: 1200,
      height: 675,
    }
  );
}
