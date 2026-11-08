import React, { useMemo, useState } from 'react';
import { Icon } from '../components/ui/Icon';
import {
  Card,
  Drawer,
  Modal,
  PageHeader,
  SegmentedControl,
  StatItem,
} from '../components/ui/Primitives';
import { SAMPLE_CV_TEXTS } from '../data/enterpriseData';
import {
  addCandidateFromCV,
  analyzeCvMatch,
  scheduleInterview,
  submitCandidateScorecard,
  updateCandidateStage,
  useEnterpriseStore,
} from '../store/enterpriseStore';
import {
  CandidateEvaluationScorecard,
  CandidateProfile,
  JobOpening,
  PipelineStage,
} from '../types';

const PIPELINE_STAGES: PipelineStage[] = [
  'Applied',
  'Screening',
  '1st Round',
  'Skill Assessment',
  'Final Interview',
  'Offer Sent',
  'Hired',
];

export const HrInterviewPage: React.FC = () => {
  const store = useEnterpriseStore();
  const [activeTab, setActiveTab] = useState<'pipeline' | 'analyzer' | 'jobs'>('pipeline');
  const [stageFilter, setStageFilter] = useState<'All' | PipelineStage>('All');
  const [jobFilter, setJobFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected candidate for detail drawer
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateProfile | null>(null);

  // Interview Schedule Modal
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [interviewForm, setInterviewForm] = useState({
    date: '2026-11-09',
    time: '03:00 PM',
    mode: 'In-Person (Gulshan Flagship)' as 'In-Person (Gulshan Flagship)' | 'Zoom Video Call',
    interviewersText: 'Hasib (Creative Director), Farzana (HR)',
  });

  // Scorecard Evaluation Modal
  const [scorecardModalOpen, setScorecardModalOpen] = useState(false);
  const [scorecardForm, setScorecardForm] = useState<CandidateEvaluationScorecard>({
    communication: 5,
    technicalKnowledge: 4,
    salesAgility: 5,
    leadership: 4,
    culturalFit: 5,
    evaluatorNotes: 'Deep understanding of slow artisanal retail, customer engagement, and team motivation.',
    decision: 'Hire',
    evaluatedAt: new Date().toISOString().split('T')[0],
    evaluator: 'Hasib (Creative Director)',
  });

  // -------------------------------------------------------------
  // CV Checker & Resume Parser Playground State
  // -------------------------------------------------------------
  const [selectedJobId, setSelectedJobId] = useState<string>(store.jobs[0]?.id || 'JOB-MGR-01');
  const [resumeText, setResumeText] = useState<string>(SAMPLE_CV_TEXTS.sample1.text);
  const [candidateNameInput, setCandidateNameInput] = useState('Nayeemul Hassan');
  const [candidateEmailInput, setCandidateEmailInput] = useState('nayeemul.h@gmail.com');
  const [candidatePhoneInput, setCandidatePhoneInput] = useState('+880 1718-223344');
  const [analysisResult, setAnalysisResult] = useState<{
    score: number;
    matchedSkills: string[];
    missingSkills: string[];
    matchedKeywords: string[];
    summary: string;
  } | null>(() => analyzeCvMatch(SAMPLE_CV_TEXTS.sample1.text, store.jobs[0]?.id || 'JOB-MGR-01'));

  // Metrics
  const totalApplicants = store.candidates.length;
  const inInterviewCount = useMemo(
    () =>
      store.candidates.filter(
        (c) =>
          c.stage === '1st Round' ||
          c.stage === 'Skill Assessment' ||
          c.stage === 'Final Interview'
      ).length,
    [store.candidates]
  );
  const hiredCount = useMemo(
    () => store.candidates.filter((c) => c.stage === 'Hired' || c.stage === 'Offer Sent').length,
    [store.candidates]
  );
  const avgMatchScore = useMemo(() => {
    if (store.candidates.length === 0) return 85;
    const sum = store.candidates.reduce((acc, c) => acc + c.matchScorePct, 0);
    return Math.round(sum / store.candidates.length);
  }, [store.candidates]);

  const filteredCandidates = useMemo(() => {
    return store.candidates.filter((c) => {
      const matchStage = stageFilter === 'All' || c.stage === stageFilter;
      const matchJob = jobFilter === 'All' || c.jobId === jobFilter;
      const matchQuery =
        !searchQuery ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.previousCompany.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStage && matchJob && matchQuery;
    });
  }, [store.candidates, stageFilter, jobFilter, searchQuery]);

  const handleRunAnalysis = () => {
    if (!resumeText.trim()) return;
    const result = analyzeCvMatch(resumeText, selectedJobId);
    setAnalysisResult(result);
  };

  const handleEnrollAnalyzedCandidate = () => {
    if (!analysisResult) return;
    const job = store.jobs.find((j) => j.id === selectedJobId) || store.jobs[0];

    const newCandidate = addCandidateFromCV({
      name: candidateNameInput || 'New Applicant',
      email: candidateEmailInput || 'applicant@example.com',
      phone: candidatePhoneInput || '+880 1700-000000',
      jobId: job.id,
      jobTitle: job.title,
      stage: 'Screening',
      cvFileName: `${(candidateNameInput || 'Candidate').replace(/\s+/g, '_')}_Resume.pdf`,
      matchScorePct: analysisResult.score,
      matchedSkills: analysisResult.matchedSkills,
      missingSkills: analysisResult.missingSkills,
      yearsExperience: 3,
      education: 'BBA / Equivalent Degree',
      previousCompany: 'Retail / Fashion Sector',
      summary: analysisResult.summary,
    });

    setSelectedCandidate(newCandidate);
    setActiveTab('pipeline');
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCandidate) {
      const interviewers = interviewForm.interviewersText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      scheduleInterview(selectedCandidate.id, {
        date: interviewForm.date,
        time: interviewForm.time,
        mode: interviewForm.mode,
        interviewers,
      });
      const updated = store.candidates.find((c) => c.id === selectedCandidate.id);
      if (updated) setSelectedCandidate(updated);
      setScheduleModalOpen(false);
    }
  };

  const handleScorecardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCandidate) {
      submitCandidateScorecard(selectedCandidate.id, scorecardForm);
      const updated = store.candidates.find((c) => c.id === selectedCandidate.id);
      if (updated) setSelectedCandidate(updated);
      setScorecardModalOpen(false);
    }
  };

  return (
    <div className="hr-interview-page" data-in>
      <PageHeader
        title={['HR', 'Interviews', '&', 'CV', 'Checker']}
        stats={
          <>
            <StatItem
              icon="users"
              value={totalApplicants}
              label="Candidates in Talent Pipeline"
              fmt={(v) => `${v} applicants`}
            />
            <StatItem
              icon="calendar"
              value={inInterviewCount}
              label="Interviews in Active Rounds"
              fmt={(v) => `${v} ongoing`}
            />
            <StatItem
              icon="award"
              value={hiredCount}
              label="Offers Extended & Hired"
              fmt={(v) => `${v} talent`}
            />
            <StatItem
              icon="fileCheck"
              value={avgMatchScore}
              label="Average Candidate Fit Score"
              fmt={(v) => `${v}% match`}
            />
          </>
        }
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => setActiveTab('jobs')}
            >
              <Icon name="briefcase" size={15} /> Job Openings
            </button>
            <button
              type="button"
              className="btn btn--ink btn--sm"
              onClick={() => setActiveTab('analyzer')}
            >
              <Icon name="fileCheck" size={15} /> Open CV Checker
            </button>
          </div>
        }
      />

      {/* Tabs */}
      <div className="toolbar">
        <SegmentedControl
          label="HR Subsections"
          value={activeTab}
          options={[
            { id: 'pipeline', label: `Candidate Pipeline (${store.candidates.length})` },
            { id: 'analyzer', label: 'Interactive CV Checker' },
            { id: 'jobs', label: `Active Openings (${store.jobs.length})` },
          ]}
          onChange={(tab) => setActiveTab(tab)}
        />
        <div className="toolbar__spacer" />
        <div className="search">
          <Icon name="search" />
          <input
            type="search"
            placeholder="Search candidates, skills, jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. Candidate Pipeline View                                    */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'pipeline' && (
        <div className="space-y-4">
          <div className="chips">
            <span className="text-xs font-semibold text-muted self-center mr-2">Filter Stage:</span>
            {(['All', ...PIPELINE_STAGES] as const).map((st) => (
              <button
                key={st}
                type="button"
                className="chip"
                aria-pressed={stageFilter === st}
                onClick={() => setStageFilter(st)}
              >
                {st}
                {st !== 'All' && (
                  <span className="ml-1 text-2xs opacity-70">
                    ({store.candidates.filter((c) => c.stage === st).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCandidates.map((cand) => (
              <Card
                key={cand.id}
                className="hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div onClick={() => setSelectedCandidate(cand)} className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-base text-text">{cand.name}</h3>
                      <p className="text-xs text-muted mt-0.5">{cand.jobTitle}</p>
                    </div>
                    <span
                      className={`badge font-mono text-2xs font-bold ${
                        cand.matchScorePct >= 90
                          ? 'badge--teal'
                          : cand.matchScorePct >= 75
                          ? 'badge--coral'
                          : 'badge--plain'
                      }`}
                    >
                      {cand.matchScorePct}% Match
                    </span>
                  </div>

                  <div className="bg-well rounded-xl p-3 text-xs space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-muted">Experience:</span>
                      <span className="font-semibold">{cand.yearsExperience} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Education:</span>
                      <span className="font-medium text-right line-clamp-1 max-w-[170px]">
                        {cand.education}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Previous Org:</span>
                      <span className="font-medium text-right line-clamp-1 max-w-[170px]">
                        {cand.previousCompany}
                      </span>
                    </div>
                  </div>

                  {/* Skills Match Snapshot */}
                  <div>
                    <span className="text-2xs font-semibold text-muted block mb-1">
                      Matched Competencies ({cand.matchedSkills.length})
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {cand.matchedSkills.slice(0, 4).map((sk) => (
                        <span
                          key={sk}
                          className="bg-teal/15 text-teal text-2xs px-2 py-0.5 rounded-full font-semibold"
                        >
                          {sk}
                        </span>
                      ))}
                      {cand.matchedSkills.length > 4 && (
                        <span className="bg-well text-muted text-2xs px-1.5 py-0.5 rounded-full">
                          +{cand.matchedSkills.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  {cand.scheduledInterview && (
                    <div className="bg-sky/20 rounded-xl p-2.5 text-xs text-ink flex items-center justify-between">
                      <span className="flex items-center gap-1 font-semibold">
                        <Icon name="calendar" size={13} /> {cand.scheduledInterview.date} @{' '}
                        {cand.scheduledInterview.time}
                      </span>
                      <span className="text-2xs opacity-80">{cand.scheduledInterview.mode.split(' ')[0]}</span>
                    </div>
                  )}

                  {cand.scorecard && (
                    <div className="bg-good/15 rounded-xl p-2.5 text-xs flex items-center justify-between">
                      <span className="text-good font-bold flex items-center gap-1">
                        <Icon name="check" size={13} /> Scorecard: {cand.scorecard.decision}
                      </span>
                      <span className="text-2xs text-muted">{cand.scorecard.evaluatedAt}</span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-line flex items-center justify-between text-xs mt-3">
                  <select
                    className="text-2xs font-semibold px-2 py-1 bg-well rounded-lg border border-line outline-none cursor-pointer"
                    value={cand.stage}
                    onChange={(e) =>
                      updateCandidateStage(cand.id, e.target.value as PipelineStage)
                    }
                  >
                    {PIPELINE_STAGES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      className="btn btn--ghost btn--sm py-1 px-2.5 text-2xs"
                      onClick={() => {
                        setSelectedCandidate(cand);
                        setScheduleModalOpen(true);
                      }}
                    >
                      Interview
                    </button>
                    <button
                      type="button"
                      className="btn btn--ink btn--sm py-1 px-2.5 text-2xs"
                      onClick={() => {
                        setSelectedCandidate(cand);
                        setScorecardModalOpen(true);
                      }}
                    >
                      Evaluate
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. Interactive CV Checker & Resume Parser Playground          */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'analyzer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Input & Resume Text */}
          <div className="lg:col-span-6 space-y-4">
            <Card
              title="Resume & Job Requirement Input"
              sub="Paste candidate CV text or select pre-loaded candidate samples"
              tools={
                <div className="flex items-center gap-2">
                  <span className="text-2xs text-muted font-semibold">Load Sample:</span>
                  <select
                    className="text-2xs font-semibold px-2 py-1 bg-well rounded-lg border border-line outline-none"
                    onChange={(e) => {
                      const sample = SAMPLE_CV_TEXTS[e.target.value];
                      if (sample) {
                        setResumeText(sample.text);
                        const matchJob = store.jobs.find((j) => j.title === sample.jobTitle);
                        if (matchJob) setSelectedJobId(matchJob.id);
                        if (e.target.value === 'sample1') {
                          setCandidateNameInput('Nayeemul Hassan');
                          setCandidateEmailInput('nayeemul.h@gmail.com');
                        } else if (e.target.value === 'sample2') {
                          setCandidateNameInput('Moumita Sarker');
                          setCandidateEmailInput('moumita.s@outlook.com');
                        } else {
                          setCandidateNameInput('Kabir Hossain Junior');
                          setCandidateEmailInput('kabir.jr@example.com');
                        }
                      }
                    }}
                  >
                    <option value="sample1">Sample 1: Retail Manager (94%)</option>
                    <option value="sample2">Sample 2: Sales Stylist (88%)</option>
                    <option value="sample3">Sample 3: Junior Associate (55%)</option>
                  </select>
                </div>
              }
            >
              <div className="space-y-3">
                <div className="field">
                  <label className="field__label">Target Atelier Opening</label>
                  <select
                    className="input"
                    value={selectedJobId}
                    onChange={(e) => setSelectedJobId(e.target.value)}
                  >
                    {store.jobs.map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.title} ({j.department})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="field">
                    <label className="field__label">Candidate Name</label>
                    <input
                      type="text"
                      className="input"
                      value={candidateNameInput}
                      onChange={(e) => setCandidateNameInput(e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label className="field__label">Email</label>
                    <input
                      type="email"
                      className="input"
                      value={candidateEmailInput}
                      onChange={(e) => setCandidateEmailInput(e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label className="field__label">Phone</label>
                    <input
                      type="text"
                      className="input"
                      value={candidatePhoneInput}
                      onChange={(e) => setCandidatePhoneInput(e.target.value)}
                    />
                  </div>
                </div>

                <div className="field">
                  <div className="flex justify-between items-center mb-1">
                    <label className="field__label">CV / Resume Text Body</label>
                    <span className="text-2xs text-muted">
                      {resumeText.split(/\s+/).filter(Boolean).length} words
                    </span>
                  </div>
                  <textarea
                    className="input h-64 font-mono text-xs py-2 leading-relaxed"
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="btn btn--ghost btn--sm cursor-pointer flex items-center gap-1.5 text-xs">
                    <Icon name="upload" size={14} /> Upload PDF/DOCX (Simulated)
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setCandidateNameInput(file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '));
                          setResumeText(
                            `PARSED FROM FILE: ${file.name}\n\nCandidate Profile: ${file.name}\nExperience in Luxury Fashion Retail, Store Merchandising, and Customer Service.\nSkills: Retail Operations, POS Systems, Luxury Clienteling, Inventory Control.`
                          );
                        }
                      }}
                    />
                  </label>
                  <button
                    type="button"
                    className="btn btn--ink btn--sm flex items-center gap-2"
                    onClick={handleRunAnalysis}
                  >
                    <Icon name="fileCheck" size={16} /> Analyze & Match CV
                  </button>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: Live Analysis Breakdown */}
          <div className="lg:col-span-6 space-y-4">
            {analysisResult ? (
              <Card
                title="CV Match Scorecard & Keyword Breakdown"
                sub={`Scored against ${
                  store.jobs.find((j) => j.id === selectedJobId)?.title || 'Job Opening'
                }`}
                tools={
                  <button
                    type="button"
                    className="btn btn--ink btn--sm"
                    onClick={handleEnrollAnalyzedCandidate}
                  >
                    <Icon name="plus" size={14} /> Enroll in Pipeline
                  </button>
                }
              >
                <div className="space-y-4">
                  {/* Big Circular / Radial Meter */}
                  <div className="bg-well rounded-2xl p-4 flex items-center gap-6">
                    <div className="text-center">
                      <div
                        className={`text-4xl font-extrabold font-mono tracking-tight ${
                          analysisResult.score >= 85
                            ? 'text-good'
                            : analysisResult.score >= 70
                            ? 'text-coral'
                            : 'text-bad'
                        }`}
                      >
                        {analysisResult.score}%
                      </div>
                      <span className="text-2xs font-semibold text-muted uppercase tracking-wider block mt-0.5">
                        Role Fit Match
                      </span>
                    </div>

                    <div className="space-y-1 flex-1">
                      <p className="text-xs text-text leading-relaxed font-medium">
                        {analysisResult.summary}
                      </p>
                      <div className="w-full h-2 bg-line rounded-full overflow-hidden mt-2">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            analysisResult.score >= 85
                              ? 'bg-good'
                              : analysisResult.score >= 70
                              ? 'bg-coral'
                              : 'bg-bad'
                          }`}
                          style={{ width: `${analysisResult.score}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Matched Required Skills */}
                  <div>
                    <h4 className="text-xs font-bold text-good uppercase tracking-wider flex items-center gap-1.5 mb-2">
                      <Icon name="check" size={14} /> Matched Core Competencies (
                      {analysisResult.matchedSkills.length})
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {analysisResult.matchedSkills.map((sk) => (
                        <span
                          key={sk}
                          className="bg-good/15 text-good border border-good/20 text-xs px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1"
                        >
                          ✓ {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Missing Required Skills */}
                  {analysisResult.missingSkills.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-coral uppercase tracking-wider flex items-center gap-1.5 mb-2">
                        <Icon name="alert" size={14} /> Missing / Gap Requirements (
                        {analysisResult.missingSkills.length})
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {analysisResult.missingSkills.map((sk) => (
                          <span
                            key={sk}
                            className="bg-coral/15 text-coral border border-coral/20 text-xs px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1"
                          >
                            ✕ {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Extracted Industry Keywords */}
                  <div className="pt-2 border-t border-line">
                    <h4 className="text-xs font-bold text-text uppercase tracking-wider mb-2">
                      Detected Keywords ({analysisResult.matchedKeywords.length})
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {analysisResult.matchedKeywords.map((kw) => (
                        <span
                          key={kw}
                          className="bg-well text-muted text-2xs px-2 py-0.5 rounded-md font-mono"
                        >
                          #{kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ) : (
              <Card title="Candidate Fit Results">
                <div className="empty">
                  <Icon name="fileCheck" size={32} />
                  <h4 className="empty__title">No CV Analyzed Yet</h4>
                  <p className="empty__text">
                    Select a sample resume on the left or paste your own applicant text to inspect
                    live keyword and competency match scores.
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. Job Openings View                                          */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'jobs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {store.jobs.map((job) => {
            const applicantCount = store.candidates.filter((c) => c.jobId === job.id).length;
            return (
              <Card
                key={job.id}
                title={
                  <div className="flex justify-between items-start w-full">
                    <div>
                      <span className="badge badge--plain text-2xs mb-1">{job.department}</span>
                      <h3 className="font-bold text-base text-text">{job.title}</h3>
                    </div>
                    <span className="badge badge--teal text-xs">
                      {job.vacancies} {job.vacancies === 1 ? 'Vacancy' : 'Vacancies'}
                    </span>
                  </div>
                }
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs text-muted">
                    <span className="flex items-center gap-1">
                      <Icon name="home" size={13} /> {job.location}
                    </span>
                    <span>•</span>
                    <span>Min. {job.minExperienceYears}+ yrs experience</span>
                  </div>

                  <div className="bg-well rounded-xl p-3 space-y-2 text-xs">
                    <span className="font-bold text-text block">Required Core Competencies:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {job.requiredSkills.map((sk) => (
                        <span
                          key={sk}
                          className="bg-float text-text px-2 py-0.5 rounded-lg border border-line text-2xs font-semibold"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-line text-xs">
                    <span className="text-muted font-medium">
                      {applicantCount} candidates in pipeline
                    </span>
                    <button
                      type="button"
                      className="btn btn--ghost btn--sm py-1 px-3 text-2xs"
                      onClick={() => {
                        setSelectedJobId(job.id);
                        setActiveTab('analyzer');
                      }}
                    >
                      Run CV Checker for this Role
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* Candidate Detail Drawer                                       */}
      {/* ------------------------------------------------------------- */}
      <Drawer
        open={Boolean(selectedCandidate)}
        onClose={() => setSelectedCandidate(null)}
        title={selectedCandidate?.name || 'Applicant Profile'}
        sub={selectedCandidate ? `${selectedCandidate.jobTitle} • ${selectedCandidate.stage}` : ''}
        foot={
          selectedCandidate && (
            <div className="flex items-center justify-between w-full">
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={() => setScheduleModalOpen(true)}
              >
                <Icon name="calendar" size={14} /> Schedule Interview
              </button>
              <button
                type="button"
                className="btn btn--ink btn--sm"
                onClick={() => setScorecardModalOpen(true)}
              >
                <Icon name="award" size={14} /> Evaluation Scorecard
              </button>
            </div>
          )
        }
      >
        {selectedCandidate && (
          <div className="space-y-4">
            <div className="bg-well rounded-2xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted">Applied Date: {selectedCandidate.appliedDate}</span>
                <span
                  className={`badge font-mono text-xs font-bold ${
                    selectedCandidate.matchScorePct >= 90 ? 'badge--teal' : 'badge--coral'
                  }`}
                >
                  {selectedCandidate.matchScorePct}% Match Score
                </span>
              </div>

              <div className="text-xs space-y-1">
                <div className="flex items-center gap-2 text-muted">
                  <Icon name="mail" size={13} /> {selectedCandidate.email}
                </div>
                <div className="flex items-center gap-2 text-muted">
                  <Icon name="phone" size={13} /> {selectedCandidate.phone}
                </div>
              </div>

              <div className="pt-2 border-t border-line text-xs space-y-1">
                <p>
                  <strong className="text-muted">Education:</strong> {selectedCandidate.education}
                </p>
                <p>
                  <strong className="text-muted">Past Experience:</strong>{' '}
                  {selectedCandidate.previousCompany} ({selectedCandidate.yearsExperience} yrs)
                </p>
              </div>

              <div className="pt-2 border-t border-line text-xs">
                <span className="font-bold text-muted block mb-1">Resume Summary:</span>
                <p className="text-text leading-relaxed">{selectedCandidate.summary}</p>
              </div>
            </div>

            {/* Competency Tags */}
            <div>
              <h4 className="text-xs font-bold text-good uppercase tracking-wider mb-2">
                Matched Skills ({selectedCandidate.matchedSkills.length})
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedCandidate.matchedSkills.map((sk) => (
                  <span
                    key={sk}
                    className="bg-good/15 text-good border border-good/20 text-xs px-2.5 py-1 rounded-lg font-semibold"
                  >
                    ✓ {sk}
                  </span>
                ))}
              </div>
            </div>

            {selectedCandidate.missingSkills.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-coral uppercase tracking-wider mb-2">
                  Missing Requirements ({selectedCandidate.missingSkills.length})
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCandidate.missingSkills.map((sk) => (
                    <span
                      key={sk}
                      className="bg-coral/15 text-coral border border-coral/20 text-xs px-2.5 py-1 rounded-lg font-semibold"
                    >
                      ✕ {sk}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Scorecard Display if evaluated */}
            {selectedCandidate.scorecard && (
              <div className="bg-well rounded-2xl p-4 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-text uppercase tracking-wider">
                    Scorecard Evaluation
                  </h4>
                  <span className="badge badge--teal text-xs font-bold">
                    {selectedCandidate.scorecard.decision}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <span className="text-muted">Communication:</span>{' '}
                    <b>{selectedCandidate.scorecard.communication} / 5</b>
                  </div>
                  <div>
                    <span className="text-muted">Technical / Retail:</span>{' '}
                    <b>{selectedCandidate.scorecard.technicalKnowledge} / 5</b>
                  </div>
                  <div>
                    <span className="text-muted">Sales Agility:</span>{' '}
                    <b>{selectedCandidate.scorecard.salesAgility} / 5</b>
                  </div>
                  <div>
                    <span className="text-muted">Leadership:</span>{' '}
                    <b>{selectedCandidate.scorecard.leadership} / 5</b>
                  </div>
                  <div>
                    <span className="text-muted">Cultural Fit:</span>{' '}
                    <b>{selectedCandidate.scorecard.culturalFit} / 5</b>
                  </div>
                </div>
                <p className="pt-2 border-t border-line text-xs italic text-muted">
                  "{selectedCandidate.scorecard.evaluatorNotes}" —{' '}
                  <span className="font-semibold">{selectedCandidate.scorecard.evaluator}</span>
                </p>
              </div>
            )}
          </div>
        )}
      </Drawer>

      {/* ------------------------------------------------------------- */}
      {/* Schedule Interview Modal                                      */}
      {/* ------------------------------------------------------------- */}
      <Modal
        open={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        title={`Schedule Interview — ${selectedCandidate?.name || 'Candidate'}`}
      >
        <form onSubmit={handleScheduleSubmit} className="mform">
          <div className="grid grid-cols-2 gap-3">
            <div className="field">
              <label className="field__label">Interview Date</label>
              <input
                type="date"
                className="input"
                required
                value={interviewForm.date}
                onChange={(e) => setInterviewForm({ ...interviewForm, date: e.target.value })}
              />
            </div>
            <div className="field">
              <label className="field__label">Time Slot</label>
              <input
                type="text"
                className="input"
                required
                placeholder="03:00 PM"
                value={interviewForm.time}
                onChange={(e) => setInterviewForm({ ...interviewForm, time: e.target.value })}
              />
            </div>
          </div>

          <div className="field">
            <label className="field__label">Meeting Mode & Location</label>
            <select
              className="input"
              value={interviewForm.mode}
              onChange={(e) =>
                setInterviewForm({
                  ...interviewForm,
                  mode: e.target.value as 'In-Person (Gulshan Flagship)' | 'Zoom Video Call',
                })
              }
            >
              <option value="In-Person (Gulshan Flagship)">In-Person (Gulshan Flagship Atelier)</option>
              <option value="Zoom Video Call">Zoom Video Conference</option>
            </select>
          </div>

          <div className="field">
            <label className="field__label">Interviewers (Comma-separated)</label>
            <input
              type="text"
              className="input"
              value={interviewForm.interviewersText}
              onChange={(e) =>
                setInterviewForm({ ...interviewForm, interviewersText: e.target.value })
              }
            />
          </div>

          <div className="mform__foot">
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => setScheduleModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn--ink btn--sm">
              Confirm & Notify Candidate
            </button>
          </div>
        </form>
      </Modal>

      {/* ------------------------------------------------------------- */}
      {/* Evaluation Scorecard Modal                                    */}
      {/* ------------------------------------------------------------- */}
      <Modal
        open={scorecardModalOpen}
        onClose={() => setScorecardModalOpen(false)}
        title={`Evaluation Scorecard — ${selectedCandidate?.name || 'Candidate'}`}
      >
        <form onSubmit={handleScorecardSubmit} className="mform">
          <div className="space-y-3">
            {[
              { id: 'communication', label: 'Communication & Poise' },
              { id: 'technicalKnowledge', label: 'Retail / Garment Knowledge' },
              { id: 'salesAgility', label: 'Sales Agility & Client Relations' },
              { id: 'leadership', label: 'Team Leadership & Initiative' },
              { id: 'culturalFit', label: 'Artisanal Cultural Alignment' },
            ].map((crit) => {
              const key = crit.id as keyof CandidateEvaluationScorecard;
              const val = Number(scorecardForm[key]) || 3;
              return (
                <div key={crit.id} className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-text">{crit.label}</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                          star <= val
                            ? 'bg-coral text-on-coral shadow-sm'
                            : 'bg-well text-muted hover:bg-well/80'
                        }`}
                        onClick={() =>
                          setScorecardForm({
                            ...scorecardForm,
                            [key]: star,
                          })
                        }
                      >
                        {star}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="field pt-2">
            <label className="field__label">Evaluator Qualitative Notes</label>
            <textarea
              className="input h-20 py-2"
              required
              value={scorecardForm.evaluatorNotes}
              onChange={(e) =>
                setScorecardForm({ ...scorecardForm, evaluatorNotes: e.target.value })
              }
            />
          </div>

          <div className="field">
            <label className="field__label">Hiring Decision</label>
            <select
              className="input font-bold"
              value={scorecardForm.decision}
              onChange={(e) =>
                setScorecardForm({
                  ...scorecardForm,
                  decision: e.target.value as 'Strong Hire' | 'Hire' | 'Hold' | 'Pass',
                })
              }
            >
              <option value="Strong Hire">Strong Hire (Extend Offer Immediately)</option>
              <option value="Hire">Hire (Standard Approval)</option>
              <option value="Hold">Hold (Keep on Reserve List)</option>
              <option value="Pass">Pass (Reject Candidate)</option>
            </select>
          </div>

          <div className="mform__foot">
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => setScorecardModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn--ink btn--sm">
              Submit Scorecard
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
