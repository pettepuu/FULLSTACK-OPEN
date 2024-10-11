describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.visit('http://localhost:3000')

    const user = {
      username: 'mauri',
      name: 'Mauri',
      password: 'mauri'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
  })

  it('Login form is shown', function() {
    cy.contains('Log in')
  })

  
  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('mauri')
      cy.get('#password').type('mauri')
      cy.get('#login').click().click()
      cy.contains('Logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('wronguser')
      cy.get('#password').type('wrongpassword')
      cy.get('#login').click()
      cy.contains('Invalid username or password')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.request('POST', 'http://localhost:3003/api/login', {
        username: 'mauri', password: 'mauri'
      }).then(response => {
        localStorage.setItem('loggedBlogappUser', JSON.stringify(response.body))
        cy.visit('http://localhost:3000')
      })
      
    })
    it('A blog can be created', function() {
      cy.contains('Add blog').click()
      cy.get('#title').type('A new blog')
      cy.get('#author').type('Author')
      cy.get('#url').type('http://example.com')
      cy.get('#save').click()
      cy.contains('A new blog by Author')
    })

    it('A blog can be liked', function() {
      cy.contains('Add blog').click()
      cy.get('#title').type('Touhumiehen päiväkirja')
      cy.get('#author').type('Touhumies')
      cy.get('#url').type('http://touhukkaatPaivat.com')
      cy.get('#save').click()
      cy.contains('Touhumiehen päiväkirja by Touhumies')
      cy.get('button[id^="view-blog-"]').click()
      cy.get('button[id^="like-button-"]').click()
      cy.contains('Likes: 1')
    })

    it('A blog can be deleted', function() {
      cy.contains('Add blog').click()
      cy.get('#title').type('Touhumiehen päiväkirja')
      cy.get('#author').type('Touhumies')
      cy.get('#url').type('http://touhukkaatPaivat.com')
      cy.get('#save').click()
      cy.visit('http://localhost:3000')
      cy.contains('Touhumiehen päiväkirja by Touhumies')
      cy.get('button[id^="view-blog-"]').click()
      cy.get('button[id^="remove-button-"]').click()
      cy.contains('Touhumiehen päiväkirja by Touhumies').should('not.exist')
    })

    it('Only the creator can see the delete button', function() {
      cy.contains('Add blog').click()
      cy.get('#title').type('Touhumiehen päiväkirja')
      cy.get('#author').type('Touhumies')
      cy.get('#url').type('http://touhukkaatPaivat.com')
      cy.get('#save').click()
      cy.visit('http://localhost:3000')
      cy.contains('Touhumiehen päiväkirja by Touhumies')
      cy.get('button[id^="view-blog-"]').click()
      cy.contains('Remove')
      cy.get('#logout').click()
      cy.contains('Touhumiehen päiväkirja by Touhumies')
      cy.get('button[id^="view-blog-"]').click()
      cy.contains('Touhumiehen päiväkirja').parent().find('button[id^="remove-button-"]').should('not.exist')
    })

    it('Blogs are ordered by likes', function() {
      cy.contains('Add blog').click()
      cy.get('#title').type('EEEEE')
      cy.get('#author').type('EEEEE')
      cy.get('#url').type('http://EEEEE.com')
      cy.get('#likes').type(55555)
      cy.get('#save').click()
      cy.get('#title').type('AAAAA')
      cy.get('#author').type('AAAAA')
      cy.get('#url').type('http://AAAAA.com')
      cy.get('#likes').type(11111)
      cy.get('#save').click()
      cy.get('#title').type('IIIII')
      cy.get('#author').type('IIIII')
      cy.get('#url').type('http://IIIII.com')
      cy.get('#likes').type(99999)
      cy.get('#save').click()
      cy.visit('http://localhost:3000')
      cy.get('.blog').eq(0).should('contain', 'IIIII');
      cy.get('.blog').eq(1).should('contain', 'EEEEE');
      cy.get('.blog').eq(2).should('contain', 'AAAAA');
    })
    
  })
})