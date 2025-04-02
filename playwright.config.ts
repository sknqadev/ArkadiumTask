import { defineConfig, devices } from '@playwright/test'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '.env') })

const allProjects = [
    {
        name: 'chromium',
        use: { ...devices['Desktop Chrome'] },
        metadata: { mobile: false, fast: true },
    },
    {
        name: 'firefox',
        use: { ...devices['Desktop Firefox'] },
        metadata: { mobile: false, fast: false },
    },
    {
        name: 'webkit',
        use: { ...devices['Desktop Safari'] },
        metadata: { mobile: false, fast: false },
    },
    {
        name: 'Mobile Chrome',
        use: { ...devices['Pixel 7'] },
        metadata: { mobile: true, fast: false },
    },
    {
        name: 'Mobile Chrome Landscape',
        use: { ...devices['Pixel 7 landscape'] },
        metadata: { mobile: true, fast: false },
    },
    {
        name: 'Mobile Safari',
        use: { ...devices['iPhone 12'] },
        metadata: { mobile: true, fast: false },
    },
    {
        name: 'Branded Microsoft Edge',
        use: { ...devices['Desktop Edge'], channel: 'msedge' },
        metadata: { mobile: false, fast: false },
    },
    {
        name: 'Branded Google Chrome',
        use: { ...devices['Desktop Chrome'], channel: 'chrome' },
        metadata: { mobile: false, fast: false },
    },
]

const filteredProjects = allProjects
    .filter((project) => {
        if (process.env.RUN_MODE === 'fast') {
            return project.metadata.fast
        } else if (process.env.RUN_MODE === 'mobile') {
            return project.metadata.mobile
        }
        return true
    })
    .map((project) => ({
        ...project,
        timeout: project.metadata.fast ? 2 * 60 * 1000 : 3 * 60 * 1000,
    }))

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 1,
    workers: process.env.CI ? 1 : 1,
    reporter: 'html',
    globalTeardown: path.resolve(
        __dirname,
        './tests/e2e/config/globalTeardown.ts'
    ),
    globalSetup: path.resolve(__dirname, './tests/e2e/config/globalSetup.ts'),
    expect: {
        timeout: 30 * 1000,
    },

    use: {
        baseURL: 'https://www.arkadium.com/',
        trace: 'retry-with-trace',
        storageState: './tests/e2e/config/storageState.json',
    },

    projects: filteredProjects,
})
