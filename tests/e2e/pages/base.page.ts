import { expect, Page } from '@playwright/test'

/**
 * BasePage provides shared locators and actions used across multiple pages.
 * Useful for navigation elements, search, login, and accessing the shop.
 */
export class BasePage {
    constructor(readonly page: Page) {}

    readonly searchButton = this.page.getByRole('img', { name: 'search-icon' })
    readonly searchField = this.page.getByRole('textbox', { name: 'Search' })
    readonly emailField = this.page.getByPlaceholder('Enter your email address')
    readonly passwordField = this.page.getByPlaceholder('Password')
    readonly signinButton = this.page.getByRole('button', { name: 'Sign in' })
    readonly submitButton = this.page.getByRole('button', { name: 'Submit' })
    readonly shopTab = this.page.getByRole('img', { name: 'shop-icon' })
    readonly gemCards = this.page.locator('[class*="PlusGemCard-container"]')
    readonly avatarImg = this.page.getByAltText(
        'A default avatar that is a silhouette.'
    )

    /**
     * Executes a site-wide search using the global search bar.
     * @param query The text to be searched.
     */
    async performSearch(query: string) {
        await this.searchButton.click()
        await this.searchField.fill(query)
    }

    /**
     * Logs the user in using provided credentials.
     * Expects login modal to appear and user avatar to be visible after success.
     * @param email User email
     * @param password User password
     */
    async login(email: string, password: string) {
        await this.signinButton.click()
        await this.emailField.fill(email)
        await this.passwordField.fill(password)
        await Promise.all([
            this.avatarImg.waitFor({ state: 'visible' }),
            this.submitButton.click(),
        ])
    }

    /**
     * Retrieves all gem shop card prices from the shop tab.
     * Requires user to be logged in.
     * @returns A map of prices (USD) to gem amounts as strings.
     */
    async getShopPrices() {
        const prices: Record<string, string> = {}
        await expect(this.avatarImg, {
            message: " Can't see shop prices without login ",
        }).toBeVisible({ timeout: 10 * 1000 })

        await this.shopTab.click()
        await expect(this.gemCards.first()).toBeVisible({ timeout: 10 * 1000 })

        const count = await this.gemCards.count()
        for (let i = 0; i < count; i++) {
            const card = this.gemCards.nth(i)
            const gemsText = await card
                .locator('[class*="PlusGemCard-value"]')
                .innerText()
            const cleanGems = gemsText.replace(/,/g, '').trim()

            const priceText = await card.getByRole('button').innerText()
            prices[priceText.trim()] = cleanGems
        }

        return prices
    }
}
