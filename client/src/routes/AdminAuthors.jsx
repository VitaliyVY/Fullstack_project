import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";
import Image from "../components/Image";

const getDisplayName = (author) => {
  if (author?.firstName && author?.lastName) {
    return `${author.firstName} ${author.lastName}`;
  }
  return author?.username || "Unknown author";
};

const AdminAuthors = () => {
  const { isPending, error, data } = useQuery({
    queryKey: ["adminAuthors"],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/admin/authors`,
      );
      return response.data;
    },
  });

  if (isPending) return "Loading...";
  if (error) return "Something went wrong!";

  return (
    <div className="flex flex-col gap-6 mt-4">
      <h1 className="text-2xl font-bold">Authors</h1>
      <p className="text-gray-600">
        Select an author to open their public profile page.
      </p>

      {data.length === 0 ? (
        <p className="text-gray-500">No authors found.</p>
      ) : (
        <div className="grid gap-4">
          {data.map((author) => (
            <div
              key={author._id}
              className="rounded-2xl border border-gray-200 p-4 bg-white flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 min-w-0">
                {author.img ? (
                  <Image
                    src={author.img}
                    className="w-12 h-12 rounded-full object-cover"
                    w="48"
                    h="48"
                    alt={getDisplayName(author)}
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-700">
                    {getDisplayName(author).slice(0, 1).toUpperCase()}
                  </div>
                )}

                <div className="min-w-0">
                  <p className="font-semibold truncate">{getDisplayName(author)}</p>
                  <p className="text-sm text-gray-500 truncate">@{author.username}</p>
                  <p className="text-sm text-blue-700">
                    Published posts: {author.postCount || 0}
                  </p>
                </div>
              </div>

              <Link
                to={`/authors/${author.username}`}
                className="px-4 py-2 rounded-xl border border-blue-700 text-blue-700 text-sm font-medium"
              >
                View profile
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminAuthors;
