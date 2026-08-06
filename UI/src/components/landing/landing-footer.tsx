import { GraduationCap } from 'lucide-react';

const columns = [
  {
    title: 'Product',
    links: ['Features', 'Pricing', 'Integrations', 'API Docs'],
  },
  {
    title: 'Resources',
    links: ['Documentation', 'Blog', 'Changelog', 'Status'],
  },
  {
    title: 'Company',
    links: ['About', 'Careers', 'Contact', 'Privacy Policy'],
  },
];

function XIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.554V9h3.565z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

const socials = [
  { label: 'X (Twitter)', icon: <XIcon /> },
  { label: 'LinkedIn', icon: <LinkedInIcon /> },
  { label: 'GitHub', icon: <GitHubIcon /> },
];

const logoIconCls =
  'flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-lp-blue to-lp-cyan text-white shadow-[0_4px_14px_rgba(37,99,235,0.35)]';

export default function LandingFooter() {
  return (
    <footer className="border-t border-lp-line bg-lp-deep pt-16">
      <div className="mx-auto max-w-[1200px] px-10 max-[809px]:px-5">
        <div className="grid grid-cols-2 gap-12 md:grid-cols-3 xl:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div>
            <a
              href="#top"
              className="flex items-center gap-2.5 font-display text-xl font-bold tracking-[-0.02em] text-white no-underline"
            >
              <span className={logoIconCls}>
                <GraduationCap size={18} strokeWidth={2.5} />
              </span>
              ClearPath
            </a>
            <p className="mt-4 max-w-[260px] text-sm font-normal leading-[1.4] text-lp-muted">
              Streamlining student clearance worldwide.
            </p>
            <div className="mt-5 flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href="#top"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-lp-line text-lp-muted transition-[color,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-white hover:text-white"
                  aria-label={s.label}
                  onClick={(e) => e.preventDefault()}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="mb-5 text-sm font-semibold tracking-[-0.02em] text-white">
                {col.title}
              </h4>
              <div className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <a
                    key={link}
                    href="#top"
                    className="relative w-fit pb-px text-sm font-normal text-lp-muted no-underline transition-colors after:absolute after:left-0 after:-bottom-px after:h-px after:w-0 after:bg-white after:transition-[width] after:duration-300 hover:text-white hover:after:w-full"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-lp-line py-6">
          <span className="text-sm font-normal leading-[1.4] text-lp-muted">
            © 2026 ClearPath. All rights reserved.
          </span>
          <span className="text-sm font-normal leading-[1.4] text-lp-muted">
            Built with care for students everywhere.
          </span>
        </div>
      </div>
    </footer>
  );
}
