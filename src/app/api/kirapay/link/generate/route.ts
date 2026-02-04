import { NextResponse } from "next/server";

const API_BASE_URL = process.env.KIRAPAY_API_BASE_URL || "https://api.kira-pay.com";

const getApiKey = (): string => {
  const apiKey = process.env.KIRAPAY_API;
  if (!apiKey) {
    throw new Error("KIRAPAY_API environment variable is required");
  }
  return apiKey;
};

const getAuthToken = (): string | undefined => {
  return process.env.KIRAPAY_AUTH_TOKEN;
};

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const apiKey = getApiKey();
    const authToken = getAuthToken();

    const response = await fetch(`${API_BASE_URL}/api/link/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create payment link";
    return NextResponse.json({ message }, { status: 500 });
  }
}
