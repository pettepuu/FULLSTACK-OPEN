import { useState } from 'react';
import blogService from '../services/blogs';

const BlogForm = (props) => {
  const [newBlogTitle, setNewBlogTitle] = useState('');
  const [newBlogAuthor, setNewBlogAuthor] = useState('');
  const [newBlogUrl, setNewBlogUrl] = useState('');
  const [newBlogLikes, setNewBlogLikes] = useState(0);

  const addBlog = async (event) => {
    event.preventDefault();
    try {
      const newBlogObject = {
        title: newBlogTitle,
        author: newBlogAuthor,
        url: newBlogUrl,
        likes: newBlogLikes,
        user: props.user.id
      };
      console.log('New Blog Object:', newBlogObject); // Debugging line
      if (props.createBlog) {
        await props.createBlog(newBlogObject); // Call the mock function in tests
      } else {
        const returnedBlog = await blogService.create(newBlogObject); // Call the actual service in production
        props.setBlogs(props.blogs.concat(returnedBlog));
      }

      setNewBlogTitle('');
      setNewBlogAuthor('');
      setNewBlogUrl('');
      setNewBlogLikes(0); 
      props.setSuccessMessage('Blogin lisääminen onnistui');
      setTimeout(() => {
        props.setSuccessMessage(null)
      }, 5000)
    } catch (exception) {
      console.error('Error adding blog:', exception);
      props.setErrorMessage('Failed to add blog');
      setTimeout(() => {
        props.setErrorMessage(null);
      }, 5000);
    }
  }

  return (
    <form onSubmit={addBlog}>
      <div>
        <input
        id="title"
          placeholder="Title"
          value={newBlogTitle}
          onChange={(e) => setNewBlogTitle(e.target.value)}
        />
      </div>
      <div>
        <input
        id="author"
          placeholder="Author"
          value={newBlogAuthor}
          onChange={(e) => setNewBlogAuthor(e.target.value)}
        />
      </div>
      <div>
        <input
        id="url"
          placeholder="URL"
          value={newBlogUrl}
          onChange={(e) => setNewBlogUrl(e.target.value)}
        />
      </div>
      <div>
        <input
        id="likes"
          type="number"
          placeholder="Likes"
          value={newBlogLikes}
          onChange={(e) => setNewBlogLikes(parseInt(e.target.value) || 0)}
        />
      </div>
      <button id="save"type="submit">save</button>
    </form>
  );
};

export default BlogForm;