import { Link } from "react-router-dom";
import Search from "./Search";

const MainCategories = () => {
  return (
    <div className="hidden md:flex bg-white rounded-3xl xl:rounded-full p-4 shadow-lg items-center justify-center gap-4">
      {/* links */}
      <div className="flex-1 flex items-center justify-between flex-nowrap overflow-x-auto">
        <Link
          to="/categories/general"
          className="bg-blue-800 text-white rounded-full px-2 py-1 text-xs md:text-sm whitespace-nowrap"
        >
          All Posts
        </Link>
        <Link
          to="/categories/javascript-frontend"
          className="hover:bg-blue-50 rounded-full px-2 py-1 text-xs md:text-sm whitespace-nowrap"
        >
          JavaScript / Frontend
        </Link>
        <Link
          to="/categories/backend-devops"
          className="hover:bg-blue-50 rounded-full px-2 py-1 text-xs md:text-sm whitespace-nowrap"
        >
          Backend & DevOps
        </Link>
        <Link
          to="/categories/ai-ml"
          className="hover:bg-blue-50 rounded-full px-2 py-1 text-xs md:text-sm whitespace-nowrap"
        >
          AI & ML
        </Link>
        <Link
          to="/categories/cybersecurity"
          className="hover:bg-blue-50 rounded-full px-2 py-1 text-xs md:text-sm whitespace-nowrap"
        >
          Cybersecurity
        </Link>
        <Link
          to="/categories/tools-reviews"
          className="hover:bg-blue-50 rounded-full px-2 py-1 text-xs md:text-sm whitespace-nowrap"
        >
          Tools & Reviews
        </Link>
      </div>
      <span className="text-xl font-medium">|</span>
      {/* search */}
      <Search />
    </div>
  );
};

export default MainCategories;
