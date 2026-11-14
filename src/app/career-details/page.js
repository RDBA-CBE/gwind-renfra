

"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";
import InnerBanner from "@/components/Inner-Banner";
import { axiosGet, axiosPostForm } from "@/lib/api";

function JobDetailsContent() {
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId");
  const [fileName, setFileName] = useState("");
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [noJobFound, setNoJobFound] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
    cv_name: "",
    cv: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchJob() {
      if (!jobId) {
        setNoJobFound(true);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setNoJobFound(false);

        const res = await axiosGet.get(
          `/masters/career/get/?job_id=${jobId}&web_sts=1`
        );

        const raw = res.data.data || [];

        const formatted = raw.map((item) => ({
          id: item.data_uniq_id,
          title: item.title,
          type: item.job_type,
          requirements: item.description,
          level: item.role_type,
          salary: item.salary_range,
          data_uniq_id: item.data_uniq_id,
          key_responsibilities: item.key_responsibilities,
          job_id: item.job_id,
          location: item.city_name || item.state_name,
          ref_job_id: item.data_uniq_id,
          ref_location_id: item.city_id,
          required_skills: item.required_skills,
        }));

        setJob(formatted[0] || null);
        setNoJobFound(!formatted[0]);
      } catch (error) {
        console.log("Job Details Error:", error);
        setNoJobFound(true);
      } finally {
        setLoading(false);
      }
    }

    fetchJob();
  }, [jobId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading job details...
      </div>
    );
  }

  if (noJobFound || !job) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center text-center">
        <h1 className="mb-4 text-xl font-bold text-red-500">Job Not Found</h1>
        <Link href="/career" className="text-blue-600 underline">
          Back to Careers
        </Link>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("File size should be less than 5MB");
      event.target.value = "";
      return;
    }

    setFileName(file.name);
    setFormData((prev) => ({
      ...prev,
      cv_name: file.name,
    }));

    const reader = new FileReader();

    reader.onload = () => {
      const base64String = reader.result.split(",")[1];
      setFormData((prev) => ({
        ...prev,
        cv: base64String,
      }));
    };

    reader.onerror = () => {
      alert("Error reading the file. Please try again.");
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!captchaToken) {
      alert("Please complete the reCAPTCHA before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        data_uniq_id: job.data_uniq_id,
        name: formData.name,
        email: formData.email,
        mobile: formData.phone,
        qualification: "B.E",
        ref_job_id: job.ref_job_id,
        image_name: formData.cv_name,
        image: formData.cv,
        message: formData.message || "Submitted",
        captcha_token: captchaToken,
      };

      const response = await axiosPostForm.post(
        "/masters/registration/?web_sts=1",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
          maxBodyLength: Infinity,
          maxContentLength: Infinity,
          transformRequest: (data, headers) => {
            delete headers.common?.Authorization;
            return JSON.stringify(data);
          },
        }
      );

      if (response?.data?.action !== "success") {
        throw new Error(response?.data?.message || "Submission failed");
      }

      alert("Application submitted successfully!");

      setFormData({
        name: "",
        phone: "",
        email: "",
        message: "",
        cv_name: "",
        cv: "",
      });
      setFileName("");
      setCaptchaToken("");
      if (document.getElementById("file-input")) {
        document.getElementById("file-input").value = "";
      }
    } catch (error) {
      console.log("Registration Error:", error);
      alert("Something went wrong. Try again.");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 border-b bg-white">
        <div className="mx-auto max-w-[85rem] px-4 py-4 2xl:max-w-[90rem]">
          <Link
            href="/career"
            className="inline-flex items-center gap-2 text-[#329ACD]"
          >
            <ChevronLeft className="h-5 w-5" />
            Back to Careers
          </Link>
        </div>
      </div>

      <div className="mx-auto grid max-w-[85rem] grid-cols-1 gap-10 px-4 py-10 lg:grid-cols-3 2xl:max-w-[90rem]">
        <div className="space-y-10 lg:col-span-2">
          <h1 className="mb-3 text-3xl font-bold text-[#293E52]">{job.title}</h1>

          <div className="flex flex-wrap gap-6 text-sm text-[#293E52]">
            {job?.salary ? (
              <div className="flex items-center gap-2">
                <img src="/images/sal.svg" alt="Salary" className="h-4 w-4" />
                <span>{job.salary}</span>
              </div>
            ) : null}

            {job.location && (
              <div className="flex items-center gap-2">
                <img src="/images/loc.svg" alt="Location" className="h-4 w-4" />
                <span>{job.location}</span>
              </div>
            )}

            {job.type && (
              <div className="flex items-center gap-2">
                <img src="/images/work.svg" alt="Work type" className="h-4 w-4" />
                <span>{job.type}</span>
              </div>
            )}
          </div>

          <h2 className="mb-3 text-xl font-semibold">Key Responsibilities</h2>
          <div
            className="text-[#293E52] [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1"
            dangerouslySetInnerHTML={{ __html: job.key_responsibilities || "" }}
          />

          <h2 className="mb-3 text-xl font-semibold">Job Requirements</h2>
          <div
            className="text-[#293E52] [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1"
            dangerouslySetInnerHTML={{ __html: job.requirements || "" }}
          />

          <h2 className="mb-3 text-xl font-semibold">Required Skills</h2>
          <div
            className="text-[#293E52] [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1"
            dangerouslySetInnerHTML={{ __html: job.required_skills || "" }}
          />

          <div className="flex flex-col gap-2">
            <p className="text-md font-semibold text-[#293E52]">
              Send your complete CV with expected salary to{" "}
              <a href="mailto:hr@renfraenergy.com" className="text-[#329ACD] hover:underline">
                hr@renfraenergy.com
              </a>{" "}
              mentioning the Job ID and vacancy in the subject, or fill out the
              form with relevant details.
            </p>
            <p className="text-sm text-[#293E52]">
              <span className="font-semibold text-red-600">*</span> Please note that only shortlisted candidates will be contacted.
            </p>
          </div>
        </div>

        <div className="h-fit rounded-lg border bg-white p-6 shadow-md lg:sticky lg:top-24">
          <h2 className="mb-6 text-2xl font-bold text-[#293E52]">Apply Now</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full rounded border border-gray-300 px-4 py-2"
              placeholder="Full Name"
            />

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="w-full rounded border border-gray-300 px-4 py-2"
              placeholder="Phone Number"
            />

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full rounded border border-gray-300 px-4 py-2"
              placeholder="Email Address"
            />

            <textarea
              name="message"
              maxLength={500}
              value={formData.message}
              onChange={handleInputChange}
              rows={4}
              className="w-full rounded border border-gray-300 px-4 py-2"
              placeholder="Your Message"
            />

            <div className="relative inline-block w-full">
              <input
                type="file"
                id="file-input"
                className="hidden"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                required
              />

              <input
                type="text"
                value={fileName || "Upload CV"}
                readOnly
                onClick={() => document.getElementById("file-input")?.click()}
                className={`w-full rounded border border-gray-300 bg-white py-2 pl-3 pr-9 ${
                  fileName ? "text-black" : "text-gray-500"
                } cursor-pointer`}
              />

              {fileName && (
                <span
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer text-lg font-bold text-red-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFileName("");
                    setFormData((prev) => ({ ...prev, cv_name: "", cv: "" }));
                    const fileInput = document.getElementById("file-input");
                    if (fileInput) fileInput.value = "";
                  }}
                >
                  ✖
                </span>
              )}
            </div>

            <div className="flex items-start gap-2 text-sm text-[#293E52]">
              <input
                type="checkbox"
                id="terms"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-1"
              />
              <label htmlFor="terms">
                I agree to the{" "}
                <Link href="/terms-and-conditions" className="text-[#329ACD] underline">
                  Terms & Conditions
                </Link>{" "}
                and Privacy Policy.
              </label>
            </div>

            <ReCAPTCHA
              sitekey={
                process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ||
                "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
              }
              onChange={(token) => setCaptchaToken(token || "")}
              onExpired={() => setCaptchaToken("")}
            />

            <button
              type="submit"
              disabled={isSubmitting || !acceptTerms}
              className={`w-full rounded-lg py-3 font-semibold text-white ${
                acceptTerms
                  ? "bg-gradient-to-r from-[#329ACD] to-[#3AB257]"
                  : "cursor-not-allowed bg-gray-400"
              }`}
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function JobDetailsPage() {
  return (
    <>
      <InnerBanner title="Career Details" bgImage="/images/career-bg.svg" />
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center">Loading...</div>
        }
      >
        <JobDetailsContent />
      </Suspense>
    </>
  );
}