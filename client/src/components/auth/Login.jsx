import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Alert, Button, Card, Form } from "react-bootstrap";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, signInWithGoogle } = useAuth(); // Add signInWithGoogle here
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to sign in. Check your credentials.");
    } finally {
      setLoading(false);
    }
  }

  // Add this new function to handle Google sign-in
  async function handleGoogleSignIn() {
    try {
      setError("");
      setLoading(true);
      
      const { user, firstName, lastName, email } = await signInWithGoogle();
      
      // Create user profile in your database
      const token = await user.getIdToken();
      await createUserProfileFromGoogle(firstName, lastName, email, token);
      
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Failed to sign in with Google");
    } finally {
      setLoading(false);
    }
  }

  // Function to create user profile for Google sign-in
  async function createUserProfileFromGoogle(firstName, lastName, email, token) {
    try {
      const response = await fetch("http://localhost:8080/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email
        })
      });
      
      return await response.json();
    } catch (error) {
      console.error("Error creating user profile:", error);
    }
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">Log In</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="username"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                </Form.Group>

                <Button disabled={loading} className="w-100" type="submit">
                  Log In
                </Button>
              </Form>
              
              {/* Add Google Sign-In Button here */}
              <div className="text-center mt-3">
                <hr className="my-3" />
                <p>OR</p>
                <Button 
                  variant="outline-danger" 
                  className="w-100 d-flex align-items-center justify-content-center" 
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-google me-2" viewBox="0 0 16 16">
                    <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z"/>
                  </svg>
                  Sign in with Google
                </Button>
              </div>
            </Card.Body>
          </Card>
          <div className="w-100 text-center mt-2">
            Need an account? <Link to="/register">Sign Up</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;