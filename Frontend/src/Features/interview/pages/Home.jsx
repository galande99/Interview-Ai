import React, {useState,useRef} from "react";
import "../style/home.scss";
import { useInterview } from "../hooks/useInterview.js";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const {loading ,generateReport,reports} = useInterview()
  const hasReports = Array.isArray(reports)

  const [jobDescription, setJobDescription] = useState("")
  const [selfDescription, setSelfDescription] = useState("")
  const resumeInputRef = useRef()
  const navigate = useNavigate()

  const handleGenerateReport = async () => {
   const resumeFile = resumeInputRef.current?.files?.[0] ?? null
   const data = await generateReport({jobDescription, selfDescription, resumeFile})

   if (!data || !data._id) {
     console.error("Interview generation failed", data)
     return
   }

   navigate(`/interview/${data._id}`)
  }


 if (loading) {
    return (
     <main className="loading-screen">
      <h1>Loading your interview plan...</h1>
     </main>
    );
  }
  return (
    <main className="home-page">
      <section className="home-header">
        <h1 className="title">
          Create Your Custom <span className="highlight">Interview Plan</span>
        </h1>
        <p className="subtitle">
          Let our AI analyze the job requirements and your unique profile to build a winning strategy.
        </p>
      </section>

      <section className="interview-card">
        <div className="card-grid">
          <div className="panel job-panel">
            <div className="section-header">
              <div className="section-info">
                <span className="section-icon">●</span>
                <h2 className="section-title">Target Job Description</h2>
              </div>
              <span className="required-badge">REQUIRED</span>
            </div>
            <textarea
              onChange={(e) => {setJobDescription(e.target.value)}}
              name="jobDescription"
              id="jobDescription"
              className="textarea"
              placeholder="Paste the full job description here... e.g. Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design..."
            />
            <p className="char-count">0 / 3000 chars</p>
          </div>

          <div className="panel profile-panel">
            <div className="section-header">
              <div className="section-info">
                <span className="section-icon">👤</span>
                <h2 className="section-title">Your Profile</h2>
              </div>
            </div>

            <div className="upload-section">
              <div className="upload-label">
                <span>Upload Resume</span>
                <span className="required-tag">Best Results</span>
              </div>

              <label htmlFor="resume" className="file-drop">
                <span className="drop-icon">⇪</span>
                <p className="upload-text">Click to upload or drag & drop</p>
                <p className="upload-subtext">PDF OR DOCX (MAX 5MB)</p>
                <input ref={resumeInputRef} hidden type="file" name="resume" id="resume" accept=".pdf,.docx" />
              </label>
            </div>

            <div className="or-separator">
              <span>OR</span>
            </div>

            <div className="description-section">
              <label htmlFor="selfDescription" className="description-label">
                Quick Self-Description
              </label>
              <textarea
                onChange={(e) => {setSelfDescription(e.target.value)}}
                name="selfDescription"
                id="selfDescription"
                className="textarea description-textarea"
                placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
              />
            </div>

            <div className="validation-info">
              <input type="checkbox" id="validation" name="validation" />
              <label htmlFor="validation">
                Either a <strong>Resume</strong> or a <strong>Self Description</strong> is required to generate a personalized plan.
              </label>
            </div>
          </div>
        </div>

        <div className="cta-section">
          <p className="ai-info">⚡ AI-Powered Strategy Generation • Approx. 30s</p>
          <button onClick={handleGenerateReport} className="generate-btn">
            <span className="btn-icon">⚡</span>
            Generate My Interview Strategy
          </button>
        </div>
      </section>


      {/*recent reports List*/}
      {hasReports && (
        <section className="recent-reports">
          <h2>my Recent Interview Plans</h2>
          <div className="report-list">
            {reports.length > 0 ? (
              reports.map((report) => (
                <li
                  key={report._id || report.id}
                  className="report-item"
                  onClick={() => navigate(`/interview/${report._id || report.id}`)}
                >
                  <h3>{report.title || 'Untitled Position'}</h3>
                  <p className="report-meta">Generate on {new Date(report.createdAt).toLocaleDateString()}</p>
                </li>
              ))
            ) : (
              <div className="report-empty">
                <p>No recent interview plans yet. Once you generate one, it will appear here.</p>
              </div>
            )}
          </div>
        </section>
      )}

      <footer className="home-footer">
        <a href="#privacy">PRIVACY POLICY</a>
        <a href="#terms">TERMS OF SERVICE</a>
        <a href="#help">HELP CENTER</a>
      </footer>
    </main>
  );
};

export default Home;
