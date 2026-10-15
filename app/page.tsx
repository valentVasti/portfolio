import type { CSSProperties } from "react";
import Image from "next/image";
import {
  ArrowDownRightIcon,
  ArrowUpIcon,
  ArrowUpRightIcon,
  CodeIcon,
  EnvelopeSimpleIcon,
  InfinityIcon,
  LinkedinLogoIcon,
  PhoneIcon,
  SparkleIcon,
} from "@phosphor-icons/react/dist/ssr";
import { EXPERIENCE, PROJECTS, ROLES, SKILLS, TECH_LOGOS } from "./data";
import Nav from "./components/nav";
import HeroCanvas from "./components/hero-canvas";
import Scramble from "./components/scramble";
import CountUp from "./components/count-up";
import ExperienceTabs from "./components/experience-tabs";
import ProjectView from "./components/project-view";
import PageEffects from "./components/page-effects";
import FallbackImg from "./components/fallback-img";
import CopyButton from "./components/copy-button";
import portrait from "../public/images/potrait.jpeg";
import quizCard from "../public/images/projects/quiz-card.webp";
import medicalCard from "../public/images/projects/medical-card.webp";
import laundryCard from "../public/images/projects/laundry-card.webp";
import weddingCard from "../public/images/projects/wedding-card.webp";

/** Animation delay for reveal and hero animations. Children of a stagger group step 90ms apart. */
const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;
const stagger = (i: number) => d(i * 90);

const [quiz, medical, laundry, wedding] = PROJECTS;

const CONTACTS = [
  {
    href: "mailto:valentvasti2114@gmail.com",
    icon: EnvelopeSimpleIcon,
    label: "Email",
    value: "valentvasti2114@gmail.com",
    copy: "valentvasti2114@gmail.com",
    breakAll: true,
  },
  {
    href: "tel:+6287889383942",
    icon: PhoneIcon,
    label: "Phone",
    value: "+62 878 893 83942",
    copy: "+6287889383942",
    breakAll: false,
  },
  {
    href: "https://www.linkedin.com/in/valentvasti",
    icon: LinkedinLogoIcon,
    label: "LinkedIn",
    value: "linkedin.com/in/valentvasti",
    copy: "https://www.linkedin.com/in/valentvasti",
    breakAll: true,
    external: true,
  },
];

export default function Home() {
  return (
    <>
      <div id="app">
        <Nav />

        <main>
          {/* HERO */}
          <section id="top" className="relative min-h-[100dvh] overflow-hidden">
            <HeroCanvas />
            <div className="scrim pointer-events-none absolute inset-0" />
            <div className="hero-fade-bottom pointer-events-none absolute inset-x-0 bottom-0 h-32" />

            <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-7xl flex-col justify-end px-5 pb-14 pt-24 md:justify-center md:px-8 md:pb-16">
              <p className="hero-fade min-h-5 font-mono text-[0.78rem] uppercase tracking-[0.2em] text-accent" style={d(200)}>
                <span className="sr-only">{ROLES.join(", ")}</span>
                <Scramble words={ROLES} />
              </p>

              <h1 className="hero-h1 mt-6 max-w-5xl">
                <span className="line"><span className="line-inner font-light" style={d(450)}>Hi, I&apos;m</span></span>
                <span className="line"><span className="line-inner font-medium" style={d(600)}>Valent<span className="text-accent">.</span></span></span>
              </h1>

              <div className="hero-fade mt-10 flex flex-wrap items-center gap-3" style={d(1000)}>
                <a href="#projects" className="btn btn-solid">View projects <ArrowDownRightIcon /></a>
                <a href="#contact" className="btn btn-ghost">Contact</a>
              </div>
            </div>
          </section>

          {/* TECH STACK (logos only; the single marquee on the page) */}
          <section aria-label="Technologies" className="border-y border-line py-10">
            <div className="marquee-wrap overflow-hidden">
              <div className="marquee gap-16 pr-16">
                {TECH_LOGOS.map((l) => (
                  <FallbackImg
                    key={l.slug}
                    src={`https://cdn.simpleicons.org/${l.slug}/ededed`}
                    alt={l.name}
                    className="h-7 w-auto opacity-70"
                    style={{ filter: "var(--logo-filter)" }}
                  />
                ))}
                {/* duplicate set for the seamless loop */}
                {TECH_LOGOS.map((l) => (
                  <FallbackImg
                    key={`dup-${l.slug}`}
                    data-dup=""
                    aria-hidden="true"
                    src={`https://cdn.simpleicons.org/${l.slug}/ededed`}
                    alt=""
                    className="h-7 w-auto opacity-70"
                    style={{ filter: "var(--logo-filter)" }}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* ABOUT */}
          <section id="about" className="mx-auto max-w-7xl px-5 py-28 md:px-8 md:py-40">
            <div className="grid items-center gap-12 md:grid-cols-12 md:gap-8">
              <div className="md:col-span-4" data-reveal>
                <div className="scan relative aspect-[4/5] overflow-hidden bg-surface">
                  <Image
                    src={portrait}
                    alt="Portrait of Metodius Frenaldy Vasti Valentino"
                    fill
                    sizes="(min-width: 1280px) 400px, (min-width: 768px) 33vw, 100vw"
                    placeholder="blur"
                    className="object-cover grayscale contrast-110"
                  />
                </div>
              </div>
              <div className="md:col-span-7 md:col-start-6">
                <h2 className="h2" data-reveal><span className="text-accent">&quot;</span>Building software is about more than writing good code<span className="text-accent">&quot;</span></h2>
                <p className="body mt-8" data-reveal style={d(120)}>
                  It&apos;s about understanding the problem, working well with people, and delivering something that genuinely helps the business.
                </p>
                <p className="body mt-5" data-reveal style={d(200)}>
                  I use AI tools to speed up development, from drafting code to debugging and documentation. To me, AI is a multiplier, not a replacement. It takes care of repetitive work so I can focus on architecture, code review and sound technical decisions.
                </p>
              </div>
            </div>
          </section>

          {/* EXPERIENCE YEARS (number from the resume) */}
          <section id="impact" className="mx-auto max-w-7xl px-5 pb-28 md:px-8 md:pb-40">
            <div className="flex flex-col gap-4 border-t border-line pt-6 md:flex-row md:items-end md:gap-8" data-reveal>
              <p className="font-mono text-7xl leading-none tracking-tighter text-accent md:text-9xl">
                <CountUp to={3} suf="+" />
              </p>
              <p className="max-w-[30ch] text-lg text-mute md:pb-2">years building web applications, including internships.</p>
            </div>
          </section>

          {/* EXPERIENCE (master-detail) */}
          <section id="experience" className="mx-auto max-w-7xl px-5 py-28 md:px-8 md:py-40">
            <h2 className="h2 max-w-3xl" data-reveal>Where I have worked<span className="text-accent">.</span></h2>
            <div className="mt-16 grid gap-8 md:grid-cols-12 md:gap-12" data-reveal>
              <ExperienceTabs items={EXPERIENCE} />
            </div>
          </section>

          {/* PROJECTS (bento of three cells, plus a full-width fourth card) */}
          <section id="projects" className="mx-auto max-w-7xl px-5 py-28 md:px-8 md:py-40">
            <h2 className="h2" data-reveal>Selected projects<span className="text-accent">.</span></h2>
            <div className="mt-16 grid gap-4 md:grid-cols-12 md:grid-rows-2">
              <a href={`#/project/${quiz.slug}`} className="spot group flex flex-col md:col-span-7 md:row-span-2" data-spot data-reveal style={stagger(0)}>
                <div className="relative min-h-72 flex-1 overflow-hidden">
                  <Image
                    src={quizCard}
                    alt=""
                    fill
                    sizes="(min-width: 1280px) 720px, (min-width: 768px) 58vw, 100vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6 md:p-8">
                  <div className="flex items-start justify-between gap-6">
                    <h3 className="text-2xl font-medium leading-tight tracking-tight md:text-4xl">{quiz.title}</h3>
                    <ArrowUpRightIcon className="mt-1 shrink-0 text-2xl text-mute transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                  </div>
                  <p className="mt-4 max-w-[60ch] text-mute">A web quiz for a university exhibition that suggests a study program to high-school students, with an admin portal for results and charts.</p>
                  <p className="mt-5 font-mono text-sm text-mute">{quiz.period}</p>
                </div>
              </a>

              <a href={`#/project/${medical.slug}`} className="spot group flex flex-col md:col-span-5" data-spot data-reveal style={stagger(1)}>
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={medicalCard}
                    alt=""
                    fill
                    sizes="(min-width: 1280px) 520px, (min-width: 768px) 42vw, 100vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-xl font-medium leading-tight tracking-tight md:text-2xl">{medical.title}</h3>
                    <ArrowUpRightIcon className="mt-1 shrink-0 text-xl text-mute transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-mute">A research prototype that stores patient records on a blockchain, where hospitals and doctors see full records only with patient permission.</p>
                  <p className="mt-4 font-mono text-sm text-mute">Aug 2024 - May 2025</p>
                </div>
              </a>

              <a href={`#/project/${laundry.slug}`} className="spot group flex flex-col md:col-span-5" data-spot data-reveal style={stagger(2)}>
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={laundryCard}
                    alt=""
                    fill
                    sizes="(min-width: 1280px) 520px, (min-width: 768px) 42vw, 100vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-xl font-medium leading-tight tracking-tight md:text-2xl">{laundry.title}</h3>
                    <ArrowUpRightIcon className="mt-1 shrink-0 text-xl text-mute transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-mute">A real-time queue system for self-service laundry with supervisor-managed queues, a RESTful API and a Progressive Web App front end.</p>
                  <p className="mt-4 font-mono text-sm text-mute">{laundry.period}</p>
                </div>
              </a>

              <a href={`#/project/${wedding.slug}`} className="spot group flex flex-col md:col-span-12 md:flex-row" data-spot data-reveal style={stagger(3)}>
                <div className="relative h-56 overflow-hidden md:h-auto md:min-h-80 md:w-7/12">
                  <Image
                    src={weddingCard}
                    alt=""
                    fill
                    sizes="(min-width: 1280px) 720px, (min-width: 768px) 58vw, 100vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col justify-center p-6 md:w-5/12 md:p-8">
                  <div className="flex items-start justify-between gap-6">
                    <h3 className="text-2xl font-medium leading-tight tracking-tight md:text-3xl">{wedding.title}</h3>
                    <ArrowUpRightIcon className="mt-1 shrink-0 text-2xl text-mute transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                  </div>
                  <p className="mt-4 max-w-[60ch] text-mute">A personalised digital wedding invitation that opens like an envelope and guides guests through the couple, ceremony and reception details, scene by scene.</p>
                  <p className="mt-5 font-mono text-sm text-mute">{wedding.period}</p>
                </div>
              </a>
            </div>
          </section>

          {/* SKILLS (asymmetric grouped chunks) */}
          <section id="skills" className="mx-auto max-w-7xl px-5 py-28 md:px-8 md:py-40">
            <h2 className="h2" data-reveal>What I work with<span className="text-accent">.</span></h2>
            <div className="mt-16 grid gap-x-8 gap-y-14 md:grid-cols-12">
              {SKILLS.map((g, i) => (
                <div key={g.title} className={`border-t border-line pt-6 ${g.span}`} data-reveal style={stagger(i)}>
                  <h3 className="text-2xl font-medium tracking-tight">{g.title}</h3>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {g.items.map((s) => <li key={s} className="chip">{s}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* LEARNING */}
          <section id="learning" className="mx-auto max-w-7xl px-5 py-28 md:px-8 md:py-40">
            <h2 className="h2" data-reveal>Always learning<span className="text-accent">.</span></h2>

            <div className="mt-16 grid gap-4 md:grid-cols-12">
              <div className="spot relative flex min-h-72 flex-col justify-between overflow-hidden p-6 md:col-span-7 md:min-h-96 md:p-10" data-spot data-reveal style={stagger(0)}>
                {/* dot-grid texture, decorative */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-70"
                  style={{
                    backgroundImage: "radial-gradient(rgba(var(--fg-rgb),.16) 1px,transparent 1px)",
                    backgroundSize: "20px 20px",
                    WebkitMaskImage: "linear-gradient(135deg,#000,transparent 70%)",
                    maskImage: "linear-gradient(135deg,#000,transparent 70%)",
                  }}
                />
                <CodeIcon className="relative text-3xl text-accent" />
                <div className="relative">
                  <h3 className="text-4xl font-medium leading-none tracking-tighter md:text-6xl">Golang</h3>
                  <p className="mt-5 max-w-[42ch] text-lg leading-relaxed text-mute">Taking a course in Go, with a project in mind to put it into practice.</p>
                </div>
              </div>

              <div className="spot relative flex min-h-72 flex-col justify-between overflow-hidden p-6 md:col-span-5 md:min-h-96 md:p-10" data-spot data-reveal style={stagger(1)}>
                {/* diagonal-line texture, decorative */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-70"
                  style={{
                    backgroundImage: "repeating-linear-gradient(135deg,rgba(var(--fg-rgb),.10) 0 1px,transparent 1px 12px)",
                    WebkitMaskImage: "linear-gradient(315deg,#000,transparent 70%)",
                    maskImage: "linear-gradient(315deg,#000,transparent 70%)",
                  }}
                />
                <SparkleIcon className="relative text-3xl text-accent" />
                <div className="relative">
                  <h3 className="text-3xl font-medium leading-[1.05] tracking-tighter md:text-5xl">Using AI more effectively</h3>
                  <p className="mt-5 max-w-[42ch] text-lg leading-relaxed text-mute">Building with AI skills, connecting AI to other tools, and exploring agentic tools and model routing.</p>
                </div>
              </div>

              <div className="spot group relative flex min-h-80 flex-col justify-end overflow-hidden p-6 md:col-span-12 md:min-h-96 md:p-10" data-spot data-reveal style={stagger(2)}>
                {/* TODO: replace with an image you like (curiosity, books, space, anything), 1600x700 */}
                <FallbackImg src="https://picsum.photos/seed/curiosity-never-stops/1600/700?grayscale" alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover grayscale transition duration-700 group-hover:scale-105" />
                <div className="scan absolute inset-0" aria-hidden="true" />
                <div className="scrim pointer-events-none absolute inset-0" />
                <InfinityIcon className="absolute left-6 top-6 text-3xl text-accent md:left-10 md:top-10" />
                <div className="relative">
                  <h3 className="text-4xl font-medium leading-none tracking-tighter md:text-6xl">And many more.</h3>
                  <p className="mt-5 max-w-[42ch] text-lg leading-relaxed text-mute">Learning never stops. If it is new to me, I am happy to start from zero.</p>
                </div>
              </div>
            </div>

            <div className="mt-14 grid gap-x-8 gap-y-10 md:mt-20 md:grid-cols-12">
              <p className="border-t border-line pt-6 text-lg leading-relaxed md:col-span-5" data-reveal style={stagger(0)}>Picked up new stacks across every role, from Laravel and Angular to Nest.js and PWA.</p>
              <p className="border-t border-line pt-6 text-lg leading-relaxed md:col-span-4" data-reveal style={stagger(1)}>Went from Software Engineer to Tech Lead in about 9 months.</p>
              <p className="border-t border-line pt-6 text-lg leading-relaxed md:col-span-3" data-reveal style={stagger(2)}>Open to any tech stack. If a project needs something new, I&apos;ll learn it.</p>
            </div>
          </section>

          {/* EDUCATION */}
          <section id="education" className="mx-auto max-w-7xl px-5 py-28 md:px-8 md:py-40">
            <div className="flex flex-col gap-12 border-t border-line pt-12 md:flex-row md:items-end md:justify-between">
              <div data-reveal>
                <h2 className="h2">Bachelor of Informatics</h2>
                <p className="mt-6 text-lg">Universitas Atma Jaya Yogyakarta</p>
                <p className="text-mute">Yogyakarta, Indonesia</p>
                <p className="mt-4 font-mono text-sm text-mute">Sep 2020 - Aug 2024</p>
              </div>
              <div data-reveal style={d(120)} className="font-mono">
                <CountUp to={3.83} dec={2} className="text-8xl leading-none tracking-tighter text-accent md:text-[10rem]" />
                <span className="block text-lg text-mute md:inline md:text-xl">/ 4.00 GPA</span>
              </div>
            </div>
          </section>

          {/* CONTACT */}
          <section id="contact" className="mx-auto max-w-7xl px-5 py-28 md:px-8 md:py-40">
            <h2 className="h2 max-w-3xl" data-reveal>Have a system to build or fix<span className="text-accent">?</span></h2>
            <p className="body mt-6" data-reveal style={d(100)}>Reach me by email, phone or LinkedIn.</p>
            <div className="mt-14 divide-y divide-line border-y border-line">
              {CONTACTS.map((c, i) => (
                // The link is stretched over the whole row (::after) so the row stays clickable; the copy button sits above it.
                <div key={c.label} className="contact-row relative grid-cols-[auto_1fr_auto_auto]" data-reveal style={stagger(i)}>
                  <c.icon className="text-2xl" />
                  <a
                    href={c.href}
                    className="min-w-0 after:absolute after:inset-0"
                    {...(c.external ? { target: "_blank", rel: "noopener" } : {})}
                  >
                    <span className="block text-sm opacity-70">{c.label}</span>
                    <span className={`block text-xl tracking-tight md:text-4xl${c.breakAll ? " break-all" : ""}`}>{c.value}</span>
                  </a>
                  <CopyButton value={c.copy} label={c.label === "LinkedIn" ? "LinkedIn URL" : c.label.toLowerCase()} className="relative z-10" />
                  <ArrowUpRightIcon className="text-2xl" />
                </div>
              ))}
            </div>
          </section>
        </main>

        <footer className="mx-auto flex max-w-7xl items-center justify-between gap-6 border-t border-line px-5 py-10 text-sm text-mute md:px-8">
          <p>&copy; 2026 Metodius Frenaldy Vasti Valentino</p>
          <a href="#top" className="inline-flex items-center gap-2 transition-colors hover:text-accent">Back to top <ArrowUpIcon /></a>
        </footer>
      </div>

      <ProjectView projects={PROJECTS} />
      <PageEffects />
    </>
  );
}
