import HomePage from "./Pages/HomePage";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Chatpage from "./Pages/ChatPage";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/" component={HomePage} exact />
          <Route path="/chats" component={Chatpage} />
        </Switch>
      </Router>
    </div>

  );
}

export default App;