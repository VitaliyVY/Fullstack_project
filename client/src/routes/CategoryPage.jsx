import { useParams, useSearchParams, Link } from "react-router-dom";
import PostListItem from "../components/PostListItem";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const CategoryPage = () => {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page")) || 1;

  const { isPending, error, data } = useQuery({
    queryKey: ["posts", slug, page],
    queryFn: () =>
      axios
        .get(
          `${import.meta.env.VITE_API_URL}/posts${slug === "general" ? "" : `?cat=${slug}`}&page=${page}`,
        )
        .then((res) => res.data),
  });

  const getCategoryInfo = (cat) => {
    const categories = {
      general: { name: "All", desc: "All articles from our blog." },
      "javascript-frontend": {
        name: "JavaScript / Frontend Development",
        desc: "Articles about JavaScript, React, Vue, and frontend technologies.",
      },
      "backend-devops": {
        name: "Backend & DevOps",
        desc: "Guides on backend development, servers, databases, and DevOps practices.",
      },
      "ai-ml": {
        name: "Artificial Intelligence & ML",
        desc: "Explore AI, machine learning, and data science topics.",
      },
      cybersecurity: {
        name: "Cybersecurity",
        desc: "Learn about security, hacking, and protecting systems.",
      },
      "tools-reviews": {
        name: "Tools & Technology Reviews",
        desc: "Reviews and comparisons of development tools and technologies.",
      },
    };
    return categories[cat] || { name: cat, desc: "Category description." };
  };

  const categoryInfo = getCategoryInfo(slug);

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
        <span className="text-blue-800">{categoryInfo.name}</span>
      </div>

      {/* Category Info */}
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl md:text-4xl font-bold">{categoryInfo.name}</h1>
        <p className="text-lg text-gray-600">{categoryInfo.desc}</p>
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

export default CategoryPage;
