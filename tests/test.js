// Description: Tests file for the Weather App
// to run the tests, run jest in the terminal
// to run the tests in watch mode, run jest --watch
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CityForecast from '../components/CityForecast';
import Toggles from "../components/Toggles";
import SearchBar from "../components/SearchBar";
import { stringEnglish, stringSpanish } from "../lib/translations";
import { lightTheme, darkTheme } from "../lib/themes";

// Add tests for CityForecast component
describe('CityForecast', () => {
  const mockCityWeather = {
    name: 'San Francisco',
    weather: [{ icon: '01d', description: 'clear sky' }],
    main: { temp: 20, feels_like: 18, temp_min: 18, temp_max: 22, humidity: 50 },
    wind: { speed: 10 },
    rain: 0,
  };

  it('displays the city name and temperature', () => {
    const { getByText } = render(<CityForecast cityWeather={mockCityWeather} />);
    expect(getByText('San Francisco')).toBeDefined();
    expect(getByText('20°C')).toBeDefined();
  });

  it('displays the weather description', () => {
    const { getByText } = render(<CityForecast cityWeather={mockCityWeather} />);
    expect(getByText('clear sky')).toBeDefined();
  });
});

// Add tests for Toggles component
describe("Toggles component", () => {

  // Mock the toggle functions and values
  const mockToggleInfo = {
    toggleTheme:jest.fn(),
    toggleLanguage:jest.fn(),
    language:'english',
    theme:'light',
  };

  // Test that the toggle buttons are displayed
  test("renders the toggle buttons", () => {
    const { getByText } = render(
      <Toggles
      toggleTheme={mockToggleInfo.toggleTheme}
      toggleLanguage={mockToggleInfo.toggleLanguage}
      language={mockToggleInfo.language}
      theme={mockToggleInfo.theme}
    />);
    expect(getByText("Toggle Theme to 🌚")).toBeTruthy();
    expect(getByText("Toggle Language to 🇪🇸")).toBeTruthy();
  });

  // Test that the toggle buttons are displayed in the correct language
  test("displays the correct language toggle button text", () => {
    const { getByText } = render(
      <Toggles
      toggleTheme={mockToggleInfo.toggleTheme}
      toggleLanguage={mockToggleInfo.toggleLanguage}
      language={mockToggleInfo.language}
      theme={mockToggleInfo.theme}
    />);
    expect(getByText("Toggle Language to\n🇪🇸")).toBeTruthy();
  });

  // Test that the toggle buttons are displayed in the correct theme
  test("displays the correct theme toggle button text and emoji", () => {
    const { getByText } = render(
      <Toggles
      toggleTheme={mockToggleInfo.toggleTheme}
      toggleLanguage={mockToggleInfo.toggleLanguage}
      language={mockToggleInfo.language}
      theme={mockToggleInfo.theme}
    />);    
    expect(getByText("Toggle Theme to 🌚")).toBeTruthy();
  });
});

// Add tests for SearchBar component
describe("SearchBar component", () => {
  test("renders the search input with placeholder text", () => {
    const { getByPlaceholderText } = render(<SearchBar language="english" />);
    expect(getByPlaceholderText(stringEnglish.searchPlaceholder)).toBeTruthy();
  });

  test("displays placeholder text in Spanish when language is set to Spanish", () => {
    const { getByPlaceholderText } = render(<SearchBar language="spanish" />);
    expect(getByPlaceholderText(stringSpanish.searchPlaceholder)).toBeTruthy();
  });
});

// mock an unsuccessful fetch response
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: false,
    status: 404,
  })
);