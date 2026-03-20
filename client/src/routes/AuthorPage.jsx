import { useEffect, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import PostListItem from "../components/PostListItem";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { toast } from "react-toastify";
import Image from "../components/Image";
import Upload from "../components/Upload";

const getDisplayName = (user) => {
  if (user?.firstName && user?.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  return user?.username || "Unknown author";
};

const hasFullName = (profile) =>
  Boolean(String(profile?.firstName || "").trim() && String(profile?.lastName || "").trim());

const toListInputValue = (value) => {
  if (!Array.isArray(value) || value.length === 0) {
    return "";
  }
  return value.join(", ");
};

const parseListInput = (value) => {
  const source = String(value || "").split(/[\n,]/);
  const seen = new Set();
  const items = [];

  for (const raw of source) {
    const item = raw.trim();
    if (!item || seen.has(item)) continue;
    seen.add(item);
    items.push(item);
  }

  return items;
};

const createInitialForm = (user) => ({
  firstName: user?.firstName || "",
  lastName: user?.lastName || "",
  bio: user?.bio || "",
  fullBio: user?.fullBio || "",
  img: user?.img || "",
  linkedinUrl: user?.linkedinUrl || "",
  githubUrl: user?.githubUrl || "",
  twitterUrl: user?.twitterUrl || "",
  websiteUrl: user?.websiteUrl || "",
  jobTitle: user?.jobTitle || "",
  yearsExperience:
    typeof user?.yearsExperience === "number" ? String(user.yearsExperience) : "",
  alumniOf: user?.alumniOf || "",
  expertiseInput: toListInputValue(user?.expertise),
  awardsInput: toListInputValue(user?.awards),
});

const AuthorPage = () => {
  const { username } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(createInitialForm(null));
  const [uploadProgress, setUploadProgress] = useState(0);
  const page = parseInt(searchParams.get("page"), 10) || 1;

  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  const { data: currentUserData } = useQuery({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      const token = await getToken();
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    enabled: isLoaded && Boolean(user),
    retry: false,
  });

  const currentUsername = currentUserData?.username || user?.username || "";
  const isOwnProfile = Boolean(currentUsername && currentUsername === username);

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

  useEffect(() => {
    setFormData(createInitialForm(userData));
  }, [userData]);

  const updateProfileMutation = useMutation({
    mutationFn: async (payload) => {
      const token = await getToken();
      return axios.patch(`${import.meta.env.VITE_API_URL}/users/profile`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: (response) => {
      const updated = response.data;
      queryClient.setQueryData(["user", username], updated);
      queryClient.setQueryData(["currentUserProfile"], updated);
      queryClient.invalidateQueries({ queryKey: ["posts", "author", username] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setUploadProgress(0);
      setIsEditing(false);
      toast.success("Profile updated");
    },
    onError: (error) => {
      const message =
        error?.response?.data || error?.message || "Failed to update profile";
      toast.error(message);
    },
  });

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = (event) => {
    event.preventDefault();
    const firstName = formData.firstName.trim();
    const lastName = formData.lastName.trim();

    if (!firstName || !lastName) {
      toast.error("First name and last name are required");
      return;
    }

    const { expertiseInput, awardsInput, yearsExperience, ...rest } = formData;

    updateProfileMutation.mutate({
      ...rest,
      firstName,
      lastName,
      yearsExperience: yearsExperience.trim(),
      expertise: parseListInput(expertiseInput),
      awards: parseListInput(awardsInput),
    });
  };

  const handleAvatarUploadSuccess = (uploadResult) => {
    const uploadedPath = uploadResult?.filePath || uploadResult?.url || "";

    if (!uploadedPath) {
      toast.error("Avatar upload failed");
      return;
    }

    setFormData((prev) => ({ ...prev, img: uploadedPath }));
    toast.success("Avatar uploaded");
  };

  const handleCancelEdit = () => {
    setFormData(createInitialForm(userData));
    setUploadProgress(0);
    setIsEditing(false);
  };

  if (userPending || postsPending) return "Loading...";
  if (userError || postsError) return "Something went wrong!";

  const displayName = getDisplayName(userData);
  const postCount = Number.isFinite(userData?.postCount)
    ? userData.postCount
    : postsData?.totalPosts || 0;
  const isUploadingAvatar = uploadProgress > 0 && uploadProgress < 100;
  const profileHasFullName = hasFullName(userData);
  const formHasFullName = hasFullName(formData);
  const fullBio = String(userData?.fullBio || userData?.bio || "").trim();
  const shortBio = String(userData?.bio || "").trim();

  const socialLinks = [
    { label: "LinkedIn", url: userData?.linkedinUrl },
    { label: "GitHub", url: userData?.githubUrl },
    { label: "X", url: userData?.twitterUrl },
    { label: "Website", url: userData?.websiteUrl },
  ].filter((item) => item.url);

  const expertise = Array.isArray(userData?.expertise) ? userData.expertise : [];
  const awards = Array.isArray(userData?.awards) ? userData.awards : [];
  const headlineParts = [];
  if (userData?.jobTitle) {
    headlineParts.push(userData.jobTitle);
  }
  if (typeof userData?.yearsExperience === "number") {
    headlineParts.push(`${userData.yearsExperience}+ years experience`);
  }
  const authorHeadline = headlineParts.join(" | ");

  return (
    <div className="flex flex-col gap-8">
      <div className="flex gap-3 text-sm text-gray-600">
        <Link to="/">Home</Link>
        <span>/</span>
        <span className="text-blue-800">{displayName}</span>
      </div>

      <div className="flex flex-col gap-5 rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            {userData.img ? (
              <Image
                src={userData.img}
                className="w-16 h-16 rounded-full object-cover"
                w="64"
                h="64"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-lg font-semibold text-gray-700">
                {displayName.slice(0, 1).toUpperCase()}
              </div>
            )}
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl md:text-4xl font-bold">{displayName}</h1>
              <p className="text-gray-500">@{userData.username}</p>
              {authorHeadline && <p className="text-sm text-gray-600">{authorHeadline}</p>}
            </div>
          </div>
          {isOwnProfile && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 rounded-xl bg-blue-700 text-white text-sm font-medium"
            >
              Edit profile
            </button>
          )}
        </div>

        {isOwnProfile && !profileHasFullName && (
          <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Add first name and last name to meet the lab requirement for a full author name.
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
            Published posts: {postCount}
          </span>
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

        {shortBio && (
          <p className="text-sm text-gray-700">
            <span className="font-medium text-gray-900">Short bio:</span> {shortBio}
          </p>
        )}

        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">Full biography</h2>
          <p className="text-gray-700 whitespace-pre-wrap">
            {fullBio || "Author has not added a full biography yet."}
          </p>
        </div>

        {expertise.length > 0 && (
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold">Expertise</h2>
            <div className="flex flex-wrap gap-2 text-sm">
              {expertise.map((topic) => (
                <span
                  key={topic}
                  className="px-3 py-1 rounded-full bg-slate-100 text-slate-700"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}

        {awards.length > 0 && (
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold">Awards</h2>
            <ul className="list-disc pl-5 text-gray-700">
              {awards.map((award) => (
                <li key={award}>{award}</li>
              ))}
            </ul>
          </div>
        )}

        {isOwnProfile && isEditing && (
          <form
            onSubmit={handleProfileSubmit}
            className="mt-2 rounded-xl bg-gray-50 border border-gray-200 p-4 flex flex-col gap-3"
          >
            <h2 className="text-lg font-semibold">Edit profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                name="firstName"
                placeholder="First name"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className="px-3 py-2 rounded-lg border border-gray-300"
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last name"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className="px-3 py-2 rounded-lg border border-gray-300"
              />
            </div>
            <p className="text-xs text-gray-600">First name and last name are required.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                name="jobTitle"
                placeholder="Job title (for example: SEO Specialist)"
                value={formData.jobTitle}
                onChange={handleInputChange}
                className="px-3 py-2 rounded-lg border border-gray-300"
              />
              <input
                type="number"
                min="0"
                max="80"
                name="yearsExperience"
                placeholder="Years of experience"
                value={formData.yearsExperience}
                onChange={handleInputChange}
                className="px-3 py-2 rounded-lg border border-gray-300"
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 flex-wrap">
                <Upload
                  type="image"
                  setProgress={setUploadProgress}
                  setData={handleAvatarUploadSuccess}
                >
                  <button
                    type="button"
                    className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-sm font-medium"
                  >
                    Upload avatar
                  </button>
                </Upload>
                {isUploadingAvatar && (
                  <span className="text-sm text-gray-600">
                    Uploading: {uploadProgress}%
                  </span>
                )}
                {uploadProgress === 100 && !isUploadingAvatar && (
                  <span className="text-sm text-green-700">Upload complete</span>
                )}
              </div>
              <input
                type="url"
                name="img"
                placeholder="Or paste avatar image URL"
                value={formData.img}
                onChange={handleInputChange}
                className="px-3 py-2 rounded-lg border border-gray-300"
              />
            </div>

            <textarea
              name="bio"
              placeholder="Short bio (up to 320 chars, used in article card)"
              value={formData.bio}
              onChange={handleInputChange}
              maxLength={320}
              rows={3}
              className="px-3 py-2 rounded-lg border border-gray-300"
            />
            <textarea
              name="fullBio"
              placeholder="Full biography (recommended for EEAT)"
              value={formData.fullBio}
              onChange={handleInputChange}
              maxLength={3000}
              rows={6}
              className="px-3 py-2 rounded-lg border border-gray-300"
            />
            <input
              type="text"
              name="alumniOf"
              placeholder="Education (for example: Kyiv National University)"
              value={formData.alumniOf}
              onChange={handleInputChange}
              className="px-3 py-2 rounded-lg border border-gray-300"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="url"
                name="linkedinUrl"
                placeholder="LinkedIn URL"
                value={formData.linkedinUrl}
                onChange={handleInputChange}
                className="px-3 py-2 rounded-lg border border-gray-300"
              />
              <input
                type="url"
                name="githubUrl"
                placeholder="GitHub URL"
                value={formData.githubUrl}
                onChange={handleInputChange}
                className="px-3 py-2 rounded-lg border border-gray-300"
              />
              <input
                type="url"
                name="twitterUrl"
                placeholder="X/Twitter URL"
                value={formData.twitterUrl}
                onChange={handleInputChange}
                className="px-3 py-2 rounded-lg border border-gray-300"
              />
              <input
                type="url"
                name="websiteUrl"
                placeholder="Personal website URL"
                value={formData.websiteUrl}
                onChange={handleInputChange}
                className="px-3 py-2 rounded-lg border border-gray-300"
              />
            </div>

            <textarea
              name="expertiseInput"
              placeholder="Expertise topics, comma-separated (for example: SEO, Marketing, Web analytics)"
              value={formData.expertiseInput}
              onChange={handleInputChange}
              rows={2}
              className="px-3 py-2 rounded-lg border border-gray-300"
            />
            <textarea
              name="awardsInput"
              placeholder="Awards, comma-separated"
              value={formData.awardsInput}
              onChange={handleInputChange}
              rows={2}
              className="px-3 py-2 rounded-lg border border-gray-300"
            />

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={
                  updateProfileMutation.isPending || isUploadingAvatar || !formHasFullName
                }
                className="px-4 py-2 rounded-xl bg-blue-700 text-white text-sm font-medium disabled:bg-blue-400"
              >
                {updateProfileMutation.isPending ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={updateProfileMutation.isPending}
                className="px-4 py-2 rounded-xl border border-gray-300 text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="flex flex-col gap-8">
        <h2 className="text-xl font-semibold">Articles by {displayName}</h2>
        {postsData.posts.length === 0 ? (
          <p className="text-gray-500">No published posts yet.</p>
        ) : (
          postsData.posts.map((post) => <PostListItem key={post._id} post={post} />)
        )}
      </div>

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
