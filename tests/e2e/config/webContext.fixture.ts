import { test as baseTest } from '@playwright/test'
import { HomePage } from '../pages'

type WebContextFixture = {
    homePage: HomePage
}

/**
 * Playwright custom fixtures for the Arkadium project.
 *
 * Adds:
 * - `homePage`: Opens the home page and handles basic setup (GDPR, etc).
 *
 * Timeouts are extended for slow projects and Firefox.
 *
 * @example
 * test('example', async ({ homePage }) => {
 *   // You can use homePage and assume you're logged in
 * });
 */
export const test = baseTest.extend<WebContextFixture>({
    homePage: async ({ page }, use, testInfo) => {
        const homePage = new HomePage(page)

        if (testInfo.project.metadata?.slow) test.setTimeout(4 * 60 * 1000)

        await homePage.open()

        const cookies = await page.context().cookies()
        const hasGDPRConsent = cookies.some(
            (cookie) => cookie.name === 'euconsent-v2'
        )

        if (!hasGDPRConsent) {
            await homePage.acceptGDPR()
        }

        await use(homePage)
    },
})
