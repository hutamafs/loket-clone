import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const order = {
      id: uuidv4(),
      ...body,
      createdAt: new Date().toISOString(),
      status: "pending",
    };

    console.log("Mock Order Saved:", order);

    return NextResponse.json({ success: true, data: order });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Failed to save order" },
      { status: 500 }
    );
  }
}
