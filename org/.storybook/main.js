const path = require('path');
// const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
module.exports = {
  // Define and load stories from our project directories
  stories: ['../**/*.stories.mdx', '../**/*.stories.@(js|jsx|ts|tsx)'],
  // Make sure to include static assets in the build
  staticDir: '../public',
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    'storybook-addon-next',
    'storybook-addon-next-router',
  ],
  framework: '@storybook/react',
  core: {
    builder: '@storybook/builder-webpack5',
  },
  webpackFinal: async (config) => {
    config.resolve.modules = [path.resolve(__dirname, '..'), 'node_modules'];
    return config;
  },
};
