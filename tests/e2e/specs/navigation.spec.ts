import { expect } from '@playwright/test'
import { test } from '../config/webContext.fixture'
import * as ExpectedData from '../data/navigation.data'

test.describe('Navigation Tests', () => {
    test(
        'Open the website and it loads on the home page',
        { tag: ['@smoke'] },
        async ({ homePage }) => {
            const title = await homePage.page.title()
            expect(title).toMatch(ExpectedData.homePageTitle)
        }
    )

    test(
        'Given best games are displayed on the best page',
        { tag: ['@regression'] },
        async ({ homePage }, testInfo) => {
            test.skip(
                testInfo.project.metadata?.mobile,
                'Unsupported for Mobile Browsers'
            )
            const bestPage = await homePage.gotoBest()
            const actualTitles = await bestPage.getAllGameTitles()
            expect(actualTitles.sort()).toEqual(
                ExpectedData.bestGamesTitles.sort()
            )
        }
    )

    for (const category of ExpectedData.allCategories) {
        test(
            `Category "${category}" is visible on search component`,
            { tag: ['@regression'] },
            async ({ homePage, page }) => {
                await homePage.performSearch(category)
                await expect(
                    page.getByRole('link', {
                        name: `${category} ${category}`,
                        exact: true,
                    })
                ).toBeVisible()
            }
        )
    }
})
