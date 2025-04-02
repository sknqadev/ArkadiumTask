import { expect } from '@playwright/test'
import { test } from '../config/webContext.fixture'
import * as ExpectedData from '../data/social.data'

test.describe('Social Tests', () => {
    test(
        'Check leaderboard opens with players results',
        { tag: '@smoke' },
        async ({ homePage, loggedIn }) => {
            void loggedIn
            const gamePage = await homePage.gotoGame(ExpectedData.gameToAccess)
            await gamePage.openLeaderboard()

            await expect(gamePage.firstLeaderboardPlayer).toBeVisible()
        }
    )

    test('Post a comment', { tag: '@regression' }, async () => {
        test.skip(true, 'Unable to test as this is a production environment')
    })
})
