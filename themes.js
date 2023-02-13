// Description: This file contains the theme objects for the app
import bgImgDark from "./assets/dark.jpeg";
import bgImgLight from "./assets/light.jpeg";

// Light theme object with the colors and background image
const lightTheme = {
  background: "rgba(255, 255, 255, 0.5)",
  contrastBackground: "white",
  title: "palevioletred",
  text: "black",
  bgImage: bgImgLight,
};

// Dark theme object with the colors and background image
const darkTheme = {
  background: "rgba(0, 0, 0, 0.5)",
  contrastBackground: "black",
  title: "white",
  text: "white",
  bgImage: bgImgDark,
};

export { lightTheme, darkTheme };
