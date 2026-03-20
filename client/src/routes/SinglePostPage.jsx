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
    return "Author has not added a short bio yet.";
  }
  return normalized;
};

const getAuthorSummary = (user) => {
  const parts = [];
  if (user?.jobTitle) {
    parts.push(user.jobTitle);
  }
  if (typeof user?.yearsExperience === "number") {
    parts.push(`${user.yearsExperience}+ years of experience`);
  }
  return parts.join(", ");
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
  const authorSummary = getAuthorSummary(data.user);
  const authorIntro = authorSummary
    ? `Author: ${authorName} - ${authorSummary}.`
    : `Author: ${authorName}.`;
  const socialLinks = [
    { label: "LinkedIn", url: data.user?.linkedinUrl },
    { label: "GitHub", url: data.user?.githubUrl },
    { label: "X", url: data.user?.twitterUrl },
    { label: "Website", url: data.user?.websiteUrl },
  ].filter((item) => item.url);

  return (
    <div className="flex flex-col gap-8">
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

      <div className="flex flex-col md:flex-row gap-12 items-start">
        <div
          className="lg:text-lg min-w-0 flex-1 text-justify break-words [&_*]:max-w-full [&_*]:break-words [&_img]:h-auto [&_iframe]:w-full"
          dangerouslySetInnerHTML={{ __html: data.content }}
        />

        <div className="w-full md:w-80 lg:w-96 md:flex-shrink-0 md:sticky md:top-8 px-4">
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
            <p className="text-sm text-gray-700">{authorIntro}</p>
            <p className="text-sm text-gray-600">{authorBio}</p>
            {data.user?.username && (
              <Link
                to={`/authors/${data.user.username}`}
                className="text-sm underline text-blue-700"
              >
                Author profile
              </Link>
            )}
            <div className="flex flex-col gap-1 text-sm text-gray-500">
              <span>Published: {formatDate(data.createdAt)}</span>
              <span>Updated: {formatDate(data.updatedAt)}</span>
            </div>
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-3 text-sm">
                {socialLinks.map((item) => (
                  <a
                    key={item.label}
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="underline text-blue-700"
                  >
                    {item.label}
                  </a>
                ))}
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
