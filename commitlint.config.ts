const config = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "subject-case": [
      0,
      "always",
      ["sentence-case", "start-case", "pascal-case"],
    ],
    "body-max-line-length": [0, "always", 200],
  },
};

export default config;
