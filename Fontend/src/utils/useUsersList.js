import { useEffect, useState } from "react";
import { BASE_URL } from "../constants/index";
import { getAccessToken } from "../utils/tokens";
import axios from "axios";
import axiosJWT from "./AxiosService";
const useUsersList = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const config = {
    headers: {
      Authorization: "Bearer " + getAccessToken(),
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  };

  useEffect(() => {
    axiosJWT
      .get(BASE_URL + "/admin/get_all_users", config)
      .then((res) => {
        setAllUsers(res.data.users);
        setFilteredUsers(res.data.users);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return { allUsers, filteredUsers, setAllUsers, setFilteredUsers };
};
export default useUsersList;
