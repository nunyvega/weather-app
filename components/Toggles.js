import { stringEnglish, stringSpanish } from "../translations";
import { lightTheme, darkTheme } from "../themes";
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
  justify-content: space-around;
  margin: 10px;
  display: flex;
`;

const ToggleButton = styled.TouchableOpacity`
  flex: 1;
  padding: 10px;
  margin: 10px;
  background-color: ${({ theme }) => theme.background};
  border-radius: 10px;
  align-self: flex-end;
`;

const ToggleButtonText = styled.Text`
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  color: ${({ theme }) => theme.text};
`;

export default Toggles;