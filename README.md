# 🎯 ArkadiumTask

This is an end-to-end testing project built using **Playwright + TypeScript** to validate core user journeys on [Arkadium.com](https://www.arkadium.com).

> ✅ Covers navigation, game access, search, shop prices, and social interactions like leaderboards  
> ✅ Designed for automation and CI pipelines  
> ✅ Headless by default, but supports UI execution for debugging

---

## 🧰 Tech Stack

- [Playwright](https://playwright.dev/)
- TypeScript
- Page Object Model (POM)
- Modular Fixtures
- Storage State Handling for Login
- Eslint, Prettier, and Husky for code cleanliness
- Tags: `@smoke`, `@regression`

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/sknqadev/ArkadiumTask.git
cd ArkadiumTask
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create `.env` File

Create a `.env` in the project root with your Arkadium credentials:

You can use the .env.example as a guideline too

```env
ARKADIUM_EMAIL=your_email@example.com
ARKADIUM_PASSWORD=your_secure_password
```

### 4. Install Playwright Browsers

```bash
npx playwright install
```



---

## 💡 How It Works

The project uses Playwright’s [global setup](https://playwright.dev/docs/test-global-setup) to log in once before the test suite and generate a `storageState.json` used in all tests.

This avoids CAPTCHA issues and speeds up test execution by skipping repeated logins.

---

## 📂 Folder Structure

```
├── config/                    # Fixtures and setup files
│   ├── globalSetup.ts        # Logs in and saves session state
│   ├── globalTeardown.ts     # Cleans up session state
│   └── webContext.fixture.ts # Custom test setup with fixtures
├── data/                      # Expected results (titles, categories, shop prices)
├── pages/                     # Page Object Model classes
├── specs/                     # All E2E test specs
├── storageState.json          # Generated after first login
├── playwright.config.ts       # Playwright config file
└── README.md
```

---

## 🚀 Running Tests

### Run all tests

```bash
npx playwright test
```

### Run with UI (headed mode)

```bash
npx playwright test --headed
```

### Run only smoke tests

```bash
npx playwright test --grep @smoke
```

### Run only regression tests

```bash
npx playwright test --grep @regression
```

---

## 🧪 Useful Commands

### Show last test report in browser

```bash
npx playwright show-report
```

### Regenerate session manually

```bash
npx tsx tests/e2e/config/globalSetup.ts
```

Or just delete the session:

```bash
rm tests/e2e/config/storageState.json
```

---

## 💻 Sample Test Usage

```ts
test('Check shop prices', async ({ homePage }) => {
    const actual = await homePage.getShopPrices()
    expect(actual).toEqual(ExpectedData.shopPrices)
})
```

```ts
test('Open game and check leaderboard', async ({ homePage }) => {
    const gamePage = await homePage.gotoGame(ExpectedData.gameToAccess)
    await gamePage.openLeaderboard()
    await expect(gamePage.firstLeaderboardPlayer).toBeVisible()
})
```

---

## ✅ Login & Session Details

- On first test run, Playwright logs in with the credentials from `.env`
- A `storageState.json` is created under `/config`
- All tests reuse this session for faster execution
- The file is cleaned up after the suite finishes

---

## ⚠️ Notes

- CAPTCHA can prevent login in headless mode during `globalSetup.ts`
- In case globalSetup fails, you may need to change the headless mode to false, so you can manually perform the captcha verification:

```
    const browser = await chromium.launch({
        headless: false,
        slowMo: 1000,
    })
```

---

## ✍️ Author

- Made by [@sknqadev](https://github.com/sknqadev) Davi César Travaglia da Silva
- QA Automation Engineer| E2E | Performance Testing
