import fs from 'fs'
import path from 'path'

const STORAGE_PATH = path.resolve(__dirname, 'storageState.json')

/**
 * Deletes the `storageState.json` file if it exists.
 *
 * This ensures that no stale session data is reused in future test runs.
 * It improves test reliability by enforcing fresh state on each execution.
 *
 * This function is automatically called by Playwright after all tests complete,
 * as configured in the project's Playwright config (`globalTeardown` option).
 *
 * @returns {Promise<void>} A promise that resolves after the teardown completes.
 */
async function globalTeardown(): Promise<void> {
    if (fs.existsSync(STORAGE_PATH)) {
        fs.unlinkSync(STORAGE_PATH)
    }
}

export default globalTeardown
