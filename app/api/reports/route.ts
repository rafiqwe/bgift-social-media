import cloudinary from "@/lib/Cloudinary";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs"; // ensure Node runtime for Cloudinary upload

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const title = formData.get("title")?.toString();
    const details = formData.get("details")?.toString();
    const steps = formData.get("steps")?.toString();
    const severity = formData.get("severity")?.toString();
    const reporterEmail = formData.get("reporterEmail")?.toString() || null;

    // Validate required fields
    if (!title || !details || !steps || !severity) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Handle file uploads (optional)
    const attachments: string[] = [];
    const files = formData.getAll("attachments") as File[];

    for (const file of files) {
      if (!(file instanceof File)) continue;
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // upload to Cloudinary
      const uploadRes = await new Promise<{ secure_url: string }>(
        (resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              { folder: "bgift-bug-reports", resource_type: "image" },
              (err, result) => {
                if (err || !result) reject(err);
                else resolve(result);
              }
            )
            .end(buffer);
        }
      );

      attachments.push(uploadRes.secure_url);
    }

    // Save to database
    const report = await prisma.bugReport.create({
      data: {
        title,
        details,
        steps,
        severity,
        reporterEmail,
        attachments,
      },
    });

    return NextResponse.json(
      { message: "Report submitted", report },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error submitting report:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const reports = await prisma.bugReport.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(reports);
  } catch (error) {
    console.error("❌ Fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch reports" },
      { status: 500 }
    );
  }
}
