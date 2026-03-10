import { useParams, useSearchParams, Link } from "react-router-dom";
import PostListItem from "../components/PostListItem";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const TagPage = () => {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page")) || 1;

  const { isPending, error, data } = useQuery({
    queryKey: ["posts", "tag", slug, page],
    queryFn: () =>
      axios
        .get(`${import.meta.env.VITE_API_URL}/posts?tag=${slug}&page=${page}`)
        .then((res) => res.data),
  });

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage });
  };

  if (isPending) return "Loading...";
  if (error) return "Something went wrong!";

  return (
    <div className="flex flex-col gap-8">
      {/* Breadcrumb */}
      <div className="flex gap-4">
        <Link to="/">Home</Link>
        <span>•</span>
        <span className="text-blue-800">Tag: {slug}</span>
      </div>

      {/* Tag Info */}
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl md:text-4xl font-bold">
          Articles tagged with &quot;{slug}&quot;
        </h1>
      </div>

      {/* Posts */}
      <div className="flex flex-col gap-8">
        {data.posts.map((post) => (
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
        {data.hasMore && (
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

export default TagPage;
