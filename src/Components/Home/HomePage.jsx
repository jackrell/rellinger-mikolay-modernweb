import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser, logOut } from "../../Common/Services/AuthService";

export default function HomePage() {
  const user = getCurrentUser();
  const navigate = useNavigate();

  const handleAuthAction = async () => {
    if (user) {
      await logOut();
      navigate("/");
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex flex-col items-center justify-center relative p-8">
      {/* Auth buttons top-right */}
      <div className="absolute top-6 right-6 flex gap-4 items-center">
        {user ? (
          <>
            <span className="text-sm text-gray-400">
              Signed in as <strong>{user.get("username")}</strong>
            </span>
            <button
              onClick={handleAuthAction}
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-md transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate("/auth?register=true")}
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-md transition"
            >
              Register
            </button>
            <button
              onClick={handleAuthAction}
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-md transition"
            >
              Login
            </button>
          </>
        )}
      </div>

      {/* Title and description */}
      <h1 className="text-4xl md:text-6xl font-bold mb-4">
        NBA Team Builder
      </h1>
      <p className="text-lg text-gray-400 mb-10 text-center max-w-xl">
        Build your dream team. Simulate matchups. Create basketball history.
      </p>

      {/* Navigation buttons */}
      <div className="flex flex-wrap gap-6 justify-center">
        <Link to="/view-teams">
          <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition text-lg">
            View All Teams
          </button>
        </Link>
        <Link to="/manage-teams">
          <button className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition text-lg">
            Manage My Teams
          </button>
        </Link>
      </div>
    </div>
  );
}