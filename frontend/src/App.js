import {BrowserRouter, Route, Routes, Link, Navigate} from "react-router-dom";
import Home from "./components/Home/Home";
import RegisterPage from "./components/Profile/RegisterPage";
import LoginPage from "./components/Profile/LoginPage";
import UserProfile from "./components/Profile/UserProfile";
import PersonalizGoals from "./components/Profile/PersonalizGoals";
import Reels from "./components/Reels/OtherUserPostsPage";

function App() {
  return (
    <BrowserRouter>
      <div>
        {/* Routes Section */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/RegisterPage" element={<RegisterPage />} />
          <Route path="/LoginPage" element={<LoginPage />} />
          {/*<Route path="/login" element={<Navigate to="/UserProfile" />} />*/}
          <Route path="/UserProfile" element={<UserProfile />} />
          <Route path="/PersonalizGoals" element={<PersonalizGoals />} />
          <Route path="/reels" element={<Reels />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
