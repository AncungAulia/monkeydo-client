import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    user_id: location.state?.user_id || "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Menampilkan success message dari registrasi
  const [successMessage, setSuccessMessage] = useState(
    location.state?.registrationSuccess
      ? "Registration successful! Please login to continue."
      : ""
  );

  // Clear success message after 5 seconds
  React.useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Clear location state after using it
  React.useEffect(() => {
    if (location.state) {
      window.history.replaceState({}, document.title);
    }
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.user_id.trim()) {
      newErrors.user_id = "User ID is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        delete newErrors.message;
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await axios.post("https://tugas-gdsc.vercel.app/api/v1/login", formData);
      navigate("/dashboard");
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Login failed. Please try again.";
      setErrors({
        message:
          errorMessage === "Invalid user ID or password"
            ? "Invalid user ID or password. Please try again."
            : errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-containerLight/75 dark:bg-containerDark/75">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="bg-backgroundLight dark:bg-containerDark shadow-lg rounded-3xl px-8 pt-6 pb-8 mb-4 border-2 border-banana"
          noValidate
        >
          <h1 className="text-3xl font-bold text-center mb-6 text-primaryTextLight dark:text-primaryTextDark">
            Login
          </h1>

          {successMessage && (
            <div className="mb-4 p-3 rounded bg-green-100 text-green-700 text-sm">
              {successMessage}
            </div>
          )}

          {errors.message && (
            <div className="mb-4 p-3 rounded bg-red-100 text-errorText text-sm">
              {errors.message}
            </div>
          )}

          <div className="mb-4">
            <label
              className="block text-primaryTextLight dark:text-primaryTextDark text-sm font-bold mb-2"
              htmlFor="user_id"
            >
              User ID <span className="text-red-500">*</span>
            </label>
            <input
              id="user_id"
              name="user_id"
              type="text"
              value={formData.user_id}
              onChange={handleChange}
              className={`w-full p-3 rounded-2xl bg-slate-200/50 dark:bg-slate-50
                focus:outline-none focus:ring-2 focus:ring-button
                dark:text-primaryTextLight
                ${errors.user_id ? "ring-2 ring-errorText" : ""}`}
              placeholder="Enter your User ID"
            />
            {errors.user_id && (
              <p className="text-errorText text-sm mt-1">{errors.user_id}</p>
            )}
          </div>

          <div className="mb-6">
            <label
              className="block text-primaryTextLight dark:text-primaryTextDark text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password <span className="text-red-500">*</span>
            </label>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              className={`w-full p-3 rounded-2xl bg-slate-200/50 dark:bg-slate-50
                focus:outline-none focus:ring-2 focus:ring-button
                dark:text-primaryTextLight
                ${errors.password ? "ring-2 ring-errorText" : ""}`}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
            {errors.password && (
              <p className="text-errorText text-sm mt-1">{errors.password}</p>
            )}
            <div className="mt-2">
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  className="mr-2"
                  onChange={() => setShowPassword(!showPassword)}
                />
                Show Password
              </label>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg bg-banana text-secondaryTextLight
                font-bold hover:brightness-110 transition-all duration-300
                ${loading ? "opacity-50 cursor-wait" : "hover:scale-105"}`}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <p className="mt-4 text-sm">
              Don't have an account?{" "}
              <Link
                to="/registration"
                className="text-button hover:underline font-semibold"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
