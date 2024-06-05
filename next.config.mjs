import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
    swSrc: "app/sw.ts",
    swDest: "public/sw.js",
});

const nextConfig = {
    output: "standalone",
}

export default withSerwist(nextConfig);
