// Description: This component is responsible for displaying the toggle buttons for the theme and language
import { stringEnglish, stringSpanish } from "../lib/translations";
import { lightTheme, darkTheme } from "../lib/themes";
import styled from "styled-components/native";

const Toggles = ({ theme, toggleTheme, language, toggleLanguage }) => {
    return (
    <TogglesContainer>
            <ToggleButton onPress={toggleLanguage}>
              <ToggleButtonText>
                {language === "english"
                  ? stringEnglish.toggleLanguage
                  : stringSpanish.toggleLanguage}
              </ToggleButtonText>
            </ToggleButton>
            <ToggleButton onPress={toggleTheme}>
              <ToggleButtonText>
                {language === "english"
                  ? stringEnglish.toggleTheme
                  : stringSpanish.toggleTheme}
                {/*ternary operator to display the correct emoji based on the theme*/}
                {theme === "light" ? "\uD83C\uDF1A" : "\uD83C\uDF1D"}
              </ToggleButtonText>
            </ToggleButton>
          </TogglesContainer>
    );
};

const TogglesContainer = styled.View`
  flex-direction: row;
  margin: 10px;
`;

const ToggleButton = styled.TouchableOpacity`
  flex: 1;
  padding: 10px;
  margin: 10px;
  background-color: ${({ theme }) => theme.background};
  border-radius: 10px;
`;

const ToggleButtonText = styled.Text`
  font-size: 15px;
  text-align: center;
  color: ${({ theme }) => theme.text};
`;

export default Toggles;