import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../apis/api';
import logo from '../assets/logo.jpeg';

export default function Signup() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [education, setEducation] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [place, setPlace] = useState("");
  const [terms, setTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!name || !age || !education || !email || !password || !phoneNumber || !place || !terms) {
      setError("Please fill all fields and accept terms");
      return;
    }
    setError('');
    setLoading(true);

    try {
      await api.post('/auth/signup', {
        name: name.trim(),
        age: Number(age),
        education: education.trim(),
        email: email.trim(),
        password,
        phoneNumber: phoneNumber.trim(),
        place: place.trim()
      });
      alert("Signup successful! You can now login.");
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.fullPage}>
      <form onSubmit={handleSignup} style={styles.card}>
       <div style={{ textAlign: "center" }}>
 <div style={styles.logoWrapper}>
  <img
    src={logo}
    alt="Bookish Logo"
    style={styles.logo}
  />
</div>

</div>


        <h2 style={styles.title}>Create Account</h2>

        <input style={styles.input} placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} />
        <input style={styles.input} placeholder="Age" type="number" value={age} onChange={e => setAge(e.target.value)} />
        <input style={styles.input} placeholder="Education" value={education} onChange={e => setEducation(e.target.value)} />
        <input style={styles.input} placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
        <input style={styles.input} placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <input style={styles.input} placeholder="Phone Number" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />
        <input style={styles.input} placeholder="Place" value={place} onChange={e => setPlace(e.target.value)} />

        <label style={styles.checkboxLabel}>
          <input type="checkbox" checked={terms} onChange={e => setTerms(e.target.checked)} /> 
          <span style={styles.finePrint}> I agree that if the book is not returned or damaged, a fine will be charged.</span>
        </label>

        {error && <p style={{ color: '#d32f2f', fontSize: '14px', textAlign: 'center' }}>{error}</p>}

        <button style={styles.button} disabled={loading}>
          {loading ? "Signing up..." : "Sign Up"}
        </button>

        <p style={{ textAlign: 'center', fontSize: '14px', color: '#5d4037' }}>
          Already have an account? <span style={styles.link} onClick={() => navigate("/login")}>Login</span>
        </p>
      </form>
    </div>
  );
}

const styles = {
  fullPage: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f0e1', // Warm parchment color
    backgroundImage: "url(/background2.jpg)", // Keeps your background if file exists
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    padding: '20px'
  },
  card: {
    width: '100%',
    maxWidth: '380px',
    padding: '30px',
    borderRadius: '15px',
    background: 'rgba(255, 255, 255, 0.95)',
    boxShadow: '0 10px 30px rgba(93, 64, 55, 0.2)',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  title: { textAlign: "center", color: '#5d4037', margin: '10px 0' },
  input: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #d7ccc8',
    backgroundColor: '#fff',
    fontSize: '14px',
    outline: 'none'
  },


  logoWrapper: {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  overflow: "hidden",   // ✅ VERY IMPORTANT
  width: "200px",
  margin: "0 auto"
},


logo: {
  width: "200px",
  height: "auto",
  display: "block",
  transform: "scale(1.35)", // ✅ crops left & right padding
},


  button: {
    padding: '14px',
    background: '#795548', // Rich Brown
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: '0.3s'
  },
  link: { color: '#8d6e63', cursor: 'pointer', fontWeight: 'bold' },
  checkboxLabel: { display: 'flex', alignItems: 'flex-start', gap: '8px' },
  finePrint: { fontSize: '11px', color: '#8d6e63', lineHeight: '1.4' }
};