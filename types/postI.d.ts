interface PostI {
  id: string;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  author: {
    id: string;
    name: string;
    username: string;
    image: string | null;
  };
  _count: {
    likes: number;
    comments: number;
  };
  isLikedByUser: boolean;
  isOwnPost: boolean;
  isUpdated: boolean;
}
