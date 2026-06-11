module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      [
        "babel-preset-expo",
        {
          jsxImportSource: "nativewind",
          jsxRuntime: "automatic", // Force the modern runtime
        },
      ],
      "nativewind/babel",
    ],
    plugins: [
      "react-native-worklets-core/plugin",
      "react-native-reanimated/plugin",
    ],
  };
};
