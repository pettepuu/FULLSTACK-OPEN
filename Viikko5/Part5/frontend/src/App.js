import { useState, useEffect } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';
import Notification from './services/Notification';
import BlogForm from './components/BlogForm';
import './index.css';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [addVisible, setAddVisible] = useState(false);
  const [error, setError] = useState(null);

  const createHideWhenVisible = { display: addVisible ? 'none' : '' };
  const createShowWhenVisible = { display: addVisible ? '' : 'none' };

  useEffect(() => {
    const fetchAllBlogs = async () => {
      try {
        const allBlogs = await blogService.getAll();
        const sortedBlogs = allBlogs.sort((a, b) => b.likes - a.likes);
        setBlogs(sortedBlogs);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setErrorMessage('Failed to load blogs');
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      }
    };

    fetchAllBlogs();
  }, []);
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      setToken(user.token);
      blogService.setToken(user.token);
      fetchUserBlogs(user.id);
    }
  }, []);

  const fetchUserBlogs = async (userId) => {
    try {
      const blogs = await blogService.getPersonsBlogs(userId);
      const userBlogs = blogs.filter(blog => blog.user && blog.user.id === userId);
      const sortedBlogs = userBlogs.sort((a, b) => b.likes - a.likes);
      setBlogs(sortedBlogs);
    } catch (error) {
      console.error('Error fetching user blogs:', error);
      setErrorMessage('Failed to load blogs');
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleLike = async (blog) => {
    try {
      const updatedBlog = {
        ...blog,
        likes: blog.likes + 1,
        user: blog.user.id
      };
      const returnedBlog = await blogService.update(blog.id, updatedBlog);
      setBlogs(blogs.map(b => (b.id === blog.id ? returnedBlog : b)));
    } catch (error) {
      console.error('Error updating likes:', error.response ? error.response.data : error.message);
      setError('Failed to increase likes');
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  };

  const handleRemove = async (blog) => {
    if (window.confirm(`Do you really want to remove the following blog - ${blog.title} by ${blog.author}?`)) {
      try {
        await blogService.remove(blog.id);
        setBlogs(blogs.filter(b => b.id !== blog.id));
        setSuccessMessage('Blog removed successfully');
        setTimeout(() => {
          setSuccessMessage(null);
        }, 5000);
      } catch (error) {
        setErrorMessage('Failed to remove blog');
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      }
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      fetchUserBlogs(user.id);
      setUsername('');
      setPassword('');
      setSuccessMessage('Welcome!');
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setErrorMessage('Invalid username or password');
      } else {
        setErrorMessage('An unexpected error occurred');
      }
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleLogout = async () => {
    window.localStorage.removeItem('loggedBlogappUser');
    setUser(null);
    setToken(null);
    const allBlogs = await blogService.getAll();
    setBlogs(allBlogs); // Reload all blogs when logging out
  };

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          id='username'
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          id='password'
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button id='login' type="submit">login</button>
    </form>
  );

  if (user === null) {
    return (
      <div>
        <Notification message={errorMessage} type="error" />
        <Notification message={successMessage} type="success" />
        <h2>Log in to application</h2>
        {loginForm()}

        <h2>Blogs</h2>
        {blogs.length > 0 ? (
          blogs.map(blog => (
            <Blog key={blog.id} blog={blog} handleRemove={handleRemove} handleLike={handleLike} user={user} />
          ))
        ) : (
          <p>No blogs available</p>
        )}
      </div>
    );
  }

  return (
    <div>
      <Notification message={errorMessage} type="error" />
      <Notification message={successMessage} type="success" />
      {user && (
        <div>
          <p>{user.name} Logged in</p>
          <button id='logout' onClick={handleLogout}>Logout</button>
        </div>
      )}
      <h2>Create New Blog</h2>
      <div style={createHideWhenVisible}>
        <button onClick={() => setAddVisible(true)}>Add blog</button>
      </div>
      <div style={createShowWhenVisible}>
        <BlogForm user={user} setBlogs={setBlogs} blogs={blogs} setSuccessMessage={setSuccessMessage} setErrorMessage={setErrorMessage} />
        <button onClick={() => setAddVisible(false)}>cancel</button>
      </div>

      <h2>Blogs</h2>
      {blogs.length > 0 ? (
        blogs.map(blog => (
          <Blog key={blog.id} blog={blog} handleRemove={handleRemove} handleLike={handleLike} user={user} /> // Pass user here
        ))
      ) : (
        <p>No blogs available</p>
      )}
    </div>
  );
};

export default App;