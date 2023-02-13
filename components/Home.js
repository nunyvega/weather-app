import styled from "styled-components/native";
import {
  ScrollView,
  SafeAreaView,
  ImageBackground,
  View,
  Text,
  Alert,
  Button,
} from "react-native";
import { stringEnglish, stringSpanish } from "../translations";
import { lightTheme, darkTheme } from "../themes";
import ForecastSearch from "./ForecastSearch";
import CityForecast from "./CityForecast";

const Home = ({
  city,
  setCity,
  setMyCities,
  setIndex,
  weatherData,
  toggleTheme,
  navigation,
  theme,
  language,
  toggleLanguage,
}) => {
  const handlePress = (weatherData, localIndex, setIndex) => {
    setIndex(localIndex);
    navigation.navigate({ name: "WeatherDetails" });
  };

  return (
    <Container>
      <ImageBackground
        source={theme === "light" ? lightTheme.bgImage : darkTheme.bgImage}
        style={{ width: "100%", height: "100%" }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <AppTitle>Lovely Weather 🌡️</AppTitle>
          <TogglesContainer>
            <ToggleLanguageButton onPress={toggleLanguage}>
              <ToggleLanguageButtonText>
                {language === "english"
                  ? stringEnglish.toggleLanguage
                  : stringSpanish.toggleLanguage}
              </ToggleLanguageButtonText>
            </ToggleLanguageButton>
            <ToggleThemeButton onPress={toggleTheme}>
              <ToggleThemeButtonText>
                {language === "english"
                  ? stringEnglish.toggleTheme
                  : stringSpanish.toggleTheme}
                {theme === "light" ? "\uD83C\uDF1A" : "\uD83C\uDF1D"}
              </ToggleThemeButtonText>
            </ToggleThemeButton>
          </TogglesContainer>
          <ForecastSearch
            city={city}
            setCity={setCity}
            setMyCities={setMyCities}
          />
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            style={{ flex: 1 }}
          >
            <ForecastContainer>
              {weatherData.length ? (
                weatherData.map((data, localIndex) => (
                  <CityForecastContainer
                    key={localIndex}
                    onPress={() => handlePress(data, localIndex, setIndex)}
                  >
                    <CityForecast
                      cityWeather={data}
                      setMyCities={setMyCities}
                      index={localIndex}
                    />
                  </CityForecastContainer>
                ))
              ) : (
                <NoWeather>
                  {language === "english"
                    ? stringEnglish.NoWeatherToShow
                    : stringSpanish.NoWeatherToShow}
                  {"\n"} 🌙 ❄️ ☔️ 🌈 🌤️
                </NoWeather>
              )}
            </ForecastContainer>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    </Container>
  );
};

const CloseButton = styled.TouchableOpacity`
  width: 30px;
  height: 30px;
  background-color: ${({ theme }) => theme.contrastBackground};
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  position: absolute;
  margin: 20px;
  right: 0;
`;

const CloseButtonText = styled.Text`
  font-size: 20px;
  color: ${({ theme }) => theme.text};
`;

const CityForecastContainer = styled.TouchableOpacity`
  margin: 10px;
  width: auto;
`;

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.background};
`;

const ForecastContainer = styled.View`
  margin: 10px;
`;

const DetailedForecastContainer = styled.View`
  margin: 40px 10px;
  padding: 10px;
`;

const CityView = styled.View`
  margin-bottom: 20px;
  padding: 20px;
  background-color: ${({ theme }) => theme.background};
  border-radius: 10px;
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.2);
`;

const CityName = styled.Text`
  font-size: 35px;
  font-weight: bold;
  align-self: center;
  color: ${({ theme }) => theme.text};
`;

const CityTempView = styled.View`
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  margin: 10px 0;
`;

const WeatherIcon = styled.Image`
  width: 50px;
  height: 50px;
`;

const CityDegrees = styled.Text`
  font-size: 48px;
  font-weight: bold;
  margin-left: 10px;
  color: ${({ theme }) => theme.text};
`;

const Description = styled.Text`
  font-size: 18px;
  color: ${({ theme }) => theme.text};
`;

const DetailedInfoContainer = styled.View`
  margin: 10px 0;
`;

const DetailsRow = styled.View`
  margin: 10px 0;
  border-width: 1px;
  border-radius: 20px;
  border-color: ${({ theme }) => theme.background};
  background-color: ${({ theme }) => theme.background};
  padding: 10px;
  flex-direction: row;
  justify-content: space-around;
  margin-bottom: 5px;
`;

const DetailsBox = styled.View`
  align-items: center;
`;

const Subtitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${({ theme }) => theme.text};
`;

const Details = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.text};
`;

const NoWeather = styled.Text`
  font-size: 40px;
  line-height: 90px;
  font-weight: bold;
  text-align: center;
  spacing: 10px;
  margin-top: 10%;
  color: ${({ theme }) => theme.text};
`;

const TogglesContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  margin: 10px;
  display: flex;
`;

const ToggleThemeButton = styled.TouchableOpacity`
  flex: 1;
  padding: 10px;
  margin: 10px;
  background-color: ${({ theme }) => theme.background};
  border-radius: 10px;
  align-self: flex-end;
`;

const ToggleThemeButtonText = styled.Text`
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  color: ${({ theme }) => theme.text};
`;

const ToggleLanguageButton = styled.TouchableOpacity`
  flex: 1;
  padding: 10px;
  margin: 10px;
  background-color: ${({ theme }) => theme.background};
  border-radius: 10px;
  align-self: flex-end;
`;

const ToggleLanguageButtonText = styled.Text`
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  color: ${({ theme }) => theme.text};
`;

const AppTitle = styled.Text`
  font-size: 32px;
  font-weight: bold;
  text-align: center;
  margin: 25px;
  color: ${({ theme }) => theme.text};
`;
export default Home;
