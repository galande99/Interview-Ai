import React, { useState,useEffect } from "react";
import "../style/interview.scss";
import { useInterview } from "../hooks/useInterview.js";
import { useNavigate,useParams } from "react-router-dom";

const getSections = (report) => [
  {
    id: "technicalQuestions",
    icon: "<>",
    title: "Technical Questions",
    subtitle: "Deep technical prep",
    count: report?.technicalQuestions?.length ?? 0,
  },
  {
    id: "behaviouralQuestions",
    icon: "🧠",
    title: "Behavioral Questions",
    subtitle: "Soft-skill readiness",
    count: report?.behaviouralQuestions?.length ?? 0,
  },
  {
    id: "preparationPlan",
    icon: "🗺️",
    title: "Road Map",
    subtitle: "Daily study plan",
    count: report?.preparationPlan?.length ?? 0,
  },
];

const severityLabel = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

const Interview = () => {
  const [activeSection, setActiveSection] = useState("technicalQuestions");
  const {report,getReportById,loading,getResumePdf} = useInterview()
  const {interviewId} = useParams()

  useEffect(() => {
    if (interviewId) {
      getReportById(interviewId)
    }
  }, [interviewId])

  const [openQuestionIndex, setOpenQuestionIndex] = useState(0);
  const sections = getSections(report)
  const currentSection = sections.find((section) => section.id === activeSection);
  const sectionCountLabel = currentSection?.id === "preparationPlan" ? `${currentSection.count} days` : `${currentSection?.count} questions`;

  const handleToggleQuestion = (index) => {
    setOpenQuestionIndex((current) => (current === index ? -1 : index));
  };

  const renderQuestions = (questions) => (
    <div className="cards">
      {questions.map((item, index) => {
        const isOpen = openQuestionIndex === index;
        return (
          <article className={`question-card ${isOpen ? "open" : ""}`} key={`${item.question}-${index}`}>
            <div className="card-header">
              <span className="question-badge">Q{index + 1}</span>
              <button
                type="button"
                className={`toggle-icon ${isOpen ? "open" : ""}`}
                onClick={() => handleToggleQuestion(index)}
                aria-expanded={isOpen}
              >
                ▾
              </button>
            </div>
            <h3 className="question-title">{item.question}</h3>
            <div className="question-meta">
              <span className="intent-badge">Intention</span>
              <p className="question-label">{item.intension}</p>
            </div>
            <div className={`answer-block ${isOpen ? "open" : ""}`}>
              <span className="answer-label">Model Answer</span>
              <p className="question-text">{item.answer}</p>
            </div>
          </article>
        );
      })}
    </div>
  );

  const renderPlan = () => (
    <div className="cards">
      {report.preparationPlan.map((item) => (
        <article className="plan-card" key={item.day}>
          <span className="day-pill">Day {item.day}</span>
          <h3 className="question-title">{item.focus}</h3>
          <ul className="plan-tasks">
            {item.tasks.map((task, idx) => (
              <li key={idx}>{task}</li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );


  if (loading || !report) {
    return (
      <main className="loading-screen">Loading your interview plan...</main>
    )
  }

  return (
    <main className="interview-page">
      <section className="interview-header">
        <div>
          <p className="section-pretitle">Interview Review</p>
          <h1 className="interview-title">{report.title}</h1>
          <p className="interview-description">
            A structured interview preparation dashboard with recommended questions, performance score, and an action plan.
          </p>
        </div>
        <div className="score-chip">
          <span>Match Score</span>
          <strong>{report.matchScore}%</strong>
        </div>
      </section>

      <section className="interview-card">
        <div className="interview-grid">
          <aside className="panel sidebar-panel">
            <div className="sidebar-header">
              <h2>Sections</h2>
            </div>
            <div className="nav-list">
              {sections.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  className={`nav-item ${activeSection === section.id ? "active" : ""}`}
                  onClick={() => setActiveSection(section.id)}
                >
                  <span className="nav-icon">{section.icon}</span>
                  <div className="nav-text">
                    <span>{section.title}</span>
                    <small>{section.subtitle}</small>
                  </div>
                  <span className="nav-count">{section.count}</span>
                </button>
              ))}
            </div>
            <button onClick={()=> {getResumePdf(interviewId)}} className="button primary-button">Download Resume</button>

          </aside>
          <main className="panel content-panel">
            <div className="content-topbar">
              <div>
                <h2>{currentSection?.title}</h2>
                <p className="content-subtitle">{currentSection?.subtitle}</p>
              </div>
              <span className="content-counter">{sectionCountLabel}</span>
            </div>
            <div className="content-description">
              <p>
                Review the most important interview questions and answers generated for your role, with focus items and skill gaps visible on the right.
              </p>
            </div>
            {activeSection === "technicalQuestions" && renderQuestions(report.technicalQuestions)}
            {activeSection === "behaviouralQuestions" && renderQuestions(report.behaviouralQuestions)}
            {activeSection === "preparationPlan" && renderPlan()}
          </main>

          <aside className="panel summary-panel">
            <div className="match-panel">
              <span className="match-label">Match Score</span>
              <div className="score-ring">
                <strong>{report.matchScore}%</strong>
              </div>
              <p className="match-note">Strong match for this role</p>
            </div>
            <div className="panel-heading">
              <h2>Skill Gaps</h2>
              <p>Focus areas to strengthen before the next interview.</p>
            </div>
            <div className="skill-list">
              {report.skillGap.map((item) => (
                <div className="skill-tag" key={item.skill}>
                  <span>{item.skill}</span>
                  <span className={`skill-chip ${item.severity}`}>
                    {severityLabel[item.severity] || item.severity}
                  </span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
};

export default Interview;