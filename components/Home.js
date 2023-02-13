import styled from "styled-components/native";
import {
  ScrollView,
  SafeAreaView,
  ImageBackground,
  View,
  Text,
  Button,
} from "react-native";
import { stringEnglish, stringSpanish } from "../translations";
import { lightTheme, darkTheme } from "../themes";
import ForecastSearch from "./ForecastSearch";
import CityForecast from "./CityForecast";
import Toggles from "./Toggles";

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
  // handle the press event of the city forecast component
  const handlePress = (weatherData, localIndex, setIndex) => {
    // set the index of the city forecast component that was pressed
    setIndex(localIndex);
      // navigate to the weather details screen
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
          <Toggles
            toggleTheme={toggleTheme}
            toggleLanguage={toggleLanguage}
            language={language}
          />
          <ForecastSearch
            city={city}
            setCity={setCity}
            setMyCities={setMyCities}
            language={language}
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

// styled components for the home component
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

const Details = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.text};
`;

const NoWeather = styled.Text`
  font-size: 35px;
  line-height: 70px;
  font-weight: bold;
  text-align: center;
  spacing: 10px;
  margin-top: 10%;
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
