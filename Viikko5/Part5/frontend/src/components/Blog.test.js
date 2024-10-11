import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Blog from './Blog';
import BlogForm from './BlogForm';

test('renders blog title and author, but not url or likes by default', () => {
  const blog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://testblog.com',
    likes: 10,
  };

  render(<Blog blog={blog} handleRemove={() => {}} />);
  
  expect(screen.getByText((content, element) => {
    return element.tagName.toLowerCase() === 'div' && content.includes('Test Blog');
  })).toBeInTheDocument();

  expect(screen.getByText((content, element) => {
    return element.tagName.toLowerCase() === 'div' && content.includes('Test Author');
  })).toBeInTheDocument();

  expect(screen.queryByText('URL:')).not.toBeInTheDocument();
  expect(screen.queryByText('Likes:')).not.toBeInTheDocument();
});

test('shows url and likes when the view button is clicked', async () => {
  const blog = {
    title: 'Testaajan paivakirja',
    author: 'testiukko',
    url: 'www.testimiehenseikkailut.fi',
    likes: 123123,
  };

  render(<Blog blog={blog} handleRemove={() => {}} />);
  
  const viewButton = screen.getByText('View blog');
  await userEvent.click(viewButton);
  
  expect(screen.getByText((content, element) => {
    return element.tagName.toLowerCase() === 'li' && content.includes(blog.url);
  })).toBeInTheDocument();

  expect(screen.getByText((content, element) => {
    return element.tagName.toLowerCase() === 'li' && content.includes(`Likes: ${blog.likes}`);
  })).toBeInTheDocument();
});

test('like button is clicked twice, the event handler is called twice', async () => {
  const mockHandler = jest.fn();
  
  const blog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://testblog.com',
    likes: 10,
  };

  render(<Blog blog={blog} handleRemove={() => {}} handleLike={mockHandler} />);
  
  const likeButton = screen.getByText('like');
  await userEvent.click(likeButton);
  await userEvent.click(likeButton);
  
  expect(mockHandler.mock.calls).toHaveLength(2);
});


test('form calls the event handler with correct details when a new blog is created', async () => {
  const createBlog = jest.fn();
  const user = { id: 1 };
  const blogs = [];
  const setBlogs = jest.fn();
  const setSuccessMessage = jest.fn();
  const setErrorMessage = jest.fn();

  render(
    <BlogForm
      createBlog={createBlog}
      setSuccessMessage={setSuccessMessage}
      setErrorMessage={setErrorMessage}
      user={user}
      blogs={blogs}
      setBlogs={setBlogs}
    />
  );

  await userEvent.type(screen.getByPlaceholderText('Title'), 'New Blog Title');
  await userEvent.type(screen.getByPlaceholderText('Author'), 'New Author');
  await userEvent.type(screen.getByPlaceholderText('URL'), 'www.newblogurl.com');

  await userEvent.click(screen.getByText('save'));

  expect(createBlog).toHaveBeenCalledWith({
    title: 'New Blog Title',
    author: 'New Author',
    url: 'www.newblogurl.com',
    likes: 0,
    user: 1,
  });
});