import { useNavigate } from "react-router-dom";
import "../assets/login.css";

function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Temporary login
    navigate("/dashboard");
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>School Management System</h1>
        <h3>Admin Login</h3>

        <input type="text" placeholder="Username" />

        <input type="password" placeholder="Password" />

        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}

export default Login;