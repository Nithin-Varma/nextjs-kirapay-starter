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

const buildAuthHeaders = () => {
  const apiKey = getApiKey();
  const authToken = getAuthToken();
  return {
    "Content-Type": "application/json",
    "x-api-key": apiKey,
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
  };
};

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const response = await fetch(`${API_BASE_URL}/api/webhooks`, {
      method: "POST",
      headers: buildAuthHeaders(),
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save webhook";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/webhooks`, {
      method: "GET",
      headers: buildAuthHeaders()
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch webhook";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/webhooks`, {
      method: "DELETE",
      headers: buildAuthHeaders()
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete webhook";
    return NextResponse.json({ message }, { status: 500 });
  }
}
