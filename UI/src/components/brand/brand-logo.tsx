import { useTheme } from '@/contexts/theme-context'

type BrandLogoVariant = 'auto' | 'dark' | 'light'

interface BrandLogoProps {
  className?: string
  variant?: BrandLogoVariant
}

export function BrandLogo({ className = 'h-9 w-9', variant = 'auto' }: BrandLogoProps) {
  const { theme } = useTheme()
  const isDark = variant === 'dark' || (variant === 'auto' && theme === 'dark')
  const src = isDark ? '/logo_dark_mode.svg' : '/logo_light_mode.svg'

  return <img src={src} alt="ClearPath logo" className={className} />
}