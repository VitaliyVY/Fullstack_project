import { useUser } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";

const AdminPosts = () => {
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === "admin";

  const { isPending, error, data } = useQuery({
    queryKey: ["adminPosts"],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/posts?limit=100`,
      );
      return res.data;
    },
    enabled: isAdmin,
  });

  if (!isAdmin) {
    return <div>You are not authorized to view this page.</div>;
  }

  if (isPending) return "Loading...";
  if (error) return "Something went wrong!";

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin - All Posts</h1>
      <div className="grid gap-4">
        {data.posts.map((post) => (
          <div key={post._id} className="border p-4 rounded shadow">
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="text-gray-600">By {post.user?.username}</p>
            <p className="text-sm text-gray-500">Category: {post.category}</p>
            <div className="mt-2">
              <Link to={`/${post.slug}`} className="text-blue-500 mr-4">
                View
              </Link>
              <Link to={`/write/${post.slug}`} className="text-green-500 mr-4">
                Edit
              </Link>
              <button className="text-red-500">Delete</button>{" "}
              {/* Implement delete */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPosts;
