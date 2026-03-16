import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "./Image";
import { Link } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  UserButton,
  useAuth,
  useUser,
} from "@clerk/clerk-react";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { isLoaded, isSignedIn, user } = useUser();
  const { getToken } = useAuth();

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
    enabled: isLoaded && isSignedIn,
    retry: false,
    staleTime: 60 * 1000,
  });

  const profileUsername = currentUserData?.username || user?.username || "";
  return (
    <div className="w-full h-16 md:h-20 flex items-center justify-between">
      {/* LOGO */}
      <Link to="/" className="flex items-center gap-4 text-2xl font-bold">
        <Image src="logo.png" alt="Lama Logo" w={32} h={32} />
        <span>lamalog</span>
      </Link>

      {/* MOBILE MENU */}
      <div className="md:hidden">
        <div
          className="cursor-pointer text-4xl"
          onClick={() => setOpen((prev) => !prev)}
        >
          <div className="flex flex-col gap-[5.4px]">
            <div
              className={`h-[3px] rounded-md w-6 bg-black origin-left transition-all ease-in-out ${
                open ? "rotate-45" : ""
              }`}
            />
            <div
              className={`h-[3px] rounded-md w-6 bg-black transition-all ease-in-out ${
                open ? "opacity-0" : ""
              }`}
            />
            <div
              className={`h-[3px] rounded-md w-6 bg-black origin-left transition-all ease-in-out ${
                open ? "-rotate-45" : ""
              }`}
            />
          </div>
        </div>

        <div
          className={`w-full h-screen bg-[#e6e6ff] flex flex-col items-center justify-center gap-8 font-medium text-lg absolute top-16 transition-all ease-in-out ${
            open ? "-right-0" : "-right-[100%]"
          }`}
        >
          <Link to="/" onClick={() => setOpen(false)}>
            Home
          </Link>
          <Link to="/posts?sort=trending" onClick={() => setOpen(false)}>
            Trending
          </Link>
          <Link to="/posts?sort=popular" onClick={() => setOpen(false)}>
            Most Popular
          </Link>
          <Link to="/about" onClick={() => setOpen(false)}>
            About
          </Link>
          <Link to="/admin/authors" onClick={() => setOpen(false)}>
            Authors
          </Link>

          <SignedIn>
            {profileUsername && (
              <Link
                to={`/authors/${profileUsername}`}
                onClick={() => setOpen(false)}
              >
                Мій профіль
              </Link>
            )}
          </SignedIn>

          <SignedOut>
            <Link to="/login" onClick={() => setOpen(false)}>
              <button className="py-2 px-4 rounded-3xl bg-blue-800 text-white">
                Login
              </button>
            </Link>
          </SignedOut>
        </div>
      </div>

      {/* DESKTOP MENU */}
      <div className="hidden md:flex items-center gap-8 xl:gap-12 font-medium">
        <Link to="/">Home</Link>
        <Link to="/posts?sort=trending">Trending</Link>
        <Link to="/posts?sort=popular">Most Popular</Link>
        <Link to="/about">About</Link>
        <Link
          to="/admin/authors"
          className="py-2 px-4 rounded-3xl border border-gray-400 text-gray-700"
        >
          Authors
        </Link>

        <SignedIn>
          {profileUsername && (
            <Link
              to={`/authors/${profileUsername}`}
              className="py-2 px-4 rounded-3xl border border-blue-700 text-blue-700"
            >
              Мій профіль
            </Link>
          )}
        </SignedIn>

        <SignedOut>
          <Link to="/login">
            <button className="py-2 px-4 rounded-3xl bg-blue-800 text-white">
              Login
            </button>
          </Link>
        </SignedOut>

        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
};

export default Navbar;
