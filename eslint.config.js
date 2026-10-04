import { defineConfig } from 'eslint/config'
import quickcasa from '@quickcasa/eslint-config'

const config = defineConfig([{ ignores: ['dist', 'coverage'] }, ...quickcasa])

export default config
