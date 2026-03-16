import { Link, useParams } from "react-router-dom";
import Image from "../components/Image";
import PostMenuActions from "../components/PostMenuActions";
import Search from "../components/Search";
import Comments from "../components/Comments";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { format } from "timeago.js";

const fetchPost = async (slug) => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts/${slug}`);
  return res.data;
};

const getCategoryDisplay = (cat) => {
  const categories = {
    general: "All",
    "javascript-frontend": "JavaScript / Frontend Development",
    "backend-devops": "Backend & DevOps",
    "ai-ml": "Artificial Intelligence & ML",
    cybersecurity: "Cybersecurity",
    "tools-reviews": "Tools & Technology Reviews",
  };
  return categories[cat] || cat;
};

const getAuthorDisplayName = (user) => {
  if (user?.firstName && user?.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  return user?.username || "Unknown author";
};

const getShortBio = (bio) => {
  const normalized = String(bio || "").replace(/\s+/g, " ").trim();
  if (!normalized) {
    return "Автор ще не додав коротку біографію.";
  }
  return normalized;
};

const formatDate = (dateValue) => {
  if (!dateValue) {
    return "-";
  }

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("uk-UA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

const SinglePostPage = () => {
  const { slug } = useParams();

  const { isPending, error, data } = useQuery({
    queryKey: ["post", slug],
    queryFn: () => fetchPost(slug),
  });

  if (isPending) return "loading...";
  if (error) return "Something went wrong!" + error.message;
  if (!data) return "Post not found!";

  const authorName = getAuthorDisplayName(data.user);
  const authorBio = getShortBio(data.user?.bio);

  return (
    <div className="flex flex-col gap-8">
      {/* detail */}
      <div className="flex gap-8 min-w-0">
        <div className="lg:w-3/5 min-w-0 flex flex-col gap-8">
          <h1 className="text-xl md:text-3xl xl:text-4xl 2xl:text-5xl font-semibold break-words [overflow-wrap:anywhere]">
            {data.title}
          </h1>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <span>Written by</span>
            {data.user?.username ? (
              <Link
                className="text-blue-800"
                to={`/authors/${data.user.username}`}
              >
                {authorName}
              </Link>
            ) : (
              <span className="text-blue-800">{authorName}</span>
            )}
            <span>on</span>
            <Link className="text-blue-800" to={`/categories/${data.category}`}>
              {getCategoryDisplay(data.category)}
            </Link>
            <span>{format(data.createdAt)}</span>
          </div>
          <p className="text-gray-500 font-medium break-words [overflow-wrap:anywhere]">
            {data.desc}
          </p>
        </div>
        {data.img && (
          <div className="hidden lg:block w-2/5">
            <Image src={data.img} w="600" className="rounded-2xl" />
          </div>
        )}
      </div>
      {/* content */}
      <div className="flex flex-col md:flex-row gap-12 justify-between">
        {/* text */}
        <div
          className="lg:text-lg min-w-0 flex-1 text-justify break-words [overflow-wrap:anywhere] [&_*]:max-w-full [&_*]:break-words [&_*]:[overflow-wrap:anywhere] [&_img]:h-auto [&_iframe]:w-full"
          dangerouslySetInnerHTML={{ __html: data.content }}
        />
        {/* menu */}
        <div className="px-4 h-max sticky top-8">
          <h1 className="mb-4 text-sm font-medium">Author</h1>
          <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              {data.user?.img ? (
                <Image
                  src={data.user.img}
                  className="w-12 h-12 rounded-full object-cover"
                  w="48"
                  h="48"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-700">
                  {authorName.slice(0, 1).toUpperCase()}
                </div>
              )}
              {data.user?.username ? (
                <Link
                  className="text-blue-800 font-medium"
                  to={`/authors/${data.user.username}`}
                >
                  {authorName}
                </Link>
              ) : (
                <span className="text-blue-800 font-medium">{authorName}</span>
              )}
            </div>
            <p className="text-sm text-gray-600">{authorBio}</p>
            <div className="flex flex-col gap-1 text-sm text-gray-500">
              <span>Дата публікації: {formatDate(data.createdAt)}</span>
              <span>Останнє оновлення: {formatDate(data.updatedAt)}</span>
            </div>
            {(data.user?.linkedinUrl || data.user?.githubUrl) && (
              <div className="flex items-center gap-3 text-sm">
                {data.user?.linkedinUrl && (
                  <a
                    href={data.user.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="underline text-blue-700"
                  >
                    LinkedIn
                  </a>
                )}
                {data.user?.githubUrl && (
                  <a
                    href={data.user.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="underline text-blue-700"
                  >
                    GitHub
                  </a>
                )}
              </div>
            )}
          </div>
          <PostMenuActions post={data} />
          <h1 className="mt-8 mb-4 text-sm font-medium">Categories</h1>
          <div className="flex flex-col gap-2 text-sm">
            <Link className="underline" to="/categories/general">
              All
            </Link>
            <Link className="underline" to="/categories/javascript-frontend">
              JavaScript / Frontend Development
            </Link>
            <Link className="underline" to="/categories/backend-devops">
              Backend & DevOps
            </Link>
            <Link className="underline" to="/categories/ai-ml">
              Artificial Intelligence & ML
            </Link>
            <Link className="underline" to="/categories/cybersecurity">
              Cybersecurity
            </Link>
            <Link className="underline" to="/categories/tools-reviews">
              Tools & Technology Reviews
            </Link>
          </div>
          {data.tags && data.tags.length > 0 && (
            <>
              <h1 className="mt-8 mb-4 text-sm font-medium">Tags</h1>
              <div className="flex flex-wrap gap-2 text-sm">
                {data.tags.map((tag) => (
                  <Link
                    key={tag}
                    className="underline text-blue-600 hover:text-blue-800"
                    to={`/tags/${tag}`}
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </>
          )}
          <h1 className="mt-8 mb-4 text-sm font-medium">Search</h1>
          <Search />
        </div>
      </div>
      <Comments postId={data._id} />
    </div>
  );
};

export default SinglePostPage;
