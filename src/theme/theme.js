const lightTheme = {
  dark: false,
  colors: {
    primary: '#00C26F', // Primary color
    onPrimary: '#FFFFFF', // Color used on primary elements (like text)
    primaryDark: '#004C62', // Dark variant of primary
    dark: '#3E3E3E', // Dark color
    darkLight: '#E1E1E1', // Lighter variant of dark color
    gray: '#9E9E9E', // Gray color
    text: '#494949', // Text color
    background: '#FFFFFF', // Background color
    surface: '#F5F5F5', // Surface elements (like cards, modals)
    onSurface: '#1D1D1D', // Text color used on surface
    error: '#E44A44', // Error color (for error messages, etc.)
    onError: '#FFFFFF', // Color used on error background
    buttonBackground: 'rgba(0,0,0,0.07)',
    placeHolderTextcolor: '#7C7C7C',
  },
};

const darkTheme = {
  dark: true,
  colors: {
    primary: '#00C26F', // Primary color
    onPrimary: '#004C62', // Color used on primary elements in dark mode
    primaryDark: '#004C62', // Dark variant of primary
    dark: '#3E3E3E', // Dark color
    darkLight: '#E1E1E1', // Lighter variant of dark color
    gray: '#9E9E9E', // Gray color
    text: '#E1E1E1', // Light text color for dark theme
    background: '#1C1B1F', // Dark background color
    surface: '#121212', // Surface color for dark elements
    onSurface: '#E1E1E1', // Text color on surface for dark theme
    error: '#F87171', // Lighter error color for dark mode
    onError: '#601410', // Color used on error background in dark theme
    buttonBackground: 'rgba(255, 255, 255, 0.1)',
    placeHolderTextcolor: '#A3A3A3',
  },
};

export {lightTheme, darkTheme};
