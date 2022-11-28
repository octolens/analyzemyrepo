import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const config = {
  runtime: "experimental-edge",
};

export default async function handler(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  let text = searchParams.get("text");
  if (!text) {
    text = "Community Insights for GitHub repos";
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
        <h1 tw="mb-10 text-gray-900 font-extrabold text-6xl leading-none text-center">
          {text}
        </h1>
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
