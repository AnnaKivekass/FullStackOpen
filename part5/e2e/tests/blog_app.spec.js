const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')

    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen',
      },
    })

    await page.goto('http://localhost:5173')
    await page.evaluate(() => window.localStorage.clear())
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText(/log in to application/i)).toBeVisible()
    await expect(page.locator('#username')).toBeVisible()
    await expect(page.locator('#password')).toBeVisible()
    await expect(page.getByRole('button', { name: /login/i })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.locator('#username').fill('mluukkai')
      await page.locator('#password').fill('salainen')
      await page.getByRole('button', { name: /login/i }).click()

      await expect(page.getByRole('button', { name: /logout/i })).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.locator('#username').fill('mluukkai')
      await page.locator('#password').fill('wrongpassword')
      await page.getByRole('button', { name: /login/i }).click()

      await expect(page.getByText(/wrong username or password/i)).toBeVisible()
      await expect(page.getByRole('button', { name: /logout/i })).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.locator('#username').fill('mluukkai')
      await page.locator('#password').fill('salainen')
      await page.getByRole('button', { name: /login/i }).click()

      await expect(page.getByRole('button', { name: /logout/i })).toBeVisible()
    })

    describe('and a blog exists', () => {
      let uniqueTitle

      beforeEach(async ({ page }) => {
        uniqueTitle = `Playwright blog ${Date.now()}`

        await page.getByRole('button', { name: /new blog|create new|add blog/i }).click()
        await page.locator('#title').fill(uniqueTitle)
        await page.locator('#author').fill('E2E Tester')
        await page.locator('#url').fill('https://example.com')
        await page.getByRole('button', { name: /create/i }).click()

        await expect(page.locator('.blog').filter({ hasText: uniqueTitle }).first()).toBeVisible()
      })

      test('a new blog can be created', async ({ page }) => {
        await expect(page.locator('.blog').filter({ hasText: uniqueTitle }).first()).toBeVisible()
      })

      test('a blog can be liked', async ({ page }) => {
        const blog = page.locator('.blog').filter({ hasText: uniqueTitle }).first()

        await blog.getByRole('button', { name: /view|show/i }).click()

        const likesTextBefore = await blog.locator('.blogDetails').getByText(/likes/i).innerText()
        const before = Number((likesTextBefore.match(/\d+/) || ['0'])[0])

        await blog.getByRole('button', { name: /like/i }).click()

        await expect
          .poll(async () => {
            const t = await blog.locator('.blogDetails').getByText(/likes/i).innerText()
            return Number((t.match(/\d+/) || ['0'])[0])
          })
          .toBe(before + 1)
      })

      test('the user who created a blog can delete it', async ({ page }) => {
        const blog = page.locator('.blog').filter({ hasText: uniqueTitle }).first()

        await blog.getByRole('button', { name: /view|show/i }).click()

        page.once('dialog', async (dialog) => {
          await dialog.accept()
        })

        await blog.getByRole('button', { name: /remove/i }).click()

        await expect(page.locator('.blog').filter({ hasText: uniqueTitle })).toHaveCount(0)
      })
    })

    describe('only creator can see remove button', () => {
      beforeEach(async ({ request }) => {
        await request.post('http://localhost:3003/api/users', {
          data: {
            name: 'Ada Lovelace',
            username: 'ada',
            password: 'salainen2',
          },
        })
      })

      test('only creator sees remove button', async ({ page }) => {
        const uniqueTitle = `Creator-only blog ${Date.now()}`

        await page.getByRole('button', { name: /new blog|create new|add blog/i }).click()
        await page.locator('#title').fill(uniqueTitle)
        await page.locator('#author').fill('E2E Tester')
        await page.locator('#url').fill('https://example.com')
        await page.getByRole('button', { name: /create/i }).click()

        const blogAsCreator = page.locator('.blog').filter({ hasText: uniqueTitle }).first()
        await blogAsCreator.getByRole('button', { name: /view|show/i }).click()

        await expect(blogAsCreator.getByRole('button', { name: /remove/i })).toBeVisible()

        await page.getByRole('button', { name: /logout/i }).click()
        await expect(page.getByRole('button', { name: /login/i })).toBeVisible()

        await page.locator('#username').fill('ada')
        await page.locator('#password').fill('salainen2')
        await page.getByRole('button', { name: /login/i }).click()
        await expect(page.getByRole('button', { name: /logout/i })).toBeVisible()

        const blogAsOtherUser = page.locator('.blog').filter({ hasText: uniqueTitle }).first()
        await blogAsOtherUser.getByRole('button', { name: /view|show/i }).click()

        await expect(blogAsOtherUser.getByRole('button', { name: /remove/i })).toHaveCount(0)
      })
    })
  })
})
