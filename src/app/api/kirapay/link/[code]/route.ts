import { NextResponse } from "next/server";

const API_BASE_URL = process.env.KIRAPAY_API_BASE_URL || "https://api.kira-pay.com";

export async function GET(
  _request: Request,
  { params }: { params: { code: string } }
) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/link/${params.code}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch link";
    return NextResponse.json({ message }, { status: 500 });
  }
}
