// postcss.config.js
module.exports = {
  plugins: [
    require("autoprefixer"),
    require("cssnano"), // Minifies the CSS for production
  ],
};
