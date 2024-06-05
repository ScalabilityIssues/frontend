import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
    swSrc: "app/sw.ts",
    swDest: "public/sw.js",
    additionalPrecacheEntries: [
        "/",
        "/staff",
    ],    
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
}

export default withSerwist(nextConfig);
