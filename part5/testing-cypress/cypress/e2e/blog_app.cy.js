describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: 'Vjacheslav Hludnev',
      username: 'vjhludnev',
      password: 'superstrongpass',
    }
    const user2 = {
      name: 'root',
      username: 'Superuser',
      password: 'salainen',
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user2)
    cy.visit('')
  })

  it('Login form is shown', function () {
    cy.contains('log in').click()
    cy.get('#login-form').should('be.visible')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.contains('log in').click()
      cy.get('#username').type('vjhludnev')
      cy.get('#password').type('superstrongpass')
      cy.get('#login-button').click()

      cy.contains('Vjacheslav Hludnev logged in')
    })

    it('fails with wrong credentials', function () {
      cy.contains('log in').click()
      cy.get('#username').type('vjhludnev')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('.error')
        .should('contain', 'wrong')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')

      cy.get('html').should('not.contain', 'Vjacheslav Hludnev logged in')
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({
        username: 'vjhludnev',
        password: 'superstrongpass',
      })
    })
    it('A blog can be created', function () {
      cy.contains('create new blog').click()
      cy.get('.new-blog').should('be.visible')
      cy.get('[name="title"]').type('a blog created by cypress')
      cy.get('[name="author"]').type('some author')
      cy.get('[name="url"]').type('testing url...')
      cy.get('#create-blog').click()
      cy.get('.new-blog').should('not.be.visible')
      cy.contains('a blog created by cypress some author')
    })

    describe('a blog exists', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'a blog created by cypress',
          author: 'some author',
          url: 'testing url...',
        })
      })

      it('a blog can be liked', function () {
        cy.contains('a blog created by cypress').contains('view').click()
        cy.get('.nonvisiblecontent').contains('like').click()
      })

      it('a blog can be deleted by creator', function () {
        cy.contains('a blog created by cypress').contains('view').click()
        cy.get('#loggedin-user').contains('Vjacheslav Hludnev')
        cy.get('#blog-creator').contains('Vjacheslav Hludnev')
        cy.get('.nonvisiblecontent').contains('remove').click()
      })

      it('blog remove button is not visible to users not created it', function () {
        cy.contains('log out').click()
        cy.contains('log in').click()
        cy.login({
          username: 'Superuser',
          password: 'salainen',
        })

        cy.contains('a blog created by cypress').contains('view').click()
        cy.get('#loggedin-user').should('not.contain', 'Vjacheslav Hludnev')
        cy.get('#blog-creator').contains('Vjacheslav Hludnev')
        cy.get('.nonvisiblecontent').contains('remove').should('not.exist')
      })
    })

    describe('and several blogs exist', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'The title with the least number of likes',
          author: 'author',
          url: 'some url',
          likes: 1,
        })
        cy.createBlog({
          title: 'The title with the most likes',
          author: 'author',
          url: 'some url',
          likes: 5,
        })
        cy.createBlog({
          title: 'The title with the second most likes',
          author: 'author',
          url: 'some url',
          likes: 3,
        })
      })

      it('the blogs are ordered according to likes in desc. order', function () {
        cy.get('.blog-title').eq(0).should('contain', 'The title with the most likes')
        cy.get('.blog-title').eq(1).should('contain', 'The title with the second most likes')
        cy.get('.blog-title').eq(2).should('contain', 'The title with the least number of likes')
      })
    })
  })
})
