type IconProps = {
  size?: number
}

export function WhatsAppIcon({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill="#25D366" />
      <path
        d="M18.58 11.42C18.58 15.03 15.67 17.95 12.06 17.95C10.98 17.95 9.96 17.69 9.07 17.23L6.32 17.97L7.07 15.31C6.58 14.37 6.3 13.3 6.3 12.16C6.3 8.55 9.22 5.63 12.82 5.63C16.43 5.63 19.35 8.55 19.35 12.16H18.58V11.42Z"
        fill="white"
        fillOpacity="0.18"
      />
      <path
        d="M9.26 8.92C9.43 8.53 9.59 8.52 9.87 8.51C10.1 8.5 10.36 8.5 10.63 8.5C10.89 8.5 11.31 8.4 11.67 8.81C12.02 9.23 13.02 10.2 13.02 10.37C13.02 10.53 12.75 10.78 12.63 10.93C12.5 11.07 12.37 11.24 12.63 11.67C12.88 12.1 13.74 13.47 15.05 14.04C16.09 14.48 16.29 14.4 16.52 14.15C16.76 13.9 17.52 13 17.81 12.57C18.1 12.14 18.4 12.22 18.64 12.37C18.89 12.51 20.22 13.16 20.49 13.31C20.77 13.46 20.95 13.54 21.02 13.67C21.09 13.79 21.1 14.42 20.8 15.23C20.51 16.04 19.14 16.79 18.55 16.87C17.95 16.95 17.23 17.23 14.58 16.19C11.93 15.15 10.2 12.87 9.73 12.21C9.26 11.55 8.36 10.33 8.36 9.07C8.36 7.82 9.01 7.21 9.26 6.91"
        stroke="white"
        strokeWidth="1.28"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function InstagramIcon({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="instagramGradient" x1="4" y1="20" x2="20" y2="4" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F58529" />
          <stop offset="0.32" stopColor="#FEDA77" />
          <stop offset="0.58" stopColor="#DD2A7B" />
          <stop offset="0.8" stopColor="#8134AF" />
          <stop offset="1" stopColor="#515BD4" />
        </linearGradient>
      </defs>
      <rect x="2.75" y="2.75" width="18.5" height="18.5" rx="5.8" fill="url(#instagramGradient)" />
      <rect x="6.35" y="6.35" width="11.3" height="11.3" rx="3.45" stroke="white" strokeWidth="1.55" />
      <circle cx="12" cy="12" r="2.8" stroke="white" strokeWidth="1.55" />
      <circle cx="17.15" cy="6.95" r="0.95" fill="white" />
    </svg>
  )
}

export function YouTubeIcon({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M20.54 7.16C20.32 6.34 19.68 5.7 18.86 5.48C17.39 5.08 12 5.08 12 5.08C12 5.08 6.61 5.08 5.14 5.48C4.32 5.7 3.68 6.34 3.46 7.16C3.06 8.63 3.06 11.5 3.06 11.5C3.06 11.5 3.06 14.37 3.46 15.84C3.68 16.66 4.32 17.3 5.14 17.52C6.61 17.92 12 17.92 12 17.92C12 17.92 17.39 17.92 18.86 17.52C19.68 17.3 20.32 16.66 20.54 15.84C20.94 14.37 20.94 11.5 20.94 11.5C20.94 11.5 20.94 8.63 20.54 7.16Z"
        fill="#FF0000"
        strokeLinejoin="round"
      />
      <path d="M10.32 14.56L14.84 11.5L10.32 8.44V14.56Z" fill="white" />
    </svg>
  )
}
