// Description: Home component that renders the main screen of the app
import styled from "styled-components/native";
import {
  ScrollView,
  SafeAreaView,
  ImageBackground,
  View,
  Text,
  Button,
} from "react-native";
import { stringEnglish, stringSpanish } from "../lib/translations";
import { lightTheme, darkTheme } from "../lib/themes";
import SearchBar from "./SearchBar";
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
          {/* Toggles component for toggling the theme and language */}
          <Toggles
            toggleTheme={toggleTheme}
            toggleLanguage={toggleLanguage}
            language={language}
            theme={theme}
          />
          {/* SearchBar component to search and add cities to the list */}
          <SearchBar
            city={city}
            setCity={setCity}
            setMyCities={setMyCities}
            language={language}
          />
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            style={{ flex: 1 }}
          >
              {/* if there is weather data, map over the weather data and render a CityForecast component for each city */}
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
                // if there is no weather data, render a message to the user
                <NoCityForecast>
                  {language === "english"
                    ? stringEnglish.NoWeatherToShow
                    : stringSpanish.NoWeatherToShow}
                  {"\n"} 🌙 ❄️ ☔️ 🌈 🌤️
                </NoCityForecast>
              )}
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    </Container>
  );
};

// styled components for the home component
const CityForecastContainer = styled.TouchableOpacity`
  margin: 10px 20px;
`;

const Container = styled.View`
  background-color: ${({ theme }) => theme.background};
`;

const NoCityForecast = styled.Text`
  font-size: 30px;
  line-height: 70px;
  text-align: center;
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
