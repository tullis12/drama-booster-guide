import { useState, useEffect } from "react";
import Head from "next/head";
import { storage } from "../lib/firebase";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const ROLES = [
  "President","Vice President","Secretary","Treasurer",
  "Event Coordinator","Fundraising Coordinator","Volunteer Coordinator",
  "Committee Chair","Member-at-Large","Other"
];

const TASK_TEMPLATES = {
  "President": {
    "January": ["Set annual booster club goals and priorities", "Schedule board meetings for the year", "Confirm committee assignments", "Meet with Drama Director to align on spring show needs and budget"],
    "February": ["Lead board meeting", "Check in with committee chairs on spring show prep", "Coordinate with school administration on facility use and policies"],
    "March": ["Lead board meeting", "Oversee spring production support (costumes, sets, concessions)", "Represent boosters at school events or PTA meetings"],
    "April": ["Lead board meeting", "Support spring show opening — attend performances", "Send thank you notes to sponsors and major volunteers"],
    "May": ["Lead board meeting", "Coordinate end-of-year banquet or awards ceremony with Drama Director", "Review year-end budget status with Treasurer", "Recognize graduating seniors"],
    "June": ["Lead board meeting or summer check-in", "Debrief on the school year — what worked, what to improve", "Begin planning for fall show season"],
    "July": ["Summer planning meeting if applicable", "Review bylaws and update if needed", "Identify any board vacancies for the fall", "Coordinate with Drama Director on fall show selection and needs"],
    "August": ["Lead back-to-school board meeting", "Finalize fall plans and budgets", "Welcome new booster families at orientation or kickoff event", "Ensure all booster volunteers have completed school volunteer requirements"],
    "September": ["Lead board meeting", "Oversee fall production support", "Attend school open house or back-to-school night to promote boosters"],
    "October": ["Lead board meeting", "Support fall show opening — attend performances", "Coordinate with Fundraising Coordinator on fall campaigns"],
    "November": ["Lead board meeting", "Begin planning for spring show season", "Coordinate nominations for new officers if elections are in spring", "Support holiday fundraising efforts"],
    "December": ["Lead board meeting", "Send year-end thank you to volunteers, sponsors, and Drama Director", "Ensure any tax-year-end business is handled with Treasurer", "Review first semester progress against annual goals"],
  },
  "Vice President": {
    "January": ["Support President in setting annual goals", "Coordinate booster member orientation materials", "Identify board development opportunities"],
    "February": ["Attend and support board meeting", "Step in to lead meetings when President is unavailable", "Serve as liaison between committees"],
    "March": ["Attend and support board meeting", "Help coordinate spring show volunteer needs", "Monitor committee progress and report to President"],
    "April": ["Attend and support board meeting", "Assist with spring show logistics and support", "Support thank you efforts for volunteers"],
    "May": ["Attend and support board meeting", "Help coordinate end-of-year banquet", "Check in with newer booster families"],
    "June": ["Attend summer planning meeting", "Assist President with year-end debrief", "Help plan fall activities"],
    "July": ["Support summer planning efforts", "Review and update booster orientation packet", "Identify potential new booster board candidates"],
    "August": ["Attend and support board meeting", "Help with back-to-school kickoff event", "Mentor newer board members"],
    "September": ["Attend and support board meeting", "Support fall production efforts", "Coordinate with school on any policy updates"],
    "October": ["Attend and support board meeting", "Assist with fall show logistics", "Support fundraising activities"],
    "November": ["Attend and support board meeting", "Support nominations process if applicable", "Help plan spring show season"],
    "December": ["Attend and support board meeting", "Participate in year-end review", "Prepare to assume additional duties if needed for transitions"],
  },
  "Secretary": {
    "January": ["Prepare and distribute annual meeting calendar", "Archive previous year's minutes and records", "Update master contact list for all board members and booster families", "File any required annual reports with state or school district"],
    "February": ["Record and distribute minutes from board meeting", "Update booster family roster with any changes", "Ensure all committees have filed reports"],
    "March": ["Record and distribute minutes from board meeting", "Collect and file committee reports", "Maintain records of all board votes and motions"],
    "April": ["Record and distribute minutes from board meeting", "Document spring show volunteer hours and participation", "Distribute updated bylaws or policies if revised"],
    "May": ["Record and distribute minutes from board meeting", "Prepare any end-of-year compliance filings", "Gather info for end-of-year banquet program"],
    "June": ["Record and distribute minutes from meeting", "Conduct review of all governance documents", "Ensure document retention policy is followed"],
    "July": ["Record and distribute minutes if summer meeting held", "Update and circulate booster handbook if needed", "Audit committee files for completeness"],
    "August": ["Record and distribute minutes from board meeting", "Distribute welcome packet to new booster families", "Verify all school volunteer forms are on file for active members"],
    "September": ["Record and distribute minutes from board meeting", "Coordinate logistics for any booster general membership meeting", "Begin gathering materials for annual report"],
    "October": ["Record and distribute minutes from board meeting", "Prepare official notices for elections if applicable", "Ensure nomination paperwork is in order"],
    "November": ["Record and distribute minutes from board meeting", "Finalize annual report draft for board review", "Prepare transition binder for successor if term ending"],
    "December": ["Record and distribute minutes from board meeting", "Archive all records for the semester/year", "Distribute updated roster and calendar for spring semester"],
  },
  "Treasurer": {
    "January": ["Prepare year-end financial summary for board", "Coordinate with accountant on tax filings if applicable", "Present annual budget proposal aligned with show schedule", "Reconcile all accounts from previous year"],
    "February": ["Present monthly financial report at board meeting", "Ensure all annual tax documents are prepared", "Review insurance policies or school coverage"],
    "March": ["Present monthly financial report at board meeting", "Track spring show expenses against budget", "Process reimbursements for costumes, sets, and supplies"],
    "April": ["Present monthly financial report at board meeting", "Reconcile spring show income (ticket sales, concessions, ads)", "Report spring show financial results to board"],
    "May": ["Present monthly financial report at board meeting", "Process end-of-year banquet expenses", "Review full year budget vs actuals"],
    "June": ["Present year-end financial report to board", "Ensure all outstanding reimbursements are processed", "Begin drafting next year's budget based on show calendar"],
    "July": ["Review and update financial policies", "Research grant opportunities for theater programs", "Prepare draft budget for fall semester"],
    "August": ["Present proposed fall budget at board meeting", "Set up any new accounts or payment tools for the year", "Coordinate with school bookkeeper on fund transfers"],
    "September": ["Present monthly financial report at board meeting", "Track fall show expenses against budget", "Process purchase orders and reimbursements for fall production"],
    "October": ["Present monthly financial report at board meeting", "Reconcile fall show income (tickets, concessions, program ads)", "Report fall show financial results to board"],
    "November": ["Present monthly financial report at board meeting", "Monitor fundraising revenue vs goals", "Prepare for any year-end giving campaigns"],
    "December": ["Present monthly financial report at board meeting", "Year-end financial reconciliation", "Ensure all reimbursements processed before year-end", "Issue tax receipts for donations if applicable"],
  },
  "Event Coordinator": {
    "January": ["Draft annual event calendar aligned with show schedule", "Debrief on previous year's events", "Set event budgets with Treasurer", "Begin planning spring show support events (cast party, opening night reception)"],
    "February": ["Finalize spring show support events", "Recruit event volunteers", "Coordinate with Drama Director on show week logistics"],
    "March": ["Manage spring show week events — concessions, receptions, cast party", "Coordinate set-up and tear-down crews", "Launch ticket promotion efforts"],
    "April": ["Execute spring show events", "Send thank you notes to event volunteers and sponsors", "Document lessons learned while fresh"],
    "May": ["Plan and execute end-of-year banquet or awards night", "Report event results to board", "Gather feedback from families on events"],
    "June": ["Compile event recap and recommendations for next year", "Begin researching venues or logistics for any off-campus events"],
    "July": ["Plan fall show support events", "Secure vendors if needed (catering, rentals)", "Coordinate with school on facility availability"],
    "August": ["Finalize fall event plans", "Promote fall show and booster events at back-to-school night", "Recruit fall event volunteers"],
    "September": ["Manage fall show week events — concessions, receptions, cast party", "Coordinate set-up and tear-down crews", "Launch ticket promotion efforts"],
    "October": ["Execute fall show events", "Send thank you notes to event volunteers", "Document lessons learned"],
    "November": ["Plan any holiday showcase or winter event", "Coordinate with Fundraising Coordinator on event tie-ins", "Report fall event results to board"],
    "December": ["Execute holiday event if applicable", "Send year-end thank you to all event volunteers", "Compile annual event summary for board", "Begin brainstorming next year's event calendar"],
  },
  "Fundraising Coordinator": {
    "January": ["Set annual fundraising goals aligned with program needs", "Review previous year's fundraising data", "Identify grant opportunities for school theater programs", "Plan donor stewardship calendar"],
    "February": ["Launch spring fundraising campaign (program ads, sponsorships)", "Solicit local business sponsors for spring show program", "Coordinate with Event Coordinator on spring show fundraising"],
    "March": ["Manage spring show program ad sales", "Organize concessions inventory and pricing for spring show", "Apply for any available grants"],
    "April": ["Collect spring show fundraising revenue (ads, concessions, donations)", "Send thank you letters to sponsors and donors", "Report spring fundraising results to board"],
    "May": ["Wrap up spring fundraising efforts", "Recognize donors at end-of-year banquet", "Update donor database"],
    "June": ["Present full-year fundraising report to board", "Research summer fundraising ideas (spirit wear, online campaigns)", "Plan fall sponsorship strategy"],
    "July": ["Launch summer spirit wear or online fundraiser if applicable", "Prepare fall sponsorship packets", "Identify new corporate sponsor prospects"],
    "August": ["Distribute sponsorship packets to local businesses", "Plan fall show program ad sales", "Set up fall concessions plan"],
    "September": ["Manage fall show program ad sales and sponsorships", "Organize concessions for fall show", "Launch fall fundraising campaign"],
    "October": ["Collect fall show fundraising revenue", "Plan Giving Tuesday or year-end giving campaign", "Report fall fundraising results to board"],
    "November": ["Launch year-end giving campaign", "Execute Giving Tuesday campaign", "Follow up with lapsed donors or sponsors"],
    "December": ["Monitor year-end giving and send reminders", "Process all year-end donations and issue receipts", "Compile annual fundraising report for board", "Send donor thank you and impact summary"],
  },
  "Volunteer Coordinator": {
    "January": ["Review previous year's volunteer data (hours, retention)", "Set annual volunteer recruitment goals", "Update volunteer handbook and role descriptions", "Plan volunteer appreciation strategy for the year"],
    "February": ["Launch spring show volunteer recruitment", "Schedule volunteer orientation or training sessions", "Create sign-up sheets for spring show needs (costumes, sets, concessions, backstage)"],
    "March": ["Conduct volunteer orientations for spring show", "Assign volunteers to spring show roles and shifts", "Coordinate with Event Coordinator on show week staffing"],
    "April": ["Manage spring show volunteers — check-ins, scheduling, troubleshooting", "Track volunteer hours during show week", "Collect volunteer feedback after spring show"],
    "May": ["Recognize volunteers at end-of-year banquet", "Report volunteer hours and participation to board", "Send thank you to all spring volunteers"],
    "June": ["Compile volunteer data and recommendations for next year", "Update role descriptions based on feedback", "Identify any summer volunteer needs"],
    "July": ["Update volunteer application and onboarding materials", "Plan fall volunteer recruitment strategy", "Coordinate with school on volunteer clearance requirements"],
    "August": ["Launch fall volunteer recruitment at back-to-school events", "Ensure all volunteers have completed school-required forms (background checks, etc.)", "Schedule fall orientation sessions"],
    "September": ["Conduct fall volunteer orientations", "Assign volunteers to fall show roles and shifts", "Coordinate with Event Coordinator on fall show staffing"],
    "October": ["Manage fall show volunteers", "Track volunteer hours during show week", "Collect volunteer feedback after fall show"],
    "November": ["Recruit holiday event volunteers", "Plan year-end volunteer recognition", "Survey all volunteers for annual feedback"],
    "December": ["Host volunteer appreciation event or send recognition gifts", "Compile annual volunteer impact report for board", "Archive volunteer records for the year", "Plan recruitment strategy for next year"],
  },
};

const emptyMonths = () => MONTHS.reduce((a, m) => ({ ...a, [m]: [] }), {});
const displayRole = (r, cr) => r === "Other" ? (cr || "Custom Role") : r;
const PRIMARY = "#1e3a8a";
const ACCENT = "#dc2626";

// ⚠️ CHANGE THIS to your own password! Share it only with board members.
const BOARD_PASSWORD = "DramaDragons2026";

function PasswordGate({ onSuccess }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = () => {
    if (pw === BOARD_PASSWORD) {
      onSuccess();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <>
      <Head><title>Jefferson Drama Dragons — Booster Club Operating Guide</title></Head>
      <div style={{ minHeight: "100vh", background: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
        <div style={{ background: "white", borderRadius: 16, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", overflow: "hidden", maxWidth: 384, width: "100%" }}>
          <div style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, #1e40af 100%)`, padding: 32, textAlign: "center", color: "white" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: PRIMARY, border: `3px solid ${ACCENT}`, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              <span style={{ color: "white", fontWeight: 900, fontSize: 28 }}>J</span>
            </div>
            <h1 style={{ fontSize: 20, fontWeight: 700 }}>Jefferson Drama Dragons</h1>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginTop: 4 }}>Booster Club Operating Guide</p>
          </div>
          <div style={{ padding: 32 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 8 }}>Enter Board Password</label>
            <input
              type="password"
              value={pw}
              onChange={e => { setPw(e.target.value); setError(false); }}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              placeholder="Password"
              style={{ width: "100%", border: `1px solid ${error ? "#f87171" : "#d1d5db"}`, borderRadius: 8, padding: "12px 16px", fontSize: 14, outline: "none", boxSizing: "border-box" }}
              autoFocus
            />
            {error && <p style={{ color: "#ef4444", fontSize: 12, marginTop: 8 }}>Incorrect password. Please try again.</p>}
            <button onClick={handleSubmit} style={{ width: "100%", marginTop: 16, padding: 12, background: PRIMARY, color: "white", border: "none", borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
              🔓 Enter
            </button>
            <p style={{ fontSize: 11, color: "#9ca3af", textAlign: "center", marginTop: 16 }}>Contact your board president if you need the password.</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default function OperatingGuide() {
  const [authenticated, setAuthenticated] = useState(false);
  const [allGuides, setAllGuides] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState("home");
  const [currentKey, setCurrentKey] = useState(null);

  const [role, setRole] = useState("Secretary");
  const [customRole, setCustomRole] = useState("");
  const [orgName, setOrgName] = useState("JHS Drama Club Booster Club");
  const [monthlyTasks, setMonthlyTasks] = useState(emptyMonths());
  const [activeMonth, setActiveMonth] = useState("January");
  const [newTask, setNewTask] = useState("");
  const [editIdx, setEditIdx] = useState(null);
  const [editText, setEditText] = useState("");
  const [tips, setTips] = useState("");
  const [contacts, setContacts] = useState("");
  const [files, setFiles] = useState("");
  const [browseKey, setBrowseKey] = useState(null);
  const [showExportMenu, setShowExportMenu] = useState(false);

  useEffect(() => {
    if (!authenticated) return;
    (async () => {
      try {
        const res = await storage.list("guide:");
        const guides = {};
        if (res && res.keys) {
          for (const k of res.keys) {
            try {
              const r = await storage.get(k);
              if (r) guides[k] = JSON.parse(r.value);
            } catch (e) {}
          }
        }
        setAllGuides(guides);
      } catch (e) { console.error("Load error:", e); }
      setLoading(false);
    })();
  }, [authenticated]);

  if (!authenticated) return <PasswordGate onSuccess={() => setAuthenticated(true)} />;

  const saveGuide = async () => {
    setSaving(true);
    const dr = displayRole(role, customRole);
    const key = currentKey || `guide:${dr.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
    const data = { role, customRole, orgName, monthlyTasks, tips, contacts, files, updatedAt: new Date().toISOString() };
    try {
      await storage.set(key, JSON.stringify(data));
      setAllGuides(p => ({ ...p, [key]: data }));
      setCurrentKey(key);
      setSaving(false);
      setView("home");
    } catch (e) {
      console.error("Save error:", e);
      setSaving(false);
      alert("Failed to save. Please try again.");
    }
  };

  const loadGuideForEdit = (key) => {
    const g = allGuides[key];
    if (!g) return;
    setRole(g.role); setCustomRole(g.customRole || ""); setOrgName(g.orgName || "JHS Drama Club Booster Club");
    setMonthlyTasks(g.monthlyTasks); setTips(g.tips || ""); setContacts(g.contacts || ""); setFiles(g.files || "");
    setCurrentKey(key); setActiveMonth("January"); setEditIdx(null); setView("edit");
  };

  const startNew = () => {
    setRole("Secretary"); setCustomRole(""); setOrgName("JHS Drama Club Booster Club");
    setMonthlyTasks(emptyMonths()); setTips(""); setContacts(""); setFiles("");
    setCurrentKey(null); setActiveMonth("January"); setEditIdx(null); setView("edit");
  };

  const deleteGuide = async (key) => {
    if (!confirm("Delete this guide? This cannot be undone.")) return;
    try {
      await storage.delete(key);
      setAllGuides(p => { const n = { ...p }; delete n[key]; return n; });
      if (browseKey === key) setBrowseKey(null);
    } catch (e) { console.error("Delete error:", e); }
  };

  const addTask = () => {
    if (!newTask.trim()) return;
    setMonthlyTasks(p => ({ ...p, [activeMonth]: [...p[activeMonth], newTask.trim()] }));
    setNewTask("");
  };
  const removeTask = (m, i) => setMonthlyTasks(p => ({ ...p, [m]: p[m].filter((_, j) => j !== i) }));
  const startEditTask = (i, t) => { setEditIdx(i); setEditText(t); };
  const saveEditTask = (m) => {
    if (!editText.trim()) return;
    setMonthlyTasks(p => ({ ...p, [m]: p[m].map((t, i) => i === editIdx ? editText.trim() : t) }));
    setEditIdx(null); setEditText("");
  };
  const moveTask = (m, i, d) => {
    setMonthlyTasks(p => {
      const a = [...p[m]], ni = i + d;
      if (ni < 0 || ni >= a.length) return p;
      [a[i], a[ni]] = [a[ni], a[i]];
      return { ...p, [m]: a };
    });
  };

  const loadTemplate = () => {
    const t = TASK_TEMPLATES[role];
    if (!t) return alert("No template available for this role yet. Add your tasks manually!");
    setMonthlyTasks(p => {
      const next = { ...p };
      Object.entries(t).forEach(([m, tasks]) => { next[m] = [...new Set([...next[m], ...tasks])]; });
      return next;
    });
  };

  const totalTasks = Object.values(monthlyTasks).reduce((s, t) => s + t.length, 0);
  const guideList = Object.entries(allGuides);

  // === EXPORT ===
  const generateGuideHTML = (g) => {
    const dr = displayRole(g.role, g.customRole);
    let html = `<div style="page-break-after:always;margin-bottom:40px;">`;
    html += `<h2 style="color:${PRIMARY};border-bottom:3px solid ${ACCENT};padding-bottom:8px;font-size:22px;">${dr}</h2>`;
    if (g.orgName) html += `<p style="color:#666;margin-top:4px;">${g.orgName}</p>`;
    MONTHS.forEach(m => {
      const tasks = g.monthlyTasks[m];
      if (!tasks || !tasks.length) return;
      html += `<h3 style="color:${PRIMARY};margin-top:20px;margin-bottom:8px;font-size:16px;border-bottom:1px solid #e5e7eb;padding-bottom:4px;">${m}</h3><ul style="margin:0;padding-left:20px;">`;
      tasks.forEach(t => { html += `<li style="margin-bottom:6px;font-size:14px;color:#374151;">${t}</li>`; });
      html += `</ul>`;
    });
    if (g.tips) html += `<h3 style="color:${PRIMARY};margin-top:24px;font-size:16px;">💡 Tips & Institutional Knowledge</h3><p style="font-size:14px;color:#374151;white-space:pre-wrap;">${g.tips}</p>`;
    if (g.contacts) html += `<h3 style="color:${PRIMARY};margin-top:20px;font-size:16px;">📇 Key Contacts</h3><p style="font-size:14px;color:#374151;white-space:pre-wrap;">${g.contacts}</p>`;
    if (g.files) html += `<h3 style="color:${PRIMARY};margin-top:20px;font-size:16px;">📁 Important Files & Locations</h3><p style="font-size:14px;color:#374151;white-space:pre-wrap;">${g.files}</p>`;
    html += `</div>`;
    return html;
  };

  const exportDocument = (mode, singleKey) => {
    const guides = mode === "single" ? [[singleKey, allGuides[singleKey]]] : guideList;
    const title = mode === "single" ? `${displayRole(allGuides[singleKey].role, allGuides[singleKey].customRole)} — Operating Guide` : "Jefferson Drama Dragons — All Role Guides";
    let html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title}</title>
      <style>@media print{body{margin:0.5in}h2{page-break-before:always}h2:first-of-type{page-break-before:avoid}}body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:800px;margin:0 auto;padding:40px 20px;color:#1f2937}@page{margin:0.75in}</style></head><body>`;
    html += `<div style="text-align:center;margin-bottom:40px;padding-bottom:20px;border-bottom:3px solid ${ACCENT};">`;
    html += `<div style="width:60px;height:60px;border-radius:50%;background:${PRIMARY};border:3px solid ${ACCENT};display:inline-flex;align-items:center;justify-content:center;margin-bottom:12px;"><span style="color:white;font-weight:900;font-size:28px;">J</span></div>`;
    html += `<h1 style="color:${PRIMARY};margin:8px 0 4px;">Jefferson Drama Dragons</h1>`;
    html += `<p style="color:#6b7280;font-size:14px;">Booster Club Operating Guide</p>`;
    html += `<p style="color:#9ca3af;font-size:12px;">Exported ${new Date().toLocaleDateString()}</p></div>`;
    if (mode === "all" && guides.length > 1) {
      html += `<div style="margin-bottom:32px;padding:16px 20px;background:#f9fafb;border-radius:8px;"><h3 style="color:${PRIMARY};margin:0 0 8px;font-size:15px;">Table of Contents</h3><ul style="margin:0;padding-left:20px;">`;
      guides.forEach(([, g]) => { html += `<li style="margin-bottom:4px;font-size:14px;">${displayRole(g.role, g.customRole)}</li>`; });
      html += `</ul></div>`;
    }
    guides.forEach(([, g]) => { html += generateGuideHTML(g); });
    html += `</body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url;
    a.download = mode === "single" ? `${displayRole(guides[0][1].role, guides[0][1].customRole).replace(/[^a-zA-Z0-9 ]/g, "")}-Guide.html` : "Drama-Boosters-All-Guides.html";
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  };

  const styles = {
    page: { minHeight: "100vh", background: "#f9fafb", padding: 16 },
    container: { maxWidth: 768, margin: "0 auto" },
    header: { background: `linear-gradient(135deg, ${PRIMARY} 0%, #1e40af 100%)`, borderRadius: "16px", padding: "32px", color: "white", marginBottom: 24 },
    headerEdit: { background: `linear-gradient(135deg, ${PRIMARY} 0%, #1e40af 100%)`, borderRadius: "16px 16px 0 0", padding: "20px 24px", color: "white" },
    card: { background: "white", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #f3f4f6", padding: "20px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
    btn: { padding: "10px 20px", background: PRIMARY, color: "white", border: "none", borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: "pointer" },
    btnOutline: { padding: "10px 20px", background: "white", color: PRIMARY, border: "none", borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: "pointer" },
    btnGray: { padding: "6px 12px", background: "#f3f4f6", color: "#374151", border: "none", borderRadius: 8, fontWeight: 500, fontSize: 13, cursor: "pointer" },
    btnBlue: { padding: "6px 12px", background: "#eff6ff", color: PRIMARY, border: "none", borderRadius: 8, fontWeight: 500, fontSize: 13, cursor: "pointer" },
    input: { width: "100%", border: "1px solid #d1d5db", borderRadius: 8, padding: "8px 12px", fontSize: 14, outline: "none", boxSizing: "border-box" },
    textarea: { width: "100%", border: "1px solid #d1d5db", borderRadius: 8, padding: "8px 12px", fontSize: 14, outline: "none", resize: "vertical", boxSizing: "border-box" },
    label: { display: "block", fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 4 },
    select: { width: "100%", border: "1px solid #d1d5db", borderRadius: 8, padding: "8px 12px", fontSize: 14, outline: "none", background: "white", boxSizing: "border-box" },
    taskRow: { display: "flex", alignItems: "flex-start", gap: 8, background: "#f9fafb", borderRadius: 8, padding: "10px 12px", marginBottom: 8 },
    subtle: { color: "rgba(255,255,255,0.7)", fontSize: 14, marginTop: 4 },
    backLink: { color: PRIMARY, fontSize: 13, fontWeight: 500, cursor: "pointer", background: "none", border: "none", marginBottom: 16, padding: 0 },
  };

  const Logo = ({ size = "lg" }) => {
    const sz = size === "lg" ? 64 : 40;
    const fsz = size === "lg" ? 28 : 18;
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: sz, height: sz, borderRadius: "50%", background: PRIMARY, border: `3px solid ${ACCENT}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <span style={{ color: "white", fontWeight: 900, fontSize: fsz }}>J</span>
        </div>
        <div>
          <div style={{ fontWeight: 700, color: "white", fontSize: size === "lg" ? 24 : 18 }}>Jefferson Drama Dragons</div>
          <div style={styles.subtle}>Booster Club Operating Guide</div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{ ...styles.page, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: PRIMARY, border: `3px solid ${ACCENT}`, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
            <span style={{ color: "white", fontWeight: 900, fontSize: 18 }}>J</span>
          </div>
          <p style={{ color: "#6b7280", fontSize: 14 }}>Loading guides...</p>
        </div>
      </div>
    );
  }

  // === HOME ===
  if (view === "home") {
    return (
      <>
        <Head><title>Jefferson Drama Dragons — Booster Club Operating Guide</title></Head>
        <div style={styles.page}>
          <div style={styles.container}>
            <div style={styles.header}>
              <Logo size="lg" />
              <p style={{ ...styles.subtle, marginTop: 16 }}>A shared reference for every booster board role — so your successor knows exactly what to do, month by month.</p>
              <div style={{ marginTop: 20, display: "flex", gap: 12, flexWrap: "wrap" }}>
                <button onClick={startNew} style={styles.btnOutline}>+ Create New Role Guide</button>
                {guideList.length > 0 && (
                  <div style={{ position: "relative", display: "inline-block" }}>
                    <button onClick={() => setShowExportMenu(!showExportMenu)} style={{ ...styles.btnOutline, background: "transparent", color: "white", border: "2px solid white" }}>📄 Export Guides</button>
                    {showExportMenu && (
                      <div style={{ position: "absolute", left: 0, top: "100%", marginTop: 8, background: "white", borderRadius: 8, boxShadow: "0 10px 25px rgba(0,0,0,0.15)", border: "1px solid #e5e7eb", padding: "8px 0", zIndex: 50, minWidth: 220 }}>
                        <button onClick={() => { exportDocument("all"); setShowExportMenu(false); }} style={{ width: "100%", textAlign: "left", padding: "10px 16px", fontSize: 14, color: "#374151", background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>📋 Export All Guides</button>
                        <div style={{ borderTop: "1px solid #f3f4f6", margin: "4px 0" }}></div>
                        <p style={{ padding: "4px 16px", fontSize: 11, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase" }}>Export Single Guide:</p>
                        {guideList.map(([key, g]) => (
                          <button key={key} onClick={() => { exportDocument("single", key); setShowExportMenu(false); }}
                            style={{ width: "100%", textAlign: "left", padding: "8px 16px", fontSize: 13, color: "#6b7280", background: "none", border: "none", cursor: "pointer" }}>{displayRole(g.role, g.customRole)}</button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {guideList.length === 0 ? (
              <div style={{ background: "white", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.1)", padding: "40px 20px", textAlign: "center" }}>
                <p style={{ fontSize: 40, marginBottom: 12 }}>🎭</p>
                <p style={{ color: "#6b7280" }}>No guides created yet. Be the first to document your role!</p>
              </div>
            ) : (
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 600, color: "#1f2937", marginBottom: 12 }}>All Role Guides ({guideList.length})</h2>
                {guideList.map(([key, g]) => {
                  const dr = displayRole(g.role, g.customRole);
                  const tc = Object.values(g.monthlyTasks).reduce((s, t) => s + t.length, 0);
                  const mc = Object.values(g.monthlyTasks).filter(t => t.length).length;
                  return (
                    <div key={key} style={styles.card}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ fontWeight: 600, color: "#1f2937", fontSize: 18 }}>{dr}</span>
                        <p style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>{tc} task{tc !== 1 ? "s" : ""} across {mc} month{mc !== 1 ? "s" : ""} · Updated {new Date(g.updatedAt).toLocaleDateString()}</p>
                      </div>
                      <div style={{ display: "flex", gap: 8, marginLeft: 16 }}>
                        <button onClick={() => { setBrowseKey(key); setView("browse"); }} style={styles.btnGray}>View</button>
                        <button onClick={() => loadGuideForEdit(key)} style={styles.btnBlue}>Edit</button>
                        <button onClick={() => deleteGuide(key)} style={{ ...styles.btnGray, color: "#f87171" }}>Delete</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <p style={{ textAlign: "center", fontSize: 12, color: "#9ca3af", marginTop: 32 }}>🎭 Data is shared — all booster board members can view and edit guides.</p>
          </div>
        </div>
      </>
    );
  }

  // === BROWSE ===
  if (view === "browse" && browseKey && allGuides[browseKey]) {
    const g = allGuides[browseKey];
    const dr = displayRole(g.role, g.customRole);
    return (
      <>
        <Head><title>{dr} — Jefferson Drama Dragons Operating Guide</title></Head>
        <div style={styles.page}>
          <div style={styles.container}>
            <button onClick={() => setView("home")} style={styles.backLink}>← Back to All Guides</button>
            <div style={{ background: "white", borderRadius: 16, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", overflow: "hidden" }}>
              <div style={{ ...styles.headerEdit, borderRadius: "16px 16px 0 0" }}>
                <Logo size="sm" />
                <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 16, color: "white" }}>{dr}</h2>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>Last updated {new Date(g.updatedAt).toLocaleDateString()}</p>
              </div>
              <div style={{ padding: 32 }}>
                {MONTHS.map(m => {
                  const tasks = g.monthlyTasks[m];
                  if (!tasks || !tasks.length) return null;
                  return (
                    <div key={m} style={{ marginBottom: 24 }}>
                      <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1f2937", borderBottom: `2px solid ${ACCENT}`, paddingBottom: 4, marginBottom: 12 }}>{m}</h3>
                      {tasks.map((t, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 14, color: "#374151", marginBottom: 8 }}>
                          <span style={{ color: ACCENT, marginTop: 2, flexShrink: 0 }}>◆</span>
                          <span>{t}</span>
                        </div>
                      ))}
                    </div>
                  );
                })}
                {g.tips && (
                  <div style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid #f3f4f6" }}>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1f2937", marginBottom: 8 }}>💡 Tips & Institutional Knowledge</h3>
                    <p style={{ fontSize: 14, color: "#374151", whiteSpace: "pre-wrap" }}>{g.tips}</p>
                  </div>
                )}
                {g.contacts && (
                  <div style={{ marginTop: 24, paddingTop: 24, borderTop: "1px solid #f3f4f6" }}>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1f2937", marginBottom: 8 }}>📇 Key Contacts</h3>
                    <p style={{ fontSize: 14, color: "#374151", whiteSpace: "pre-wrap" }}>{g.contacts}</p>
                  </div>
                )}
                {g.files && (
                  <div style={{ marginTop: 24, paddingTop: 24, borderTop: "1px solid #f3f4f6" }}>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1f2937", marginBottom: 8 }}>📁 Important Files & Locations</h3>
                    <p style={{ fontSize: 14, color: "#374151", whiteSpace: "pre-wrap" }}>{g.files}</p>
                  </div>
                )}
                <div style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid #f3f4f6", display: "flex", gap: 12 }}>
                  <button onClick={() => loadGuideForEdit(browseKey)} style={styles.btn}>Edit This Guide</button>
                  <button onClick={() => exportDocument("single", browseKey)} style={styles.btnGray}>📄 Export This Guide</button>
                  <button onClick={() => setView("home")} style={styles.btnGray}>Back to All</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // === EDIT ===
  return (
    <>
      <Head><title>Edit Guide — Jefferson Drama Dragons</title></Head>
      <div style={styles.page}>
        <div style={styles.container}>
          <button onClick={() => setView("home")} style={styles.backLink}>← Back to All Guides</button>

          <div style={styles.headerEdit}>
            <Logo size="sm" />
            <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 12, color: "white" }}>{currentKey ? "Edit" : "New"} Role Guide</h2>
            <p style={{ ...styles.subtle, marginTop: 4 }}>Document what you do each month so your successor knows exactly what to expect</p>
          </div>

          <div style={{ background: "white", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", borderRadius: "0 0 16px 16px" }}>
            {/* Role & Org */}
            <div style={{ padding: 24, borderBottom: "1px solid #f3f4f6" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={styles.label}>Board Role</label>
                  <select value={role} onChange={e => setRole(e.target.value)} style={styles.select}>
                    {ROLES.map(r => <option key={r}>{r}</option>)}
                  </select>
                  {role === "Other" && <input value={customRole} onChange={e => setCustomRole(e.target.value)} placeholder="Enter role title" style={{ ...styles.input, marginTop: 8 }} />}
                </div>
                <div>
                  <label style={styles.label}>Organization</label>
                  <input value={orgName} onChange={e => setOrgName(e.target.value)} style={styles.input} />
                </div>
              </div>
              {TASK_TEMPLATES[role] && (
                <button onClick={loadTemplate} style={{ marginTop: 12, fontSize: 13, fontWeight: 500, color: ACCENT, background: "none", border: "none", cursor: "pointer" }}>⚡ Load starter template for {role}</button>
              )}
            </div>

            {/* Month Tabs */}
            <div style={{ padding: "16px 24px 0" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {MONTHS.map(m => {
                  const has = monthlyTasks[m].length > 0;
                  const active = m === activeMonth;
                  return (
                    <button key={m} onClick={() => { setActiveMonth(m); setEditIdx(null); }}
                      style={{ padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 500, border: "none", cursor: "pointer", position: "relative",
                        background: active ? PRIMARY : has ? "#eff6ff" : "#f9fafb",
                        color: active ? "white" : has ? PRIMARY : "#9ca3af" }}>
                      {m.slice(0, 3)}
                      {has && !active && <span style={{ position: "absolute", top: -3, right: -3, width: 8, height: 8, borderRadius: "50%", background: ACCENT }}></span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tasks */}
            <div style={{ padding: 24 }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: "#1f2937", marginBottom: 12 }}>{activeMonth} Tasks</h3>
              {monthlyTasks[activeMonth].length === 0 && (
                <p style={{ color: "#9ca3af", fontSize: 14, marginBottom: 16, fontStyle: "italic" }}>No tasks yet for {activeMonth}. Add your first one below.</p>
              )}
              {monthlyTasks[activeMonth].map((task, i) => (
                <div key={i} style={styles.taskRow}>
                  {editIdx === i ? (
                    <div style={{ flex: 1, display: "flex", gap: 8 }}>
                      <input value={editText} onChange={e => setEditText(e.target.value)} onKeyDown={e => e.key === "Enter" && saveEditTask(activeMonth)}
                        style={{ ...styles.input, flex: 1 }} autoFocus />
                      <button onClick={() => saveEditTask(activeMonth)} style={{ fontSize: 12, color: PRIMARY, background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>Save</button>
                      <button onClick={() => setEditIdx(null)} style={{ fontSize: 12, color: "#9ca3af", background: "none", border: "none", cursor: "pointer" }}>Cancel</button>
                    </div>
                  ) : (
                    <>
                      <span style={{ color: ACCENT, marginTop: 2, flexShrink: 0, fontSize: 13 }}>◆</span>
                      <span style={{ flex: 1, fontSize: 14, color: "#374151" }}>{task}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 2, marginLeft: 8, flexShrink: 0 }}>
                        <button onClick={() => moveTask(activeMonth, i, -1)} style={{ fontSize: 12, color: "#9ca3af", background: "none", border: "none", cursor: "pointer", padding: "4px 6px", borderRadius: 4 }}>↑</button>
                        <button onClick={() => moveTask(activeMonth, i, 1)} style={{ fontSize: 12, color: "#9ca3af", background: "none", border: "none", cursor: "pointer", padding: "4px 6px", borderRadius: 4 }}>↓</button>
                        <button onClick={() => startEditTask(i, task)} style={{ fontSize: 12, color: "#3b82f6", background: "none", border: "none", cursor: "pointer", padding: "4px 6px", borderRadius: 4, fontWeight: 500 }}>Edit</button>
                        <button onClick={() => removeTask(activeMonth, i)} style={{ fontSize: 12, color: "#f87171", background: "none", border: "none", cursor: "pointer", padding: "4px 6px", borderRadius: 4, fontWeight: 500 }}>✕</button>
                      </div>
                    </>
                  )}
                </div>
              ))}
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <input value={newTask} onChange={e => setNewTask(e.target.value)} onKeyDown={e => e.key === "Enter" && addTask()}
                  placeholder={`Add a task for ${activeMonth}...`} style={{ ...styles.input, flex: 1 }} />
                <button onClick={addTask} style={{ ...styles.btn, flexShrink: 0 }}>Add</button>
              </div>
            </div>

            {/* Supplemental */}
            <div style={{ padding: "24px", borderTop: "1px solid #f3f4f6" }}>
              <div style={{ marginBottom: 20 }}>
                <label style={styles.label}>💡 Tips & Institutional Knowledge</label>
                <textarea value={tips} onChange={e => setTips(e.target.value)} rows={3} placeholder="Things you wish someone had told you..." style={styles.textarea} />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={styles.label}>📇 Key Contacts</label>
                <textarea value={contacts} onChange={e => setContacts(e.target.value)} rows={2} placeholder="e.g. Drama Director: Mrs. Smith (ext. 234)" style={styles.textarea} />
              </div>
              <div>
                <label style={styles.label}>📁 Important Files & Where to Find Them</label>
                <textarea value={files} onChange={e => setFiles(e.target.value)} rows={2} placeholder="e.g. Budget spreadsheet in shared Google Drive" style={styles.textarea} />
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: "16px 24px", background: "#f9fafb", borderRadius: "0 0 16px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, color: "#6b7280" }}>{totalTasks} task{totalTasks !== 1 ? "s" : ""} across {Object.values(monthlyTasks).filter(t => t.length).length} months</span>
              <button onClick={saveGuide} disabled={saving} style={{ ...styles.btn, opacity: saving ? 0.5 : 1 }}>
                {saving ? "Saving..." : "💾 Save Guide"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
