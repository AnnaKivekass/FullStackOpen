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
})
