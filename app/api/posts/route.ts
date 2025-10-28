// src/app/api/posts/route.ts
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import cloudinary from "cloudinary";
import { AddImageOnCloudinary } from "@/lib/AddImageOnCloudinary";

// ✅ Cloudinary response type
interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  [key: string]: any;
}

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const formData = await req.formData();
    const content = formData.get("content") as string;
    const postImage = formData.get("postImage") as File | null;

    if (!content?.trim())
      return NextResponse.json(
        { error: "Post content is required" },
        { status: 400 }
      );

    let imageUrl: string | null = null;

    if (postImage) {
      const uploadResult = await new Promise<cloudinary.UploadApiResponse>(
        (resolve, reject) => {
          const uploadStream = cloudinary.v2.uploader.upload_stream(
            { folder: "bgift-image" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result as cloudinary.UploadApiResponse);
            }
          );
          uploadStream.end(postImage);
        }
      );

      imageUrl = uploadResult.secure_url;
    }

    const post = await prisma.post.create({
      data: { content, imageUrl, authorId: user.id },
      include: {
        author: {
          select: { id: true, name: true, username: true, image: true },
        },
        _count: { select: { likes: true, comments: true } },
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("❌ Error creating post:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// GET user posts
export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session?.user.email as string },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get query params for pagination
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Optional: filter by userId if provided
    const userId = searchParams.get("userId") as string | null;

    const posts = await prisma.post.findMany({
      where: userId ? { authorId: user.id } : undefined,
      take: limit,
      skip: skip,
      orderBy: {
        createdAt: "desc", // newest first
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
        comments: {
          take: 3, // Show only first 3 comments
          orderBy: {
            createdAt: "desc",
          },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true,
              },
            },
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    // Get total count for pagination
    const totalPosts = await prisma.post.count({
      where: userId ? { authorId: user.id } : undefined,
    });

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total: totalPosts,
        totalPages: Math.ceil(totalPosts / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// UPDATE post
export async function PUT(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session?.user.email as string },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // const body: { content: string; postId: string } = await req.json();
    const formData = await req.formData();
    const content = formData.get("content") as string;
    const postId = formData.get("postId") as string;
    const updateImage = formData.get("image") as File | null;

    // const { content, postId } = body;
    let updatedImageUrl: string | null = null;

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    if (!content || content.trim() === "") {
      return NextResponse.json(
        { error: "Post content is required" },
        { status: 400 }
      );
    }

    if (updateImage && updateImage instanceof File) {
      // // Convert browser File to ArrayBuffer
      // const bytes = await updateImage.arrayBuffer();
      // const buffer = Buffer.from(bytes);

      // const uploadResult = await new Promise<cloudinary.UploadApiResponse>(
      //   (resolve, reject) => {
      //     const uploadStream = cloudinary.v2.uploader.upload_stream(
      //       { folder: "bgift-image" },
      //       (error, result) => {
      //         if (error) reject(error);
      //         else resolve(result as cloudinary.UploadApiResponse);
      //       }
      //     );

      //     uploadStream.end(buffer); // ✅ send Buffer
      //   }
      // );

      // updatedImageUrl = uploadResult.secure_url;

      updatedImageUrl = await AddImageOnCloudinary(updateImage);
    }

    // Check if post exists and user is the author
    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (existingPost.authorId !== user.id) {
      return NextResponse.json(
        { error: "You can only edit your own posts" },
        { status: 403 }
      );
    }

    // Update the post
    const updatedPost = await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        content,
        imageUrl: updatedImageUrl || existingPost.imageUrl, // Keep existing image if not provided
        isUpdated: true,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE post
export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session?.user.email as string },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId") as string | null;

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    // Check if post exists and user is the author
    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (existingPost.authorId !== user.id) {
      return NextResponse.json(
        { error: "You can only delete your own posts" },
        { status: 403 }
      );
    }

    // Delete the post (likes and comments will cascade delete)
    await prisma.post.delete({
      where: { id: postId },
    });

    return NextResponse.json(
      { message: "Post deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
