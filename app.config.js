// Étend app.json — ajoute le baseUrl uniquement pour l'export GitHub Pages
// (EXPO_PUBLIC_BASE_URL='/lyvo' npx expo export -p web)
module.exports = ({ config }) => {
  if (process.env.EXPO_PUBLIC_BASE_URL) {
    config.experiments = { ...config.experiments, baseUrl: process.env.EXPO_PUBLIC_BASE_URL };
  }
  return config;
};
