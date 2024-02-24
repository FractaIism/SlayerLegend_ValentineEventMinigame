/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/minigame',
        permanent: true,
      }
    ]
  }
}

module.exports = nextConfig
