import type { ReactNode, SVGProps } from 'react'

export type IconName =
  | 'market'
  | 'trophy'
  | 'chart'
  | 'box'
  | 'gift'
  | 'user'
  | 'gear'
  | 'search'
  | 'close'
  | 'chevron-down'
  | 'wallet'
  | 'bell'
  | 'logout'
  | 'menu'
  | 'bolt'
  | 'copy'
  | 'check'
  | 'plus'
  | 'arrow-left'

const paths: Record<IconName, ReactNode> = {
  market: <path d="M3 9 5 5h14l2 4M3 9v10a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V9M3 9h18M9 9v1a3 3 0 0 0 6 0V9" />,
  trophy: (
    <path d="M8 21h8m-4-4v4M7 4h10v6a5 5 0 0 1-10 0V4Zm-4 0h3v3a6 6 0 0 1-3 0V4Zm17 0h-3v3a6 6 0 0 0 3 0V4Z" />
  ),
  chart: <path d="M4 20V10m6 10V4m6 16v-7m4 7H2" />,
  box: <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Zm0 0v9m8-4.5-8 4.5m0 0L4 7.5" />,
  gift: <path d="M12 21v-9m0 0h4a3 3 0 0 0 0-6c-1.5 0-3 1-4 3-1-2-2.5-3-4-3a3 3 0 0 0 0 6h4m0 0v4M4 21h16" />,
  user: <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-8 8a8 8 0 0 1 16 0" />,
  gear: <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm8 4a8 8 0 0 0-.1-1.3l2-1.5-2-3.4-2.3 1a8 8 0 0 0-2.3-1.3L15 3h-4l-.3 2.5a8 8 0 0 0-2.3 1.3l-2.3-1-2 3.4 2 1.5A8 8 0 0 0 6 12a8 8 0 0 0 .1 1.3l-2 1.5 2 3.4 2.3-1a8 8 0 0 0 2.3 1.3L11 21h4l.3-2.5a8 8 0 0 0 2.3-1.3l2.3 1 2-3.4-2-1.5A8 8 0 0 0 20 12Z" />,
  search: <path d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm10 2-4.3-4.3" />,
  close: <path d="M18 6 6 18M6 6l12 12" />,
  'chevron-down': <path d="m6 9 6 6 6-6" />,
  wallet: <path d="M20 7H5a2 2 0 0 1 0-4h13v4m-18 0v13a1 1 0 0 0 1 1h17a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1m-7 7h4" />,
  bell: <path d="M18 8a6 6 0 1 0-12 0c0 7-3 8-3 8h18s-3-1-3-8Zm-7 12a2 2 0 0 0 2-2" />,
  logout: <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4m7 14 5-5-5-5m5 5H9" />,
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  bolt: <path d="M13 2 3 14h7l-1 8 11-13h-7l1-7Z" />,
  copy: <path d="M8 8h12v12H8V8ZM4 16H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v1" />,
  check: <path d="m4 12.5 5 5L20 6.5" />,
  plus: <path d="M12 5v14M5 12h14" />,
  'arrow-left': <path d="M19 12H5m7-7-7 7 7 7" />,
}

export function Icon({
  name,
  ...props
}: SVGProps<SVGSVGElement> & { name: IconName }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-5 w-5"
      {...props}
    >
      {paths[name]}
    </svg>
  )
}
