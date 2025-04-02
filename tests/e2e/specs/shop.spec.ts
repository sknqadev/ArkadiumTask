import { expect } from '@playwright/test'
import { test } from '../config/webContext.fixture'
import * as ExpectedData from '../data/shop.data'

test.describe('Shop Tests', () => {
    test('Check prices', { tag: '@smoke' }, async ({ homePage }) => {
        const actualPrices = await homePage.getShopPrices()
        expect(actualPrices).toEqual(ExpectedData.shopPrices)
    })

    test('Full purchase', { tag: '@regression' }, async () => {
        test.skip(true, 'Unable to test as this is a production environment')
    })

    test('Refund', { tag: '@regression' }, async () => {
        test.skip(true, 'Unable to test as this is a production environment')
    })
})
