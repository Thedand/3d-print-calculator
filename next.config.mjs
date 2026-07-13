const repository = "3d-print-calculator";

const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: process.env.GITHUB_ACTIONS ? `/${repository}` : "",
  assetPrefix: process.env.GITHUB_ACTIONS ? `/${repository}/` : "",
};

export default nextConfig;