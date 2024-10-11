import { useState } from 'react';

const Blog = ({ blog, handleRemove, handleLike, user }) => {
  const [blogVisible, setBlogVisible] = useState(false);
  const [likes, setLikes] = useState(blog.likes);

  const blogHideWhenVisible = { display: blogVisible ? 'none' : '' };
  const blogShowWhenVisible = { display: blogVisible ? '' : 'none' };

  const handleLikeClick = () => {
    setLikes(likes + 1);
    handleLike(blog);
  };

  return (
    <div className="blog" id={`blog-${blog.id}`}>
      <div style={blogHideWhenVisible}>
        <button id={`view-blog-${blog.id}`} onClick={() => setBlogVisible(true)}>View blog</button>
        {blog.title} by {blog.author}
      </div>
      <div style={blogShowWhenVisible}>
        <li>
          <strong>{blog.title}</strong> <br />
          Author: {blog.author} <br />
          Likes: {likes} <button id={`like-button-${blog.id}`} onClick={handleLikeClick}>like</button> <br />
          url: {blog.url} <br />
          {user && user.id === blog.user.id && (
            <button id={`remove-button-${blog.id}`} onClick={() => handleRemove(blog)}>Remove</button>
          )}
        </li>
        <button id={`hide-details-${blog.id}`} onClick={() => setBlogVisible(false)}>Hide details</button>
      </div>
    </div>
  );
};

export default Blog;