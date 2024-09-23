// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: ["prettier", "expo"],
  plugins: ["prettier", "react-native"],
  rules: {
    "prettier/prettier": "error",
    "react-native/no-unused-styles": "error",
  },
};
