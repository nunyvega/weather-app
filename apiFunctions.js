import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "./config";
import { stringEnglish, stringSpanish } from "./translations";

const showAlert = (setCity, language) => {
    Alert.alert(
      language === "english"
        ? stringEnglish.errorTitle
        : stringSpanish.errorTitle,
      language === "english"
        ? stringEnglish.errorMessage
        : stringSpanish.errorMessage,
      [
        {
          text:
            language === "english"
              ? stringEnglish.errorButton
              : stringSpanish.errorButton,
          onPress: () => setCity(""),
          style: "cancel",
        },
      ],
      {
        cancelable: true,
        onDismiss: () => setCity(""),
      }
    );
  };

const fetchWeather = async (city, language, myCities, setMyCities, setWeatherData, setCity) => {
    try {
      const response = await fetch(
        `http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${
          config.API_KEY
        }&units=metric&lang=${
          language === "english"
            ? stringEnglish.languageCode
            : stringSpanish.languageCode
        }`
      );
      if (!response.ok) {
        let newcities = myCities.filter((cityIter) => cityIter !== city);
        setMyCities(newcities);
        throw new Error(
          `Unable to fetch weather for ${city}. Response status: ${response.status}`
        );
      } else {
        const data = await response.json();
        setWeatherData((prevData) => [...prevData, data]);
      }
    } catch (error) {
      console.error(error);
      showAlert(setCity, language);
    }
  };

  const storeData = async (key, value) => {
    try {
      let values;
      key == "@myCities" && value
        ? (values = JSON.stringify(value))
        : (values = value);
      await AsyncStorage.setItem(key, values);
      console.log("stored values in async storage" + key + values);
    } catch (e) {
      console.log("cagao");
    }
  };

  const getData = async (setTheme, setMyCities, setLanguage) => {
    try {
      const storedCities = await AsyncStorage.getItem("@myCities");
      const storedLanguage = await AsyncStorage.getItem("@language");
      const storedTheme = await AsyncStorage.getItem("@theme");

      storedTheme && setTheme(storedTheme);
      storedCities && setMyCities(JSON.parse(storedCities));
      storedLanguage && setLanguage(storedLanguage);
    } catch (e) {
      return null;
    }
  };

export { fetchWeather, storeData, getData };