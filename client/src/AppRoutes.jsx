import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout.jsx";
import Homepage from "./routes/Homepage.jsx";
import AboutPage from "./routes/AboutPage.jsx";
import PostListPage from "./routes/PostListPage.jsx";
import SinglePostPage from "./routes/SinglePostPage.jsx";
import CategoryPage from "./routes/CategoryPage.jsx";
import AuthorPage from "./routes/AuthorPage.jsx";
import TagPage from "./routes/TagPage.jsx";

const Write = lazy(() => import("./routes/Write.jsx"));
const AdminPosts = lazy(() => import("./routes/AdminPosts.jsx"));
const AdminAuthors = lazy(() => import("./routes/AdminAuthors.jsx"));
const LoginPage = lazy(() => import("./routes/LoginPage.jsx"));
const RegisterPage = lazy(() => import("./routes/RegisterPage.jsx"));

const RouteLoader = () => (
  <div className="py-8 text-sm text-gray-600">Loading...</div>
);

const LazyRoute = ({ children }) => (
  <Suspense fallback={<RouteLoader />}>{children}</Suspense>
);

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Homepage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/posts" element={<PostListPage />} />
        <Route path="/articles/:slug" element={<SinglePostPage />} />
        <Route path="/:slug" element={<SinglePostPage />} />
        <Route
          path="/write"
          element={
            <LazyRoute>
              <Write />
            </LazyRoute>
          }
        />
        <Route
          path="/write/:slug"
          element={
            <LazyRoute>
              <Write />
            </LazyRoute>
          }
        />
        <Route path="/categories/:slug" element={<CategoryPage />} />
        <Route path="/authors/:username" element={<AuthorPage />} />
        <Route path="/tags/:slug" element={<TagPage />} />
        <Route
          path="/admin/posts"
          element={
            <LazyRoute>
              <AdminPosts />
            </LazyRoute>
          }
        />
        <Route
          path="/admin/authors"
          element={
            <LazyRoute>
              <AdminAuthors />
            </LazyRoute>
          }
        />
        <Route
          path="/login"
          element={
            <LazyRoute>
              <LoginPage />
            </LazyRoute>
          }
        />
        <Route
          path="/register"
          element={
            <LazyRoute>
              <RegisterPage />
            </LazyRoute>
          }
        />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
