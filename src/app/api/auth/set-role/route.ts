// app/api/auth/set-role/route.ts
import { NextRequest, NextResponse } from "next/server";
import admin from "@/lib/firebase-admin";

const ALLOWED_ROLES = ["superadmin", "doctor", "receptionist", "patient", "diagnostic"];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const uid = body.uid;
    const role = body.role?.toLowerCase();

    if (!uid || !role) {
      return NextResponse.json(
        { error: "uid and role are required." },
        { status: 400 }
      );
    }

    if (!ALLOWED_ROLES.includes(role)) {
      return NextResponse.json(
        { error: `Invalid role. Allowed roles: ${ALLOWED_ROLES.join(", ")}` },
        { status: 400 }
      );
    }

    // Set Firebase custom claims
    await admin.auth().setCustomUserClaims(uid, { role });

    return NextResponse.json(
      { success: true, message: `Role '${role}' set for ${uid}.` },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Set-Role API Error:", err);

    return NextResponse.json(
      {
        error: "An unexpected error occurred while setting role.",
      },
      { status: 500 }
    );
  }
}
