const defaultTheme = require('tailwindcss/defaultTheme');
const { screens } = defaultTheme;
const webpack = require('webpack');

const { parsed: myEnv } = require('dotenv').config({
  path: '../.env',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  publicRuntimeConfig: {
    breakpoints: screens,
  },
  webpack(config) {
    // all vars end up in the client -
    config.plugins.push(new webpack.EnvironmentPlugin(myEnv));
    return config;
  },
};

module.exports = nextConfig;
