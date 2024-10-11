import axios from 'axios'
const baseUrl = '/api/'

let token = null

const setToken = (newToken) => {
  token = newToken; // Store the token
  if (newToken) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
  } else {
    delete axios.defaults.headers.common['Authorization']; // Clear it if no token
  }
};

const getPersonsBlogs = async (userId) => {
  const response = await axios.get(`/api/blogs?user=${userId}`);
  return response.data;
};

const getAll = () => {
  const request = axios.get(`${baseUrl}blogs`);
  return request.then(response => response.data); 
};

const addBlog = async (newObject) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const create = async (newBlog) => {
  try {
      const response = await axios.post(`${baseUrl}blogs`, newBlog);
      return response.data; 
  } catch (error) {
      console.error('Error creating blog:', error.response ? error.response.data : error.message);
      throw error;
  }
}

const update = async (id, updatedObject) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.put(`${baseUrl}blogs/${id}`, updatedObject, config);
  return response.data;
};
const remove = async (id) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }, // Ensure token is correctly formatted
  };

  console.log(`Preparing to send DELETE request to: ${baseUrl}/blogs/${id} with token:`, token);

  try {
    const response = await axios.delete(`${baseUrl}blogs/${id}`, config);
    return response.data;
  } catch (error) {
    console.error('Error during DELETE request:', error);
    throw error; // Propagate the error for handling in the calling function
  }
};






export default { create, getAll, getPersonsBlogs, addBlog, setToken, update, remove }