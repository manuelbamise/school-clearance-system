import Reveal from './reveal'

export const btnCls =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl px-6 py-3.5 font-display text-base font-semibold tracking-[-0.02em] transition-[filter,transform] duration-200 hover:scale-[1.02] hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lp-blue'

export const btnPrimary = `${btnCls} bg-white text-black`
export const btnSecondary = `${btnCls} border border-lp-line bg-transparent text-white`
export const btnGradient = `${btnCls} bg-gradient-to-r from-lp-blue to-lp-cyan font-bold text-black`

const headingCls =
  'm-0 mb-4 font-display text-[clamp(36px,4vw,45px)] font-normal leading-[1.2] tracking-[-0.02em] text-white'

export function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <Reveal>
      <div className="relative mb-16 text-center">
        <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[200px] w-[440px] -translate-x-1/2 -translate-y-1/2 [background:radial-gradient(closest-side,rgba(37,99,235,0.06),transparent_70%)]" />
        <h2 className={headingCls}>{title}</h2>
        <p className="mx-auto max-w-[560px] font-medium leading-[1.5] tracking-[-0.03em] text-lp-soft">
          {subtitle}
        </p>
      </div>
    </Reveal>
  )
}
