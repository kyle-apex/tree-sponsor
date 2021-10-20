/* eslint-disable no-undef */
module.exports = {
  future: {
    webpack5: true,
  },
  images: {
    domains: [`${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com`, 'platform-lookaside.fbsbx.com', 'lh3.googleusercontent.com'],
  },
};
