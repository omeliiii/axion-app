// next.config.js
const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack", "file-loader"],
    });

    return config;
  },
};

export default nextConfig;
