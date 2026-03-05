import { useAuth, useUser } from "@clerk/clerk-react";
import "react-quill-new/dist/quill.snow.css";
import ReactQuill from "react-quill-new";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Upload from "../components/Upload";

const Write = () => {
  const { isLoaded, isSignedIn } = useUser();
  const [value, setValue] = useState("");
  const [cover, setCover] = useState("");
  const [img, setImg] = useState("");
  const [video, setVideo] = useState("");
  const [progress, setProgress] = useState(0);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("general");
  const [desc, setDesc] = useState("");
  const [tags, setTags] = useState("");

  const { slug } = useParams();
  const isEdit = !!slug;

  const { getToken } = useAuth();

  const { data: postData, isLoading: postLoading } = useQuery({
    queryKey: ["post", slug],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/posts/${slug}`,
      );
      return res.data;
    },
    enabled: isEdit,
  });

  useEffect(() => {
    if (postData) {
      setValue(postData.content || "");
      setCover({ filePath: postData.img });
      setTitle(postData.title || "");
      setCategory(postData.category || "general");
      setDesc(postData.desc || "");
      setTags(postData.tags ? postData.tags.join(", ") : "");
    }
  }, [postData]);

  useEffect(() => {
    img && setValue((prev) => prev + `<p><image src="${img.url}"/></p>`);
  }, [img]);

  useEffect(() => {
    video &&
      setValue(
        (prev) => prev + `<p><iframe class="ql-video" src="${video.url}"/></p>`,
      );
  }, [video]);

  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async (newPost) => {
      const token = await getToken();
      if (isEdit) {
        return axios.put(
          `${import.meta.env.VITE_API_URL}/posts/${postData._id}`,
          newPost,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
      } else {
        return axios.post(`${import.meta.env.VITE_API_URL}/posts`, newPost, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    },
    onSuccess: (res) => {
      toast.success(`Post has been ${isEdit ? "updated" : "created"}`);
      navigate(`/${res.data.slug}`);
    },
  });

  if (!isLoaded) {
    return <div className="">Loading...</div>;
  }

  if (isLoaded && !isSignedIn) {
    return <div className="">You should login!</div>;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const tagsArray = tags ? tags.split(",").map((tag) => tag.trim()) : [];

    const data = {
      img: cover.filePath || "",
      title,
      category,
      tags: tagsArray,
      desc,
      content: value,
    };

    console.log(data);

    mutation.mutate(data);
  };

  return (
    <div className="h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] flex flex-col gap-6">
      <h1 className="text-cl font-light">
        {isEdit ? "Edit Post" : "Create a New Post"}
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 flex-1 mb-6">
        <Upload type="image" setProgress={setProgress} setData={setCover}>
          <button className="w-max p-2 shadow-md rounded-xl text-sm text-gray-500 bg-white">
            Add a cover image
          </button>
        </Upload>
        <input
          className="text-4xl font-semibold bg-transparent outline-none"
          type="text"
          placeholder="My Awesome Story"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="flex items-center gap-4">
          <label htmlFor="" className="text-sm">
            Choose a category:
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-2 rounded-xl bg-white shadow-md"
          >
            <option value="general">All</option>
            <option value="javascript-frontend">
              JavaScript / Frontend Development
            </option>
            <option value="backend-devops">Backend & DevOps</option>
            <option value="ai-ml">Artificial Intelligence & ML</option>
            <option value="cybersecurity">Cybersecurity</option>
            <option value="tools-reviews">Tools & Technology Reviews</option>
          </select>
        </div>
        <div className="flex items-center gap-4">
          <label htmlFor="" className="text-sm">
            Add tags (comma separated):
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="javascript, react, tutorial"
            className="p-2 rounded-xl bg-white shadow-md flex-1"
          />
        </div>
        <textarea
          className="p-4 rounded-xl bg-white shadow-md"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="A Short Description"
        />
        <div className="flex flex-1 ">
          <div className="flex flex-col gap-2 mr-2">
            <Upload type="image" setProgress={setProgress} setData={setImg}>
              🌆
            </Upload>
            <Upload type="video" setProgress={setProgress} setData={setVideo}>
              ▶️
            </Upload>
          </div>
          <ReactQuill
            theme="snow"
            className="flex-1 rounded-xl bg-white shadow-md"
            value={value}
            onChange={setValue}
            readOnly={0 < progress && progress < 100}
          />
        </div>
        <button
          disabled={mutation.isPending || (0 < progress && progress < 100)}
          className="bg-blue-800 text-white font-medium rounded-xl mt-4 p-2 w-36 disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          {mutation.isPending ? "Loading..." : "Send"}
        </button>
        {"Progress:" + progress}
        {/* {mutation.isError && <span>{mutation.error.message}</span>} */}
      </form>
    </div>
  );
};

export default Write;
