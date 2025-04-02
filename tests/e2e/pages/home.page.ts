import { Page } from '@playwright/test'
import { BasePage, BestPage, GamePage } from './'
import { Routes } from '../config/routes'

export class HomePage extends BasePage {
    constructor(page: Page) {
        super(page)
    }

    readonly agreeGDPRButton = this.page.getByRole('button', {
        name: 'AGREE',
        exact: true,
    })
    readonly bestLink = this.page.getByTestId('Best')

    /**
     * Clicks the GDPR agreement button to allow cookies.
     */
    async acceptGDPR() {
        await this.agreeGDPRButton.click()
    }

    /**
     * Navigates to the "Best Games" page and returns the page object.
     *
     * @returns {Promise<BestPage>} The Best Games page object.
     */
    async gotoBest(): Promise<BestPage> {
        await Promise.all([
            this.page.waitForURL(`**${Routes.BEST_GAMES}`, {
                waitUntil: 'domcontentloaded',
            }),
            this.bestLink.click(),
        ])

        return new BestPage(this.page)
    }

    /**
     * Navigates to a game page by its alt text (image label).
     *
     * @param gameName - The alt text of the game to click.
     * @returns {Promise<GamePage>} The Game page object.
     */
    async gotoGame(gameName: string): Promise<GamePage> {
        await Promise.all([
            this.page.waitForURL(`**${Routes.GAME}**`, {
                waitUntil: 'domcontentloaded',
            }),
            await this.page.getByAltText(gameName).click(),
        ])

        return new GamePage(this.page)
    }

    /**
     * Opens the homepage route.
     */
    async open() {
        await this.page.goto(Routes.HOME)
    }
}
