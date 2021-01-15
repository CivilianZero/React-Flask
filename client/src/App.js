import { MuiThemeProvider } from "@material-ui/core";
import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import "./App.css";
import SignupInPage from './pages/SignupIn';
import { theme } from "./themes/theme";



function App() {
	return (
		<MuiThemeProvider theme={theme}>
			<BrowserRouter>
				<Route path="/" component={SignupInPage} />
			</BrowserRouter>
		</MuiThemeProvider>
	);
}

export default App;
