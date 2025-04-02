import { chromium } from '@playwright/test'
import path from 'path'

const STORAGE_PATH = path.resolve(__dirname, './storageState.json')

export default async function globalSetup() {
    const browser = await chromium.launch({
        slowMo: 1000,
    })
    const page = await browser.newPage()

    await page.goto('https://www.arkadium.com/')

    const agreeButton = page.getByRole('button', { name: 'AGREE', exact: true })
    const cookies = await page.context().cookies()
    const hasGDPRConsent = cookies.some(
        (cookie) => cookie.name === 'euconsent-v2'
    )

    if (!hasGDPRConsent) {
        await agreeButton.click()
    }

    // Login
    await page.getByRole('button', { name: 'Sign in' }).click()
    await page
        .getByPlaceholder('Enter your email address')
        .fill(process.env.ARKADIUM_EMAIL!)
    await page.getByPlaceholder('Password').fill(process.env.ARKADIUM_PASSWORD!)
    await page.getByRole('button', { name: 'Submit' }).click()

    await page.waitForSelector(
        'img[alt="A default avatar that is a silhouette."]',
        {
            timeout: 15000,
        }
    )

    await page.context().storageState({ path: STORAGE_PATH })
    await browser.close()
}
