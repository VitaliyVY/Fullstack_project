import { useParams, useSearchParams, Link } from "react-router-dom";
import PostListItem from "../components/PostListItem";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "../components/Image";

const AuthorPage = () => {
  const { username } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page")) || 1;

  const {
    isPending: userPending,
    error: userError,
    data: userData,
  } = useQuery({
    queryKey: ["user", username],
    queryFn: () =>
      axios
        .get(`${import.meta.env.VITE_API_URL}/users/${username}`)
        .then((res) => res.data),
  });

  const {
    isPending: postsPending,
    error: postsError,
    data: postsData,
  } = useQuery({
    queryKey: ["posts", "author", username, page],
    queryFn: () =>
      axios
        .get(
          `${import.meta.env.VITE_API_URL}/posts?author=${username}&page=${page}`,
        )
        .then((res) => res.data),
  });

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage });
  };

  if (userPending || postsPending) return "Loading...";
  if (userError || postsError) return "Something went wrong!";

  return (
    <div className="flex flex-col gap-8">
      {/* Breadcrumb */}
      <div className="flex gap-4">
        <Link to="/">Home</Link>
        <span>•</span>
        <span className="text-blue-800">
          {userData.firstName && userData.lastName
            ? `${userData.firstName} ${userData.lastName}`
            : userData.username}
        </span>
      </div>

      {/* Author Info */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          {userData.img && (
            <Image
              src={userData.img}
              className="w-16 h-16 rounded-full object-cover"
              w="64"
              h="64"
            />
          )}
          <div>
            <h1 className="text-2xl md:text-4xl font-bold">
              {userData.firstName && userData.lastName
                ? `${userData.firstName} ${userData.lastName}`
                : userData.username}
            </h1>
            {userData.bio && (
              <p className="text-gray-600 mt-2">{userData.bio}</p>
            )}
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="flex flex-col gap-8">
        <h2 className="text-xl font-semibold">
          Articles by{" "}
          {userData.firstName && userData.lastName
            ? `${userData.firstName} ${userData.lastName}`
            : userData.username}
        </h2>
        {postsData.posts.map((post) => (
          <PostListItem key={post._id} post={post} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-4 mt-8">
        {page > 1 && (
          <button
            onClick={() => handlePageChange(page - 1)}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Previous
          </button>
        )}
        <span>Page {page}</span>
        {postsData.hasMore && (
          <button
            onClick={() => handlePageChange(page + 1)}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default AuthorPage;
