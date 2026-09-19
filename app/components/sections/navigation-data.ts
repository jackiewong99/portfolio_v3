// Keep desktop and mobile labels/anchors in one source of truth.
export const navigationItems = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Work', href: '#work' },
  { label: 'Contact', href: '#contact' },
] as const;

// Place the current resume at public/Jackie_Wong_Resume.pdf when it is ready.
export const resumeHref = '/Jackie_Wong_Resume.pdf';
