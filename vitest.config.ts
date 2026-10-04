import { defineConfig } from 'vitest/config'

const config = defineConfig({
  test: {
    include: ['test/**/*.test.ts'],
    environment: 'node',
  },
})

export default config
