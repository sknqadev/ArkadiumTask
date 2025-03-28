import { defineConfig } from 'eslint/config'
import globals from 'globals'
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import playwright from 'eslint-plugin-playwright'

export default defineConfig([
    {
        files: ['**/*.{js,ts}'],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        plugins: {
            js,
        },
        extends: ['js/recommended'],
    },
    {
        ...tseslint.configs.recommended[0], // a config do typescript-eslint vem como array
    },
    {
        ...playwright.configs['flat/recommended'],
        files: ['tests/**'],
    },
    {
        files: ['playwright.config.ts'],
        rules: {
            'import/no-default-export': 'off',
        },
    },
])
