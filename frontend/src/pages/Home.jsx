import { useState } from "react";
import Login from "../components/authentication/Login";
import Register from "../components/authentication/Register";
import "../components/styles/Home.css";

const Home = () => {
  const [showLogin, setShowLogin] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = (toLogin) => {
    setIsAnimating(true);
    setTimeout(() => {
      setShowLogin(toLogin);
      setIsAnimating(false);
    }, 200);
  };

  return (
    <div className="home-wrapper">
      <div className="glass-text">ChatRealm</div>
      <div
        className={`glass-form-container ${
          isAnimating ? "fade-out" : "fade180"
        }`}
      >
        <div className="logo-title">
          <h1>Welcome to ChatRealm</h1>
        </div>

        <div className="form-toggle-buttons">
          <button
            className={showLogin ? "active" : ""}
            onClick={() => handleToggle(true)}
          >
            Login
          </button>
          <button
            className={!showLogin ? "active" : ""}
            onClick={() => handleToggle(false)}
          >
            Register
          </button>
        </div>

        <div className="auth-form-content">
          {showLogin ? (
            <Login toggleForm={() => handleToggle(false)} />
          ) : (
            <Register toggleForm={() => handleToggle(true)} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
