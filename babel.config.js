module.exports = {
  presets: [
    [
      "@babel/env",
      {
        targets: {
          ie: "8",
        },
        useBuiltIns: "usage",
        corejs: "3.6.4",
        debug: true,
      },
    ],
  ],
}
