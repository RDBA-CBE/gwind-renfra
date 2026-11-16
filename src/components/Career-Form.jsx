"use client";

import { useState } from "react";
import emailjs from "@emailjs/browser";

const EMAILJS_SERVICE_ID = "service_lu7idzb";
const EMAILJS_TEMPLATE_ID = "template_mj764se";
const EMAILJS_PUBLIC_KEY = "c3_kKp9-KxCC0A86J";

const initialForm = {
  candidate_name: "",
  contact_number: "",
  mail_id: "",
  date_of_birth: "",
  gender: "",
  form_date: "",
  highest_qualification: "",
  current_organization: "",
  current_designation: "",
  reason_for_leaving: "",
  overall_experience: "",
  relevant_domain_type: "",
  relevant_domain_category: "",
  relevant_experience_years: "",
  relevant_certificate: "",
  seeking_position: "",
  software_tools: "",
  current_location: "",
  native: "",
  languages_known: "",
  current_ctc: "",
  expected_ctc: "",
  notice_period: "",
  ready_to_relocate: "",
  preferred_location: "",
  willingness_site: "",
  employment_history: "",
  brief_summary: "",
};

const Field = ({ label, required, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-semibold text-[#293E52]">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
  </div>
);

const inputCls =
  "w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-[#293E52] bg-white focus:outline-none focus:ring-2 focus:ring-[#3AB257]/40 focus:border-[#3AB257] transition placeholder:text-slate-400";
const textareaCls = `${inputCls} resize-none`;

export default function CareerForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle");

  const handle = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const message = `
CANDIDATE APPLICATION FORM
===========================

--- PERSONAL INFORMATION ---
Candidate Name     : ${form.candidate_name}
Contact Number     : ${form.contact_number}
Mail ID            : ${form.mail_id}
Date of Birth      : ${form.date_of_birth}
Gender             : ${form.gender}
Form Date          : ${form.form_date}
Current Location   : ${form.current_location}
Native             : ${form.native}
Languages Known    : ${form.languages_known}

--- QUALIFICATION & EXPERIENCE ---
Highest Qualification          : ${form.highest_qualification}
Overall Experience (yrs)       : ${form.overall_experience}
Relevant Domain (Solar/Wind)   : ${form.relevant_domain_type}
Relevant Domain (Project/O&M)  : ${form.relevant_domain_category}
Relevant Experience (yrs)      : ${form.relevant_experience_years}
Relevant Certificate           : ${form.relevant_certificate}
Seeking Position & Dept        : ${form.seeking_position}
Software / Tools               : ${form.software_tools}

--- CURRENT EMPLOYMENT ---
Current Organization  : ${form.current_organization}
Current Designation   : ${form.current_designation}
Current CTC           : ${form.current_ctc}
Expected CTC          : ${form.expected_ctc}
Notice Period         : ${form.notice_period}
Reason for Leaving    : ${form.reason_for_leaving}

--- RELOCATION ---
Ready to Relocate         : ${form.ready_to_relocate}
Preferred Location        : ${form.preferred_location}
Willingness to Work Site  : ${form.willingness_site}

--- EMPLOYMENT HISTORY ---
${form.employment_history}

--- BRIEF SUMMARY ---
${form.brief_summary}
      `.trim();

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: form.candidate_name,
          reply_to: form.mail_id,
          to_email: "info@gwind.in",
          subject: `Career Application – ${form.candidate_name} | ${form.seeking_position}`,
          message,
        },
        EMAILJS_PUBLIC_KEY,
      );
      setStatus("success");
      setForm(initialForm);
    } catch (err) {
      console.error("EmailJS error status:", err?.status);
      console.error("EmailJS error text:", err?.text);
      console.error("EmailJS full error:", err);
      setStatus("error");
    }
  };

  return (
    <section className="w-full px-4 pb-0 sm:pb-15">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <span className="mb-4 inline-block rounded-full border border-[#3AB257]/30 bg-gradient-to-r from-[#3AB257]/15 to-[#329ACD]/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#3AB257]">
            Application Form
          </span>
          <h2 className="mb-3 text-3xl font-black text-[#293E52] sm:text-4xl">
            Candidate Details
          </h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 rounded-3xl border border-slate-100 bg-white p-8 shadow-sm sm:p-10"
        >
          <SectionTitle title="Personal Information" />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Candidate Name" required>
              <input
                name="candidate_name"
                value={form.candidate_name}
                onChange={handle}
                required
                placeholder="Full name"
                className={inputCls}
              />
            </Field>
            <Field label="Contact Number" required>
              <input
                name="contact_number"
                value={form.contact_number}
                onChange={handle}
                required
                placeholder="+91 XXXXX XXXXX"
                className={inputCls}
              />
            </Field>
            <Field label="Mail ID" required>
              <input
                type="email"
                name="mail_id"
                value={form.mail_id}
                onChange={handle}
                required
                placeholder="you@example.com"
                className={inputCls}
              />
            </Field>
            <Field label="Date of Birth (DD/MM/YYYY)" required>
              <input
                name="date_of_birth"
                value={form.date_of_birth}
                onChange={handle}
                required
                placeholder="DD/MM/YYYY"
                className={inputCls}
              />
            </Field>
            <Field label="Gender" required>
              <select
                name="gender"
                value={form.gender}
                onChange={handle}
                required
                className={inputCls}
              >
                <option value="">Select gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Prefer not to say</option>
              </select>
            </Field>
            <Field label="Date of Completing the Form" required>
              <input
                type="date"
                name="form_date"
                value={form.form_date}
                onChange={handle}
                required
                className={inputCls}
              />
            </Field>
            <Field label="Current Location" required>
              <input
                name="current_location"
                value={form.current_location}
                onChange={handle}
                required
                placeholder="City, State"
                className={inputCls}
              />
            </Field>
            <Field label="Native" required>
              <input
                name="native"
                value={form.native}
                onChange={handle}
                required
                placeholder="Hometown"
                className={inputCls}
              />
            </Field>
            <Field label="Languages Known" required>
              <input
                name="languages_known"
                value={form.languages_known}
                onChange={handle}
                required
                placeholder="e.g. Tamil, English, Hindi"
                className={inputCls}
              />
            </Field>
          </div>

          <Divider />

          <SectionTitle title="Qualification & Experience" />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Highest Qualification" required>
              <input
                name="highest_qualification"
                value={form.highest_qualification}
                onChange={handle}
                required
                placeholder="e.g. B.E. Electrical"
                className={inputCls}
              />
            </Field>
            <Field label="Overall Experience (in years)" required>
              <input
                name="overall_experience"
                value={form.overall_experience}
                onChange={handle}
                required
                placeholder="e.g. 5"
                className={inputCls}
              />
            </Field>
            <Field
              label="Relevant Domain Experience (Solar / Wind / PSS)"
              required
            >
              <input
                name="relevant_domain_type"
                value={form.relevant_domain_type}
                onChange={handle}
                required
                placeholder="e.g. Solar, Wind"
                className={inputCls}
              />
            </Field>
            <Field label="Relevant Domain Experience (Project / O&M)" required>
              <input
                name="relevant_domain_category"
                value={form.relevant_domain_category}
                onChange={handle}
                required
                placeholder="e.g. Project, O&M"
                className={inputCls}
              />
            </Field>
            <Field label="Relevant Experience in Years" required>
              <input
                name="relevant_experience_years"
                value={form.relevant_experience_years}
                onChange={handle}
                required
                placeholder="e.g. 3"
                className={inputCls}
              />
            </Field>
            <Field label="Relevant Certificate" required>
              <input
                name="relevant_certificate"
                value={form.relevant_certificate}
                onChange={handle}
                required
                placeholder="Certificate name if any"
                className={inputCls}
              />
            </Field>
            <Field label="Software / Tools Proficiency" required>
              <input
                name="software_tools"
                value={form.software_tools}
                onChange={handle}
                required
                placeholder="e.g. AutoCAD, SAP, MS Office"
                className={inputCls}
              />
            </Field>
          </div>

          <Divider />

          <SectionTitle title="Current Employment" />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Current Organization" required>
              <input
                name="current_organization"
                value={form.current_organization}
                onChange={handle}
                required
                placeholder="Company name"
                className={inputCls}
              />
            </Field>
            <Field label="Current Designation" required>
              <input
                name="current_designation"
                value={form.current_designation}
                onChange={handle}
                required
                placeholder="Your current role"
                className={inputCls}
              />
            </Field>
            <Field label="Current CTC" required>
              <input
                name="current_ctc"
                value={form.current_ctc}
                onChange={handle}
                required
                placeholder="e.g. 6 LPA"
                className={inputCls}
              />
            </Field>
            <Field label="Expected CTC" required>
              <input
                name="expected_ctc"
                value={form.expected_ctc}
                onChange={handle}
                required
                placeholder="e.g. 9 LPA"
                className={inputCls}
              />
            </Field>
            <Field label="Notice Period" required>
              <input
                name="notice_period"
                value={form.notice_period}
                onChange={handle}
                required
                placeholder="e.g. 30 days, Immediate"
                className={inputCls}
              />
            </Field>
            <Field label="Seeking Position & Department" required>
              <input
                name="seeking_position"
                value={form.seeking_position}
                onChange={handle}
                required
                placeholder="e.g. Site Engineer – Solar"
                className={inputCls}
              />
            </Field>
          </div>
          <Field label="Reason for Leaving Current Job" required>
            <textarea
              name="reason_for_leaving"
              value={form.reason_for_leaving}
              onChange={handle}
              required
              rows={3}
              placeholder="Briefly explain..."
              className={textareaCls}
            />
          </Field>

          <Divider />

          <SectionTitle title="Relocation & Site Willingness" />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Ready to Relocate" required>
              <select
                name="ready_to_relocate"
                value={form.ready_to_relocate}
                onChange={handle}
                required
                className={inputCls}
              >
                <option value="">Select</option>
                <option>Yes</option>
                <option>No</option>
              </select>
            </Field>
            <Field label="If No, Preferred Location">
              <input
                name="preferred_location"
                value={form.preferred_location}
                onChange={handle}
                placeholder="Preferred city/state"
                className={inputCls}
              />
            </Field>
            <Field label="Willingness to Work at Site" required>
              <select
                name="willingness_site"
                value={form.willingness_site}
                onChange={handle}
                required
                className={inputCls}
              >
                <option value="">Select</option>
                <option>Yes</option>
                <option>No</option>
              </select>
            </Field>
          </div>

          <Divider />

          <SectionTitle title="Employment History & Summary" />
          <Field
            label="Employment History (Company Name, Designation & Duration with Years of Experience)"
            required
          >
            <textarea
              name="employment_history"
              value={form.employment_history}
              onChange={handle}
              required
              rows={5}
              placeholder="e.g.&#10;1. ABC Solar Pvt Ltd – Site Engineer – Jan 2020 to Dec 2022 (3 years)&#10;2. XYZ Wind Energy – Project Manager – Jan 2023 to Present (2 years)"
              className={textareaCls}
            />
          </Field>
          <Field label="Brief Summary of Key Roles & Responsibilities" required>
            <textarea
              name="brief_summary"
              value={form.brief_summary}
              onChange={handle}
              required
              rows={5}
              placeholder="Summarize your key roles and responsibilities throughout your work experience..."
              className={textareaCls}
            />
          </Field>

          <div className="pt-2">
            {status === "success" && (
              <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                ✅ Your application has been submitted successfully! We'll get
                back to you soon.
              </div>
            )}
            {status === "error" && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                ❌ Something went wrong. Please try again or contact us
                directly.
              </div>
            )}
            <button
              type="submit"
              disabled={status === "sending"}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#3AB257] to-[#329ACD] px-10 py-4 text-base font-bold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:opacity-90 disabled:opacity-60 sm:w-auto"
            >
              {status === "sending" ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function SectionTitle({ title }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-6 w-1 rounded-full bg-gradient-to-b from-[#3AB257] to-[#329ACD]" />
      <h3 className="text-base font-bold text-[#293E52]">{title}</h3>
    </div>
  );
}

function Divider() {
  return <hr className="border-slate-100" />;
}
