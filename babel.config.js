module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      [
        "babel-preset-expo",
        {
          jsxImportSource: "nativewind",
        },
      ],
    ],
    plugins: [
      // "nativewind/babel", <--- REMOVE THIS LINE
      "react-native-reanimated/plugin", // Keep this at the bottom
    ],
  };
};
