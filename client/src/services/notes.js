import axios from "axios";
const baseUrl = "https://mern-note-app-server.onrender.com/api/notes";

let token = null;

const setToken = (newToken) => {
  token = `bearer ${newToken}`;
};

const getAll = () => {
  return axios.get(baseUrl);
};

const create = (newObject) => {
  const config = {
    headers: { Authorization: token },
  };

  return axios.post(baseUrl, newObject, config);
};

const update = (id, newObject) => {
  return axios.put(`${baseUrl}/${id}`, newObject);
};

const noteService = { getAll, create, update, setToken };

export default noteService;
