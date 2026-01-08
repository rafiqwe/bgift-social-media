import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Build filter
    const filter = {
      isPublished: true,
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } },
      ],
    };

    // Filter by department and semester
    filter.AND = [
      {
        OR: [
          { department: null },
          { department: currentUser.department },
        ],
      },
      {
        OR: [
          { semester: null },
          { semester: currentUser.semester },
        ],
      },
    ];

    if (category && category !== "ALL") {
      filter.category = category;
    }

    // Fetch notices
    const notices = await prisma.notice.findMany({
      where: filter,
      take: limit,
      skip: skip,
      orderBy: [
        { isPinned: "desc" },
        { createdAt: "desc" },
      ],
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
            role: true,
          },
        },
        _count: {
          select: {
            views: true,
            savedBy: true,
          },
        },
        views: {
          where: { userId: currentUser.id },
          select: { id: true },
        },
        savedBy: {
          where: { userId: currentUser.id },
          select: { id: true },
        },
      },
    });

    const total = await prisma.notice.count({ where: filter });

    const formattedNotices = notices.map((notice) => ({
      ...notice,
      isViewed: notice.views.length > 0,
      isSaved: notice.savedBy.length > 0,
    }));

    return NextResponse.json({
      notices: formattedNotices,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching notices:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Create Notice (Admin/Teacher only)
export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user is admin or teacher
    if (!["ADMIN", "TEACHER"].includes(currentUser.role)) {
      return NextResponse.json(
        { error: "Only admins and teachers can create notices" },
        { status: 403 }
      );
    }

    const {
      title,
      content,
      category,
      priority,
      department,
      semester,
      attachments,
      isPinned,
      expiresAt,
    } = await req.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const notice = await prisma.notice.create({
      data: {
        title,
        content,
        category: category || "GENERAL",
        priority: priority || "MEDIUM",
        authorId: currentUser.id,
        department: department || null,
        semester: semester || null,
        attachments: attachments || [],
        isPinned: isPinned || false,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json(notice, { status: 201 });
  } catch (error) {
    console.error("Error creating notice:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}