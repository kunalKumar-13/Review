"use client";

import React, { useRef, useCallback } from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { BackgroundPaths } from "@/components/ui/background-paths";
import { FloatingCard } from "@/components/ui/floating-card";
import { GitHubProfileDashboard } from "@/components/github-profile-dashboard";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  GitCommit,
  GitPullRequest,
  AlertCircle,
  Users,
  Download,
  ArrowDown,
  Github,
  Code,
  TrendingUp,
  Search,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { fetchGitHubProfile, type ProfileData } from "@/lib/github";

export default function HomePage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = React.useState(false);
  const [username, setUsername] = React.useState("");
  const [profileData, setProfileData] = React.useState<ProfileData | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSearch = useCallback(async () => {
    const trimmed = username.trim();
    if (!trimmed) return;
    setLoading(true);
    setError(null);
    setProfileData(null);
    try {
      const data = await fetchGitHubProfile(trimmed);
      setProfileData(data);
      // Scroll to results after a brief delay
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [username]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleDownloadPDF = async () => {
    if (!pageRef.current || downloading) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(pageRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: "#0a0a0a",
        cacheBust: true,
        filter: (node: HTMLElement) => {
          // Skip the fixed download button itself from the capture
          if (node?.classList?.contains?.("fixed")) return false;
          return true;
        },
      });
      // Get dimensions from the image
      const img = new Image();
      img.src = dataUrl;
      await new Promise((resolve) => { img.onload = resolve; });
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [img.width, img.height],
      });
      pdf.addImage(dataUrl, "PNG", 0, 0, img.width, img.height);
      pdf.save(`${profileData?.user.login || "github"}-profile-review.pdf`);
    } catch (err) {
      console.error("Failed to generate PDF:", err);
    } finally {
      setDownloading(false);
    }
  };

  const d = profileData; // shorthand

  return (
    <div className="dark bg-neutral-950 min-h-screen" ref={pageRef}>
      {/* ========= HERO SECTION with Background Paths ========= */}
      <BackgroundPaths title="GITHUB PROFILE REVIEW">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="flex flex-col items-center gap-6 mt-4"
        >
          <p className="text-lg text-gray-400 max-w-xl">
            Enter any GitHub username to get a comprehensive animated review of
            their profile stats, languages, contributions, and more.
          </p>

          {/* === Username Search Input === */}
          <div className="flex items-center gap-2 w-full max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter GitHub username..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 dark:bg-black/40 border border-white/20 dark:border-white/10 text-white placeholder-gray-500 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSearch}
              disabled={loading || !username.trim()}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 transition-opacity"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
              {loading ? "Loading..." : "Search"}
            </motion.button>
          </div>

          {/* Error message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2 text-red-400 bg-red-900/20 border border-red-800/30 px-4 py-2 rounded-xl"
              >
                <AlertTriangle className="w-4 h-4" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {!profileData && !loading && (
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ArrowDown className="w-8 h-8 text-gray-500" />
            </motion.div>
          )}
        </motion.div>
      </BackgroundPaths>

      {/* ========= RESULTS SECTION — only shown after data loads ========= */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-32 gap-4"
          >
            <Loader2 className="w-12 h-12 text-purple-400 animate-spin" />
            <p className="text-gray-400 text-lg">
              Fetching <span className="text-purple-400 font-semibold">{username}</span>&apos;s profile...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {d && (
        <motion.div
          ref={resultsRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* ========= FLOATING STATS OVERVIEW ========= */}
          <section className="relative py-20 px-4 md:px-8 bg-neutral-950 overflow-hidden">
            <div className="absolute top-10 left-10 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl" />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center mb-8"
            >
              <img
                src={d.user.avatar_url}
                alt={d.user.login}
                className="w-24 h-24 rounded-full border-4 border-purple-500/40 shadow-xl shadow-purple-900/20 mb-4"
              />
              <h2 className="text-3xl md:text-5xl font-bold text-center text-white">
                {d.user.name || d.user.login}
              </h2>
              <p className="text-gray-400 mt-2 text-center max-w-md">
                {d.user.bio || "GitHub User"}
              </p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center text-gray-400 mb-16 max-w-md mx-auto"
            >
              Key metrics from{" "}
              <span className="text-purple-400 font-semibold">
                {d.user.login}
              </span>
            </motion.p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                {
                  icon: Star,
                  label: "Total Stars",
                  value: String(d.totalStars),
                  color: "from-yellow-500 to-yellow-700",
                  delay: 0,
                  floatDuration: 3.5,
                },
                {
                  icon: GitCommit,
                  label: "Recent Commits",
                  value: String(d.totalCommitsThisYear),
                  color: "from-green-500 to-green-700",
                  delay: 0.1,
                  floatDuration: 4,
                },
                {
                  icon: GitPullRequest,
                  label: "Recent Pull Requests",
                  value: String(d.totalPRs),
                  color: "from-purple-500 to-purple-700",
                  delay: 0.2,
                  floatDuration: 4.5,
                },
                {
                  icon: AlertCircle,
                  label: "Recent Issues",
                  value: String(d.totalIssues),
                  color: "from-red-500 to-red-700",
                  delay: 0.3,
                  floatDuration: 3.8,
                },
                {
                  icon: Users,
                  label: "Followers",
                  value: String(d.user.followers),
                  color: "from-blue-500 to-blue-700",
                  delay: 0.4,
                  floatDuration: 4.2,
                },
                {
                  icon: Code,
                  label: "Public Repos",
                  value: String(d.user.public_repos),
                  color: "from-amber-500 to-amber-700",
                  delay: 0.5,
                  floatDuration: 3.6,
                },
              ].map((stat) => (
                <FloatingCard
                  key={stat.label}
                  delay={stat.delay}
                  floatDuration={stat.floatDuration}
                  floatDistance={10}
                >
                  <div className="relative group p-6 rounded-2xl bg-[#111827]/80 border border-[#1f2937] backdrop-blur-sm hover:border-purple-500/40 transition-all duration-300 cursor-default">
                    <div
                      className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                    />
                    <div className="relative flex items-center gap-4">
                      <div
                        className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}
                      >
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">{stat.label}</p>
                        <p className="text-2xl font-bold text-white">
                          {stat.value}
                        </p>
                      </div>
                    </div>
                  </div>
                </FloatingCard>
              ))}
            </div>
          </section>

          {/* ========= LANGUAGES SECTION ========= */}
          <section className="relative py-20 px-4 md:px-8 bg-neutral-950 overflow-hidden">
            <div className="absolute top-20 right-20 w-96 h-96 bg-pink-600/5 rounded-full blur-3xl" />

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-bold text-center text-white mb-16"
            >
              Languages &amp; Technologies
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <FloatingCard delay={0} floatDuration={5} floatDistance={8}>
                <div className="p-6 rounded-2xl bg-[#111827]/80 border border-[#1f2937] min-h-[200px]">
                  <div className="flex items-center gap-2 mb-6">
                    <TrendingUp className="w-5 h-5 text-pink-400" />
                    <h3 className="text-lg font-bold text-pink-400">
                      By Repository
                    </h3>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="relative w-32 h-32 flex-shrink-0">
                      <svg viewBox="0 0 36 36" className="w-full h-full">
                        <circle
                          cx="18"
                          cy="18"
                          r="14"
                          fill="none"
                          stroke="#1f2937"
                          strokeWidth="4"
                        />
                        {d.languages.slice(0, 4).reduce(
                          (acc, lang, i) => {
                            const circumference = 2 * Math.PI * 14; // ~87.96
                            const dashLen =
                              (lang.percentage / 100) * circumference;
                            const gapLen = circumference - dashLen;
                            acc.elements.push(
                              <motion.circle
                                key={lang.name}
                                cx="18"
                                cy="18"
                                r="14"
                                fill="none"
                                stroke={lang.color}
                                strokeWidth="4"
                                strokeDasharray={`${dashLen} ${gapLen}`}
                                strokeDashoffset={-acc.offset}
                                initial={{ strokeDasharray: `0 ${circumference}` }}
                                whileInView={{
                                  strokeDasharray: `${dashLen} ${gapLen}`,
                                }}
                                viewport={{ once: true }}
                                transition={{ duration: 1, delay: i * 0.2 }}
                              />
                            );
                            acc.offset += dashLen;
                            return acc;
                          },
                          { elements: [] as React.ReactNode[], offset: 0 }
                        ).elements}
                      </svg>
                    </div>
                    <div className="space-y-3">
                      {d.languages.slice(0, 6).map((l) => (
                        <div
                          key={l.name}
                          className="flex items-center gap-2"
                        >
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: l.color }}
                          />
                          <span className="text-sm text-gray-300">
                            {l.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {l.percentage}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </FloatingCard>

              <FloatingCard delay={0.15} floatDuration={4.5} floatDistance={8}>
                <div className="p-6 rounded-2xl bg-[#111827]/80 border border-[#1f2937] min-h-[200px]">
                  <div className="flex items-center gap-2 mb-6">
                    <TrendingUp className="w-5 h-5 text-pink-400" />
                    <h3 className="text-lg font-bold text-pink-400">
                      Top Repositories
                    </h3>
                  </div>
                  <div className="space-y-3 max-h-56 overflow-y-auto custom-scrollbar pr-1">
                    {d.topRepos.slice(0, 6).map((repo) => (
                      <a
                        key={repo.name}
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-2 rounded-lg bg-[#1a1a2e]/40 hover:bg-[#1a1a2e]/70 transition-colors"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {repo.language && (
                            <div
                              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                              style={{
                                backgroundColor:
                                  d.languages.find(
                                    (l) => l.name === repo.language
                                  )?.color || "#8b8b8b",
                              }}
                            />
                          )}
                          <span className="text-sm text-blue-400 truncate">
                            {repo.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 flex-shrink-0 ml-2">
                          <Star className="w-3 h-3" />{" "}
                          {repo.stargazers_count}
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </FloatingCard>
            </div>
          </section>

          {/* ========= SCROLL ANIMATION SECTION with Dashboard ========= */}
          <section className="bg-neutral-950">
            <div className="flex flex-col overflow-hidden">
              <ContainerScroll
                titleComponent={
                  <>
                    <h1 className="text-4xl font-semibold text-white">
                      Explore the full <br />
                      <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                        Profile Dashboard
                      </span>
                    </h1>
                  </>
                }
              >
                <GitHubProfileDashboard data={d} />
              </ContainerScroll>
            </div>
          </section>

          {/* ========= ACTIVITY SECTION with Floating Boxes ========= */}
          <section className="relative py-20 px-4 md:px-8 bg-neutral-950 overflow-hidden">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-3xl" />

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-bold text-center text-white mb-16"
            >
              Activity &amp; Contributions
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Commits Chart */}
              <FloatingCard delay={0} floatDuration={4} floatDistance={10}>
                <div className="p-6 rounded-2xl bg-[#111827]/80 border border-[#1f2937]">
                  <h3 className="text-lg font-bold text-pink-400 mb-4 flex items-center gap-2">
                    <Github className="w-5 h-5" /> Commits by Hour
                  </h3>
                  <div className="flex items-end gap-1 h-28">
                    {d.commitsByHour.map((val, i) => {
                      const max = Math.max(...d.commitsByHour, 1);
                      return (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          whileInView={{
                            height: `${(val / max) * 100}%`,
                          }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.6, delay: i * 0.04 }}
                          className="flex-1 rounded-t bg-gradient-to-t from-pink-600 to-pink-300 min-h-[3px]"
                        />
                      );
                    })}
                  </div>
                  <div className="flex justify-between mt-3 text-xs text-gray-500">
                    <span>0</span>
                    <span>6</span>
                    <span>12</span>
                    <span>18</span>
                    <span>23</span>
                  </div>
                </div>
              </FloatingCard>

              {/* Profile Details */}
              <FloatingCard delay={0.15} floatDuration={4.5} floatDistance={10}>
                <div className="p-6 rounded-2xl bg-[#111827]/80 border border-[#1f2937]">
                  <h3 className="text-lg font-bold text-pink-400 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" /> Profile Summary
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      {
                        label: "Public Repos",
                        value: String(d.user.public_repos),
                      },
                      {
                        label: "Followers",
                        value: String(d.user.followers),
                      },
                      {
                        label: "Following",
                        value: String(d.user.following),
                      },
                      {
                        label: "Total Stars",
                        value: String(d.totalStars),
                      },
                      {
                        label: "Total Forks",
                        value: String(d.totalForks),
                      },
                      {
                        label: "Gists",
                        value: String(d.user.public_gists),
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="text-center p-3 rounded-xl bg-[#1a1a2e]/60"
                      >
                        <p className="text-xl font-bold text-white">
                          {item.value}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {item.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </FloatingCard>
            </div>
          </section>
        </motion.div>
      )}

      {/* ========= DOWNLOAD PDF BUTTON (Fixed) — only visible when data loaded ========= */}
      {d && (
        <motion.button
          onClick={handleDownloadPDF}
          disabled={downloading}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-8 right-8 z-50 flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-2xl shadow-purple-900/50 hover:shadow-purple-800/60 transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-5 h-5" />
          {downloading ? "Generating..." : "Download as PDF"}
        </motion.button>
      )}
    </div>
  );
}
