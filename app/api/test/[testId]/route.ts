import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  request: NextRequest,
  {
    params,
  }: {
    params: { testId: string };
  },
) => {
  const result = await NextResponse.json({
    title: "test id api",
    testId: params.testId,
  });
  return result;
};
