import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";
import { convertTextWithoutDom } from "../../utils/textToPath";

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
    `${host}/api/get_data_url?org_name=${org_name}&repo_name=${repo_name}&type=SeriousFactorChart`,
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

  const svg_string = atob(data.data_url.split(",")[1]);
  const converted_svg_string =
    "data:image/svg+xml;base64," + convertTextWithoutDom(svg_string);

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
        <p
          style={{
            fontSize: "20",
            margin: "0",
            padding: "0",
            color: "#e94f2e",
          }}
        >
          Serious Factor Chart
        </p>
        <p
          style={{
            fontSize: "20",
            maxWidth: "600",
            textAlign: "center",
            margin: "0",
            padding: "0",
          }}
        >{`${org_name}/${repo_name}`}</p>
        <img
          width="880"
          height="220"
          src={converted_svg_string}
          style={{ marginBottom: "10" }}
        />
        <p style={{ marginTop: "0", fontSize: "30", marginRight: "-40" }}>
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
