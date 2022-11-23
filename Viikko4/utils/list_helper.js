var _ = require("lodash");

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return likes = blogs.reduce((sum, order) => {
      return sum + order.likes
  }, 0)

}

const favoriteBlog = (blogs) => {
  const mostLiked = blogs.reduce((prev, current) => {
      return (prev.likes >= current.likes)
          ? prev
          : current
  }, 0)

  return favorite = {
      title: mostLiked.title,
      author: mostLiked.author,
      likes: mostLiked.likes
  }
}

const mostBlogs = (blogs) => {
  return {
      author: _.maxBy(blogs, "author").author,
      blogs: _.max(_.values(_.countBy(blogs, "author"))),
  }
}

const mostLikes = (blogs) => {
  const authorLikes = blogs.reduce((authorLikes, { author, likes }) => {
    authorLikes[author] = authorLikes[author] || 0
    authorLikes[author] += likes
      return authorLikes
  }, {})
  
  let amountOfLikes = Math.max(...Object.values(authorLikes))
  let mostLiked = Object.keys(authorLikes).filter(author => authorLikes[author] === amountOfLikes)
  
  return author = {
      author: mostLiked[0],
      likes: amountOfLikes
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}