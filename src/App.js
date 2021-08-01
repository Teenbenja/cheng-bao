// import { MainContext } from './Helpers/Context'
import { BrowserRouter as Router, Route } from "react-router-dom";

import Login from './Pages/Login'
import Main from './Pages/Main'
import PrivateRoute from './Components/PrivateRoute'


function App() {
  return (
    // <MainContext.Provider >
      <Router>
        <Route path="/login" exact render={(props) => <Login />} />
        <PrivateRoute path="/" exact>
          <Main />
        </PrivateRoute>
      </Router>
    // </MainContext.Provider>
  );
}

export default App;
