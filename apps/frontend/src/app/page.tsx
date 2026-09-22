"use client";

import * as React from "react";
import Link from "next/link";
import { useLanguageStore } from "@/store/languageStore";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import {
  UserGroupIcon,
  BuildingOffice2Icon,
  AcademicCapIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

export default function HomePage() {
  const { t } = useLanguageStore();

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB]">
      {/* Navigation Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-sm">
              सं
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">
                {t("app.title")}
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Civic Tech
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-600">
            <Link href="/challenge" className="hover:text-indigo-600 transition">
              {t("nav.challengeBoard")}
            </Link>
            <Link href="/analytics" className="hover:text-indigo-600 transition flex items-center gap-1">
              <ChartBarIcon className="w-4 h-4 text-indigo-600" />
              {t("nav.analytics")}
            </Link>
            <Link href="#how-it-works" className="hover:text-indigo-600 transition">
              {t("nav.howItWorks")}
            </Link>
            <Link href="#stakeholders" className="hover:text-indigo-600 transition">
              {t("nav.stakeholders")}
            </Link>
          </nav>

          <div className="flex items-center space-x-3">
            <LanguageSwitcher />

            <Link
              href="/login"
              className="border border-gray-300 text-gray-700 bg-white rounded-lg px-3.5 py-1.5 text-sm font-medium hover:bg-gray-50 transition"
            >
              {t("nav.signIn")}
            </Link>
            <Link
              href="/register"
              className="bg-indigo-600 text-white rounded-lg px-3.5 py-1.5 text-sm font-medium hover:bg-indigo-700 transition shadow-sm"
            >
              {t("nav.getStarted")}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs sm:text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
            {t("hero.badge")}
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight max-w-4xl mx-auto leading-tight">
            {t("hero.title")} <span className="text-indigo-600">{t("hero.titleHighlight")}</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {t("hero.subtitle")}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard/citizen/new"
              className="w-full sm:w-auto bg-indigo-600 text-white rounded-lg px-6 py-3 text-base font-semibold hover:bg-indigo-700 transition flex items-center justify-center gap-2 shadow-sm"
            >
              {t("hero.reportCta")}
              <ArrowRightIcon className="w-5 h-5" />
            </Link>
            <Link
              href="/challenge"
              className="w-full sm:w-auto border border-gray-300 text-gray-700 bg-white rounded-lg px-6 py-3 text-base font-semibold hover:bg-gray-50 transition flex items-center justify-center"
            >
              {t("hero.exploreCta")}
            </Link>
          </div>
        </section>

        {/* Four Personas Grid */}
        <section id="stakeholders" className="py-12 bg-white border-y border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                A Multi-Sided Collaboration Engine
              </h2>
              <p className="mt-3 text-gray-600">
                Each stakeholder plays a pivotal role in the problem-to-solution lifecycle.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Persona 1: Citizens */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
                <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                  <UserGroupIcon className="w-6 h-6" />
                </div>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-2">
                  The Reporters
                </span>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("role.citizen")}</h3>
                <p className="text-sm text-gray-600">
                  Report local civic, infrastructure, or environmental issues with GPS tagging and photos.
                </p>
              </div>

              {/* Persona 2: Government */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
                <div className="w-12 h-12 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
                  <BuildingOffice2Icon className="w-6 h-6" />
                </div>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 mb-2">
                  The Verifiers
                </span>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("role.government")}</h3>
                <p className="text-sm text-gray-600">
                  Nodal officers triage incoming grievances, verify authenticity, and approve them for public solving.
                </p>
              </div>

              {/* Persona 3: Universities */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
                <div className="w-12 h-12 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
                  <AcademicCapIcon className="w-6 h-6" />
                </div>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 mb-2">
                  The Solvers
                </span>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("role.university")}</h3>
                <p className="text-sm text-gray-600">
                  Faculty and student teams claim verified challenges for capstones, prototypes, and field deployments.
                </p>
              </div>

              {/* Persona 4: Industry */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
                <div className="w-12 h-12 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                  <BriefcaseIcon className="w-6 h-6" />
                </div>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 mb-2">
                  The Enablers
                </span>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("role.industry")}</h3>
                <p className="text-sm text-gray-600">
                  Corporates provide mentorship, testing equipment, and CSR micro-grants to scale student innovations.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Setu Lifecycle Preview */}
        <section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              The "Setu" Problem-to-Solution Path
            </h2>
            <p className="mt-3 text-gray-600">
              End-to-end transparent tracking from grievance submission to completed resolution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-center">
            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold text-xs inline-flex items-center justify-center mb-2">1</span>
              <h4 className="font-semibold text-sm text-gray-900">1. {t("status.reported")}</h4>
              <p className="text-xs text-gray-500 mt-1">Submitted by citizen with geo-tag & photo</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <span className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 font-bold text-xs inline-flex items-center justify-center mb-2">2</span>
              <h4 className="font-semibold text-sm text-gray-900">2. {t("status.verified")}</h4>
              <p className="text-xs text-gray-500 mt-1">Triage & validation by nodal authority</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <span className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs inline-flex items-center justify-center mb-2">3</span>
              <h4 className="font-semibold text-sm text-gray-900">3. {t("status.claimed")}</h4>
              <p className="text-xs text-gray-500 mt-1">Adopted by faculty & student researchers</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs inline-flex items-center justify-center mb-2">4</span>
              <h4 className="font-semibold text-sm text-gray-900">4. {t("status.supported")}</h4>
              <p className="text-xs text-gray-500 mt-1">Industry pledges mentorship & CSR grant</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <span className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs inline-flex items-center justify-center mb-2">✓</span>
              <h4 className="font-semibold text-sm text-gray-900">5. {t("status.resolved")}</h4>
              <p className="text-xs text-gray-500 mt-1">Deployed on ground & verified with community</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 text-center text-sm text-gray-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} SamadhanSetu. Digital Civic Innovation Platform.</p>
          <div className="flex items-center space-x-4">
            <Link href="/analytics" className="hover:text-indigo-600 transition">
              Impact Analytics
            </Link>
            <Link href="/challenge" className="hover:text-indigo-600 transition">
              Challenge Board
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
