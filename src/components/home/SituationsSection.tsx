"use client";

import { motion, useReducedMotion } from "framer-motion";
const ease = [0.22, 1, 0.36, 1] as const;

const SITUATIONS = [
  {
    title: "Transformation unter Druck",
    body: "Klarheit bei Zielen, Roadmap und Verantwortlichkeiten gewinnen.",
  },
  {
    title: "Wachstum oder Vertrieb",
    body: "Strukturen, Prozesse und Steuerung wirksam ausrichten.",
  },
  {
    title: "Digitalisierung",
    body: "Prioritäten setzen statt «Technologie um der Technologie willen».",
  },
  {
    title: "Change & Organisation",
    body: "Veränderungen skalieren, ohne den laufenden Betrieb zu gefährden.",
  },
  {
    title: "Projekte",
    body: "Ressourcenlücken schliessen, Reviews durchführen, Risiken transparent machen.",
  },
  {
    title: "Kosten & Prozesse",
    body: "Effizienz und Qualität gleichzeitig verbessern.",
  },
] as const;

export function SituationsSection() {
  const reduce = useReducedMotion();

  return (
    <div className="relative overflow-hidden py-20 md:py-28">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-[#fbfbfd] to-white" />

      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-20 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl"
        animate={reduce ? undefined : { scale: [1, 1.12, 1], opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-32 bottom-10 h-80 w-80 rounded-full bg-brand-900/12 blur-3xl"
        animate={reduce ? undefined : { scale: [1.08, 1, 1.08], opacity: [0.25, 0.45, 0.25] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      <div className="relative mx-auto max-w-[1068px] px-6">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 22 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.65, ease }}
        >
          <h2 className="max-w-[22ch] text-[32px] font-semibold tracking-[-0.03em] text-[#1d1d1f] md:text-[40px]">
            Typische Situationen
          </h2>
          <motion.p
            className="mt-3 max-w-xl text-[17px] text-[#6e6e73]"
            initial={reduce ? false : { opacity: 0, x: -8 }}
            whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08, duration: 0.55, ease }}
          >
            Wann sich ein Austausch mit uns lohnt
          </motion.p>
        </motion.div>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {SITUATIONS.map((item, i) => (
            <motion.li
              key={item.title}
              initial={reduce ? false : { opacity: 0, y: 32 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-6% 0px" }}
              transition={{ delay: reduce ? 0 : 0.06 + i * 0.07, duration: 0.55, ease }}
              whileHover={
                reduce
                  ? undefined
                  : {
                      y: -6,
                      transition: { type: "spring", stiffness: 420, damping: 22 },
                    }
              }
              whileTap={reduce ? undefined : { scale: 0.985 }}
              className="group relative cursor-default list-none rounded-2xl border border-black/[0.07] bg-white/85 p-5 shadow-sm backdrop-blur-sm transition-[box-shadow,border-color] duration-300 hover:border-brand-500/35 hover:shadow-[0_20px_50px_-24px_rgba(38,51,124,0.18)]"
            >
              <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-900/[0.04] via-transparent to-brand-500/[0.07] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="relative flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-900 to-brand-500 text-[13px] font-bold tabular-nums text-white shadow-md shadow-brand-900/25 transition-transform duration-300 ease-out group-hover:scale-105 group-hover:-rotate-1">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1 pt-0.5">
                  <p className="text-[15px] font-semibold leading-snug tracking-[-0.01em] text-[#1d1d1f] transition-colors duration-200 group-hover:text-brand-900">
                    {item.title}
                  </p>
                  <p className="mt-2 text-[14px] leading-relaxed text-[#6e6e73]">{item.body}</p>
                </div>
              </div>

              <span
                aria-hidden
                className="pointer-events-none absolute bottom-3.5 right-4 translate-x-[-4px] text-lg text-brand-500 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
              >
                →
              </span>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}
