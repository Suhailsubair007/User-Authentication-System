import React, { useReducer, useState } from "react";
import axiosInstance from "../../config/axiosConfig";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAdminInfo } from "../../redux/AdminSlice";

const initialState = {
  email: "",
  password: "",
};

const SET_EMAIL = "SET_EMAIL";
const SET_PASSWORD = "SET PASSWORD";
const RESET = "RESET";

const reducer = (state, action) => {
  switch (action.type) {
    case SET_EMAIL:
      return {
        ...state,
        email: action.payload,
      };
    case SET_PASSWORD:
      return {
        ...state,
        password: action.payload,
      };
    case RESET:
      return initialState;
    default:
      return state;
  }
};

const AdminLogin = () => {
  const dispatchStore = useDispatch();
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState);

  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/admin/login", state);
      console.log(response.data);
      const { _id, name, email } = response.data;
      dispatchStore(setAdminInfo({ admin: { _id, name, email } }));
      dispatch({ type: RESET });
      navigate("/admin/dashboard");
    } catch (error) {
      if (error.status === 401) {
        setErrors((prevErr) => ({
          ...prevErr,
          inValid: error.response.data.message,
        }));
      }
      console.log(error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-white mb-8">
          Admin Login
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Email input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              onChange={(e) =>
                dispatch({
                  type: SET_EMAIL,
                  payload: e.target.value,
                })
              }
              className="mt-2 w-full p-2 text-gray-900 rounded-md bg-gray-700 border-0 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Password input */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              onChange={(e) =>
                dispatch({
                  type: SET_PASSWORD,
                  payload: e.target.value,
                })
              }
              className="mt-2 w-full p-2 text-gray-900 rounded-md bg-gray-700 border-0 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {errors.inValid && <p className="text-red-500">{errors.inValid}</p>}

          {/* Login button */}
          <div>
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-md"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
