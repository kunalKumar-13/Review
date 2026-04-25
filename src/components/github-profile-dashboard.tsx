"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Star,
  GitCommit,
  GitPullRequest,
  AlertCircle,
  Users,
  Mail,
  MapPin,
  Calendar,
  Code,
  BarChart3,
  Activity,
  TrendingUp,
  Globe,
  Building2,
} from "lucide-react";
import type { ProfileData } from "@/lib/github";


// --- Stat Box ---
function StatBox({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-[#1a1a2e]/60 border border-[#2a2a4a]/50 backdrop-blur-sm">
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <div>
        <p className="text-xs text-gray-400 leading-tight">{label}</p>
        <p className="text-sm font-bold text-white">{value}</p>
      </div>
    </div>
  );
}

// --- Language Bar ---
function LanguageBar({
  languages,
}: {
  languages: { name: string; percentage: number; color: string }[];
}) {
  return (
    <div className="space-y-2">
      <div className="flex h-3 rounded-full overflow-hidden bg-[#1a1a2e]">
        {languages.map((lang) => (
          <motion.div
            key={lang.name}
            initial={{ width: 0 }}
            whileInView={{ width: `${lang.percentage}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full"
            style={{ backgroundColor: lang.color }}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-3">
        {languages.map((lang) => (
          <div key={lang.name} className="flex items-center gap-1.5">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: lang.color }}
            />
            <span className="text-xs text-gray-300">
              {lang.name} {lang.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Commit Chart (simple bar chart) ---
function CommitChart({ data }: { data: number[] }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-1 h-20">
      {data.map((val, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          whileInView={{ height: `${(val / max) * 100}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.05 }}
          className="flex-1 rounded-t-sm bg-gradient-to-t from-pink-500 to-pink-300 min-h-[2px]"
        />
      ))}
    </div>
  );
}

// --- Contribution Graph ---
function ContributionGraph() {
  const weeks = 20;
  const days = 7;
  return (
    <div className="flex gap-[3px]">
      {Array.from({ length: weeks }).map((_, w) => (
        <div key={w} className="flex flex-col gap-[3px]">
          {Array.from({ length: days }).map((_, d) => {
            const intensity = Math.random();
            let bg = "bg-[#161b22]";
            if (intensity > 0.8) bg = "bg-green-400";
            else if (intensity > 0.6) bg = "bg-green-500/70";
            else if (intensity > 0.4) bg = "bg-green-600/50";
            else if (intensity > 0.2) bg = "bg-green-700/30";
            return (
              <motion.div
                key={`${w}-${d}`}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: (w * 7 + d) * 0.003 }}
                className={`w-[10px] h-[10px] rounded-[2px] ${bg}`}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

// --- Main Profile Dashboard ---
export function GitHubProfileDashboard({ data }: { data: ProfileData }) {
  const { user, languages, totalStars, totalCommitsThisYear, totalPRs, totalIssues, topRepos, commitsByHour } = data;
  const joinYear = new Date(user.created_at).getFullYear();

  return (
    <div className="w-full h-full overflow-y-auto overflow-x-hidden bg-[#0d1117] p-3 md:p-6 rounded-2xl custom-scrollbar">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-center gap-4 mb-6 p-4 rounded-2xl bg-gradient-to-r from-[#1a1a2e]/80 to-[#16213e]/80 border border-[#2a2a4a]/40"
      >
        <img
          src={user.avatar_url}
          alt={user.login}
          className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-purple-500/40 flex-shrink-0"
        />
        <div className="text-center md:text-left flex-1">
          <h2 className="text-xl md:text-2xl font-bold text-white">
            {user.name || user.login}
          </h2>
          <p className="text-sm text-gray-400 mt-1">{user.bio || "GitHub User"}</p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-2 text-xs text-gray-400">
            {user.email && (
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3" /> {user.email}
              </span>
            )}
            {user.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {user.location}
              </span>
            )}
            {user.company && (
              <span className="flex items-center gap-1">
                <Building2 className="w-3 h-3" /> {user.company}
              </span>
            )}
            {user.blog && (
              <span className="flex items-center gap-1">
                <Globe className="w-3 h-3" /> {user.blog}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Joined {joinYear}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" /> {user.followers} followers · {user.following} following
            </span>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <StatBox icon={Star} label="Total Stars" value={totalStars} color="bg-yellow-600/80" />
        <StatBox icon={GitCommit} label="Recent Commits" value={totalCommitsThisYear} color="bg-green-600/80" />
        <StatBox icon={GitPullRequest} label="Recent PRs" value={totalPRs} color="bg-purple-600/80" />
        <StatBox icon={AlertCircle} label="Recent Issues" value={totalIssues} color="bg-red-600/80" />
        <StatBox icon={Code} label="Public Repos" value={user.public_repos} color="bg-blue-600/80" />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Top Languages by Repo */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="p-4 rounded-2xl bg-gradient-to-br from-[#1a1a2e]/60 to-[#0d1117] border border-[#2a2a4a]/40"
        >
          <div className="flex items-center gap-2 mb-4">
            <Code className="w-4 h-4 text-pink-400" />
            <h3 className="text-sm font-bold text-pink-400">Top Languages by Repo</h3>
          </div>
          <LanguageBar languages={languages} />
        </motion.div>

        {/* Top Languages by Commit */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="p-4 rounded-2xl bg-gradient-to-br from-[#1a1a2e]/60 to-[#0d1117] border border-[#2a2a4a]/40"
        >
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-pink-400" />
            <h3 className="text-sm font-bold text-pink-400">Top Languages by Commit</h3>
          </div>
          <LanguageBar
            languages={[
              { name: "JavaScript", percentage: 75, color: "#f1e05a" },
              { name: "CSS", percentage: 25, color: "#563d7c" },
            ]}
          />
        </motion.div>
      </div>

      {/* Commits Chart + Contribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Commits by Hour */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="p-4 rounded-2xl bg-gradient-to-br from-[#1a1a2e]/60 to-[#0d1117] border border-[#2a2a4a]/40"
        >
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-pink-400" />
            <h3 className="text-sm font-bold text-pink-400">Commits (UTC +8.00)</h3>
          </div>
          <CommitChart data={commitsByHour} />
          <div className="flex justify-between mt-2 text-[10px] text-gray-500">
            <span>0</span>
            <span>6</span>
            <span>12</span>
            <span>18</span>
            <span>23</span>
          </div>
          <p className="text-[10px] text-gray-500 text-center mt-1">per day hour</p>
        </motion.div>

        {/* Contribution Graph */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="p-4 rounded-2xl bg-gradient-to-br from-[#1a1a2e]/60 to-[#0d1117] border border-[#2a2a4a]/40"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-pink-400" />
            <h3 className="text-sm font-bold text-pink-400">Contributions in the Last Year</h3>
          </div>
          <div className="overflow-x-auto">
            <ContributionGraph />
          </div>
          <div className="flex items-center gap-1 mt-3 text-[10px] text-gray-500 justify-end">
            <span>Less</span>
            <div className="w-2.5 h-2.5 rounded-[2px] bg-[#161b22]" />
            <div className="w-2.5 h-2.5 rounded-[2px] bg-green-700/30" />
            <div className="w-2.5 h-2.5 rounded-[2px] bg-green-600/50" />
            <div className="w-2.5 h-2.5 rounded-[2px] bg-green-500/70" />
            <div className="w-2.5 h-2.5 rounded-[2px] bg-green-400" />
            <span>More</span>
          </div>
        </motion.div>
      </div>

      {/* Repository Highlights */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="p-4 rounded-2xl bg-gradient-to-br from-[#1a1a2e]/60 to-[#0d1117] border border-[#2a2a4a]/40"
      >
        <div className="flex items-center gap-2 mb-4">
          <Code className="w-4 h-4 text-pink-400" />
          <h3 className="text-sm font-bold text-pink-400">Top Repositories</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {topRepos.map((repo) => (
            <a
              key={repo.name}
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-[#1a1a2e]/40 border border-[#2a2a4a]/30 hover:border-purple-500/40 transition-colors block"
            >
              <p className="text-sm font-semibold text-blue-400">{repo.name}</p>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{repo.description || "No description"}</p>
              <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                {repo.language && (
                  <span className="flex items-center gap-1">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor:
                          data.languages.find((l) => l.name === repo.language)?.color || "#8b8b8b",
                      }}
                    />
                    {repo.language}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3" /> {repo.stargazers_count}
                </span>
              </div>
            </a>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
