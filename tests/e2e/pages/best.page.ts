import { Page } from '@playwright/test'
import { BasePage } from './base.page'

export class BestPage extends BasePage {
    constructor(readonly page: Page) {
        super(page)
    }
    readonly bestGameTitles = this.page.getByRole('heading', { level: 3 })

    /**
     * Retrieves the titles of all games listed on the Best Games page.
     *
     * @returns A promise that resolves to an array of strings, each representing a game title.
     */
    async getAllGameTitles() {
        return await this.bestGameTitles.allInnerTexts()
    }
}
