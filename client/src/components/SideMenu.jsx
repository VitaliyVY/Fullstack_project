import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Search from "./Search";

const SideMenu = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    const tags = searchParams.getAll("tag");
    setSelectedTags(tags);
  }, [searchParams]);

  const handleFilterChange = (e) => {
    if (searchParams.get("sort") !== e.target.value) {
      setSearchParams({
        ...Object.fromEntries(searchParams.entries()),
        sort: e.target.value,
      });
    }
  };

  const handleTagChange = (tag, checked) => {
    let newTags;
    if (checked) {
      newTags = [...selectedTags, tag];
    } else {
      newTags = selectedTags.filter((t) => t !== tag);
    }
    setSelectedTags(newTags);
    const params = new URLSearchParams(searchParams);
    params.delete("tag");
    newTags.forEach((t) => params.append("tag", t));
    setSearchParams(params);
  };

  const handleCategoryChange = (e) => {
    if (searchParams.get("cat") !== e.target.value) {
      setSearchParams({
        ...Object.fromEntries(searchParams.entries()),
        cat: e.target.value,
      });
    }
  };

  return (
    <div className="px-4 h-max sticky top-8">
      <h1 className="mb-4 text-sm font-medium">Search</h1>
      <Search />
      <h1 className="mt-8 mb-4 text-sm font-medium">Filter</h1>
      <div className="flex flex-col gap-2 text-sm">
        <label htmlFor="" className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="sort"
            onChange={handleFilterChange}
            value="newest"
            className="appearance-none w-4 h-4 border-[1.5px] border-blue-800 cursor-pointer rounded-sm bg-white checked:bg-blue-800"
          />
          Newest
        </label>
        <label htmlFor="" className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="sort"
            onChange={handleFilterChange}
            value="popular"
            className="appearance-none w-4 h-4 border-[1.5px] border-blue-800 cursor-pointer rounded-sm bg-white checked:bg-blue-800"
          />
          Most Popular
        </label>
        <label htmlFor="" className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="sort"
            onChange={handleFilterChange}
            value="trending"
            className="appearance-none w-4 h-4 border-[1.5px] border-blue-800 cursor-pointer rounded-sm bg-white checked:bg-blue-800"
          />
          Trending
        </label>
        <label htmlFor="" className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="sort"
            onChange={handleFilterChange}
            value="oldest"
            className="appearance-none w-4 h-4 border-[1.5px] border-blue-800 cursor-pointer rounded-sm bg-white checked:bg-blue-800"
          />
          Oldest
        </label>
      </div>
      <h1 className="mt-8 mb-4 text-sm font-medium">Categories</h1>
      <div className="flex flex-col gap-2 text-sm">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="cat"
            value="general"
            checked={
              searchParams.get("cat") === "general" || !searchParams.get("cat")
            }
            onChange={handleCategoryChange}
            className="appearance-none w-4 h-4 border-[1.5px] border-blue-800 cursor-pointer rounded-sm bg-white checked:bg-blue-800"
          />
          All
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="cat"
            value="javascript-frontend"
            checked={searchParams.get("cat") === "javascript-frontend"}
            onChange={handleCategoryChange}
            className="appearance-none w-4 h-4 border-[1.5px] border-blue-800 cursor-pointer rounded-sm bg-white checked:bg-blue-800"
          />
          JavaScript / Frontend Development
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="cat"
            value="backend-devops"
            checked={searchParams.get("cat") === "backend-devops"}
            onChange={handleCategoryChange}
            className="appearance-none w-4 h-4 border-[1.5px] border-blue-800 cursor-pointer rounded-sm bg-white checked:bg-blue-800"
          />
          Backend & DevOps
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="cat"
            value="ai-ml"
            checked={searchParams.get("cat") === "ai-ml"}
            onChange={handleCategoryChange}
            className="appearance-none w-4 h-4 border-[1.5px] border-blue-800 cursor-pointer rounded-sm bg-white checked:bg-blue-800"
          />
          Artificial Intelligence & ML
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="cat"
            value="cybersecurity"
            checked={searchParams.get("cat") === "cybersecurity"}
            onChange={handleCategoryChange}
            className="appearance-none w-4 h-4 border-[1.5px] border-blue-800 cursor-pointer rounded-sm bg-white checked:bg-blue-800"
          />
          Cybersecurity
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="cat"
            value="tools-reviews"
            checked={searchParams.get("cat") === "tools-reviews"}
            onChange={handleCategoryChange}
            className="appearance-none w-4 h-4 border-[1.5px] border-blue-800 cursor-pointer rounded-sm bg-white checked:bg-blue-800"
          />
          Tools & Technology Reviews
        </label>
      </div>
      <h1 className="mt-8 mb-4 text-sm font-medium">Tags</h1>
      <div className="flex flex-col gap-2 text-sm">
        {[
          "JavaScript",
          "React",
          "Node.js",
          "Python",
          "AI",
          "Machine Learning",
          "Cybersecurity",
          "DevOps",
          "Tools",
          "Tutorials",
        ].map((tag) => (
          <label key={tag} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedTags.includes(tag)}
              onChange={(e) => handleTagChange(tag, e.target.checked)}
              className="appearance-none w-4 h-4 border-[1.5px] border-blue-800 cursor-pointer rounded-sm bg-white checked:bg-blue-800"
            />
            {tag}
          </label>
        ))}
      </div>
    </div>
  );
};

export default SideMenu;
