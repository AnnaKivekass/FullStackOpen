const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('http://localhost:5173')
    await page.evaluate(() => window.localStorage.clear())
    await page.reload()
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

      await expect(page.getByText(/matti luukkainen.*logged in/i)).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.locator('#username').fill('mluukkai')
      await page.locator('#password').fill('wrongpassword')
      await page.getByRole('button', { name: /login/i }).click()

      await expect(page.getByText(/wrong username or password/i)).toBeVisible()
      await expect(page.getByText(/logged in/i)).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.locator('#username').fill('mluukkai')
      await page.locator('#password').fill('salainen')
      await page.getByRole('button', { name: /login/i }).click()

      await expect(page.getByText(/matti luukkainen.*logged in/i)).toBeVisible()
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
        console.log(await page.getByRole('button').allTextContents())

        await blog.getByRole('button', { name: /view|show/i }).click()

        page.once('dialog', async (dialog) => {
          await dialog.accept()
        })

        await page.getByRole('button', { name: /remove|delete/i }).click()

        await expect(page.locator('.blog').filter({ hasText: uniqueTitle })).toHaveCount(0)
      })
    })
  })
})
