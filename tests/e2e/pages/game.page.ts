import { Page } from '@playwright/test'
import { BasePage } from './base.page'

export class GamePage extends BasePage {
    constructor(page: Page) {
        super(page)
    }
    readonly leaderboardTab = this.page.getByRole('img', {
        name: 'leaderboard-icon',
    })
    readonly firstLeaderboardPlayer = this.page
        .getByRole('group', { name: 'Player' })
        .first()

    /**
     * Opens the leaderboard tab.
     */
    async openLeaderboard() {
        await this.leaderboardTab.click()
    }
}
