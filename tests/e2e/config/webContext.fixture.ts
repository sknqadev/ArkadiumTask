import { test as baseTest } from '@playwright/test'
import { HomePage } from '../pages'
import fs from 'fs'
import path from 'path'

type WebContextFixture = {
    homePage: HomePage
    loggedIn: void
}

const STORAGE_PATH = path.resolve(__dirname, 'storageState.json')

/**
 * Playwright custom fixtures for the Arkadium project.
 *
 * Adds:
 * - `homePage`: Opens the home page and handles basic setup (GDPR, etc).
 * - `loggedIn`: Ensures the user is authenticated using `storageState.json`.
 *
 * Timeouts are extended for slow projects and Firefox.
 *
 * @example
 * test('example', async ({ homePage, loggedIn }) => {
 *   // You can use homePage and assume you're logged in
 * });
 */
export const test = baseTest.extend<WebContextFixture>({
    homePage: async ({ page }, use, testInfo) => {
        const homePage = new HomePage(page)
        if (testInfo.project.metadata.slow) test.setTimeout(4 * 60 * 1000)

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

    loggedIn: async ({ homePage, page }, use, testInfo) => {
        if (testInfo.project.metadata.slow) test.setTimeout(4 * 60 * 1000)
        if (testInfo.project.name === 'firefox') test.setTimeout(5 * 60 * 1000)

        const hasStorage = fs.existsSync(STORAGE_PATH)

        if (!hasStorage) {
            await homePage.login(
                process.env.ARKADIUM_EMAIL!,
                process.env.ARKADIUM_PASSWORD!
            )
            await page.context().storageState({ path: STORAGE_PATH })
        }

        await use()
    },
})
