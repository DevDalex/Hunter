export default {
  stories: ['../src/**/*.stories.@(js|jsx|mjs)'],
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  staticDirs: ['../public'],
  async viteFinal(config) {
    return {
      ...config,
      // Storybook owns copying ../public via staticDirs. Disable Vite's
      // second publicDir copy so the static build cannot race on the same
      // media/succession-contest destination and fail with EEXIST.
      publicDir: false,
    };
  },
};
