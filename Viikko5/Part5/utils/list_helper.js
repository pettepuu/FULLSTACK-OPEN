const lodash = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}
const mostLikes = (blogs) => {
  const mostLikedBlog = blogs.reduce((max, blog) => {
    return blog.likes > max.likes ? blog : max;
  });
  return mostLikedBlog;
}

const mostBlogs = (blogs) => {
  return {
    author: lodash.maxBy(blogs, "author").author,
    blogs: lodash.max(lodash.values(lodash.countBy(blogs, "author"))),
}
};

const AuthorMostLikes = (blogs) => {
  const groupedByAuthor = lodash.groupBy(blogs, 'author');
  const authorLikes = lodash.map(groupedByAuthor, (blogs, author) => {
    return {
      author,
      likes: lodash.sumBy(blogs, 'likes')
    };
  });
  const mostLikesAuthor = lodash.maxBy(authorLikes, 'likes');
  console.log(authorLikes);
  return mostLikesAuthor;
};

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  dummy,
  totalLikes,
  mostLikes,
  mostBlogs,
  AuthorMostLikes,
  usersInDb
}