import styled from "styled-components/native";

const CityForecast = ({ cityWeather, setMyCities, index }) => {
  const { name, weather, main, wind } = cityWeather;
  const temp = main ? Math.round(main.temp) : null;
  const feelsLike = main ? Math.round(main.feels_like) : null;
  const tempMin = main ? Math.round(main.temp_min) : null;
  const tempMax = main ? Math.round(main.temp_max) : null;
  const humidity = main ? main.humidity : null;
  const windSpeed = wind ? wind.speed : null;
  const rain = cityWeather.rain ? cityWeather.rain : 0;

  const handleDelete = () => {
    setMyCities((prevCities) => prevCities.filter((_, i) => i !== index));
  };

  return (
    <CityView>
      <CityTempView>

        {weather && (
          <WeatherIcon
            source={{
              uri: `http://openweathermap.org/img/wn/${weather[0].icon}@4x.png`,
            }}
            resizeMode={"contain"}
          />
        )}
              <CityName>{name}</CityName>
                </CityTempView>

        <CityTempView>
        <CityDegrees>{temp}°C</CityDegrees>
        <Description>{weather && weather[0].description}</Description>
      </CityTempView>
      <CloseButton onPress={handleDelete}>
        <CloseButtonText>X</CloseButtonText>
      </CloseButton>
    </CityView>
  );
};

const CityView = styled.View`
  padding: 19px;
  background-color: ${({ theme }) => theme.background};
  border-radius: 10px;
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.2);
`;

const CityName = styled.Text`
  font-size: 30px;
  font-weight: bold;
  align-self: center;
  color: ${({ theme }) => theme.text};
  text-align: center;
`;

const CityTempView = styled.View`
  padding-right: 20px;
  margin-right: 20px;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
`;

const WeatherIcon = styled.Image`
  width: 90px;
  height: 90px;
`;

const CityDegrees = styled.Text`
  font-size: 30px;
  font-weight: bold;
  color: ${({ theme }) => theme.text};
`;

const Description = styled.Text`
  font-size: 26px;
  color: ${({ theme }) => theme.text};
  justify-content: center;
  text-align: center;
  self-align: center;
`;

const CloseButton = styled.TouchableOpacity`
  width: 30px;
  height: 30px;
  background-color: ${({ theme }) => theme.contrastBackground};
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  position: absolute;
  margin: 10px;
  right: 0;
`;

const CloseButtonText = styled.Text`
  font-size: 20px;
  color: ${({ theme }) => theme.text};
`;

export default CityForecast;
