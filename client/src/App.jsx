import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useParams,
  useNavigate
} from "react-router-dom";
import "./index.css";

const API = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const internships = [
  "Web Development Intern",
  "Java Developer Intern",
  "Python Developer Intern",
  "Data Analyst Intern"
];

function Header() {
  return (
    <header>
      <Link to="/" className="logo">InternConnect</Link>
      <Link to="/">Available Internships</Link>
    </header>
  );
}

function Home() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API}/api/internships`)
      .then(async response => {
        if (!response.ok) throw new Error("Unable to load internships");
        return response.json();
      })
      .then(setItems)
      .catch(() => setError("Unable to connect to the backend."));
  }, []);

  return (
    <main className="container">
      <section className="hero">
        <h1>Student Internship Portal</h1>
        <p>Discover opportunities and begin your career journey.</p>
      </section>

      <h2>Available Internships</h2>
      {error && <p className="error">{error}</p>}

      <div className="grid">
        {items.map(item => (
          <article className="card" key={item.id}>
            <h3>{item.title}</h3>
            <p>{item.company}</p>
            <p>Duration: {item.duration}</p>
            <p>Location: {item.location}</p>
            <Link className="button" to={`/internships/${item.id}`}>
              View Details
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}

function Details() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setItem(null);
    setError("");

    fetch(`${API}/api/internships/${id}`)
      .then(async response => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        return data;
      })
      .then(setItem)
      .catch(err => setError(err.message || "Request failed"));
  }, [id]);

  if (error) return <main className="container">
    <p className="error">{error}</p>
    <Link to="/">Back to internships</Link>
  </main>;

  if (!item) return <main className="container">Loading...</main>;

  return (
    <main className="container card">
      <Link to="/">← Back to internships</Link>
      <h1>{item.title}</h1>
      <p><strong>Company:</strong> {item.company}</p>
      <p><strong>Duration:</strong> {item.duration}</p>
      <p><strong>Location:</strong> {item.location}</p>
      <p>{item.description}</p>
      <Link className="button" to={`/apply/${item.id}`}>
        Apply Now
      </Link>
    </main>
  );
}

function ApplicationForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    studentName: "",
    email: "",
    rollNumber: "",
    internship: ""
  });

  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) {
      setForm(old => ({ ...old, internship: "" }));
      return;
    }

    fetch(`${API}/api/internships/${id}`)
      .then(async response => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        return data;
      })
      .then(item => {
        setForm(old => ({ ...old, internship: item.title }));
      })
      .catch(err => setMessage(err.message || "Unable to load internship"));
  }, [id]);

  function handleChange(event) {
    setForm(old => ({
      ...old,
      [event.target.name]: event.target.value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setSuccess(false);

    if (form.studentName.trim().length < 2) {
      setMessage("Name must contain at least 2 characters.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setMessage("Enter a valid email address.");
      return;
    }

    if (!form.rollNumber.trim()) {
      setMessage("Roll number is required.");
      return;
    }

    if (!internships.includes(form.internship)) {
      setMessage("Select a valid internship.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API}/api/applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          studentName: form.studentName.trim(),
          email: form.email.trim(),
          rollNumber: form.rollNumber.trim()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Application failed.");
      }

      setSuccess(true);
      setMessage(data.message);
      setForm({
        studentName: "",
        email: "",
        rollNumber: "",
        internship: ""
      });
    } catch (err) {
      setMessage(err.message || "Unable to submit application.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container form-container">
      <Link to="/">← Back to internships</Link>
      <h1>Apply for an Internship</h1>

      {message && (
        <p className={success ? "success" : "error"} role="status">
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <label htmlFor="studentName">Student Name</label>
        <input
          id="studentName"
          name="studentName"
          value={form.studentName}
          onChange={handleChange}
          minLength={2}
          maxLength={100}
          required
          placeholder="Enter your name"
        />

        <label htmlFor="email">Email ID</label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          placeholder="Enter your email"
        />

        <label htmlFor="rollNumber">Roll Number</label>
        <input
          id="rollNumber"
          name="rollNumber"
          value={form.rollNumber}
          onChange={handleChange}
          maxLength={30}
          required
          placeholder="Enter your roll number"
        />

        <label htmlFor="internship">Selected Internship</label>
        <select
          id="internship"
          name="internship"
          value={form.internship}
          onChange={handleChange}
          required
        >
          <option value="">Select an internship</option>
          {internships.map(name => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>

        <button className="button" type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Application"}
        </button>
      </form>

      <button
        type="button"
        className="secondary-button"
        onClick={() => navigate("/")}
      >
        View Internships
      </button>
    </main>
  );
}

function NotFound() {
  return (
    <main className="container">
      <h1>Page not found</h1>
      <Link to="/">Return home</Link>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/internships/:id" element={<Details />} />
        <Route path="/apply" element={<ApplicationForm />} />
        <Route path="/apply/:id" element={<ApplicationForm />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <footer>Student Internship Portal © 2026</footer>
    </BrowserRouter>
  );
}