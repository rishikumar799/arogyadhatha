/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // This configuration resolves the "UnhandledSchemeError" by telling Webpack
    // to not bundle built-in Node.js modules (`node:*`) on the server.
    // These modules are available at runtime and don't need to be bundled.
    if (isServer) {
      config.externals.push(/^node:/);
    }
    return config;
  },
};

module.exports = nextConfig;
