// Decorative vector artwork stays sharp at every screen size and needs no image requests.
export default function HalloweenArtwork({ className, animated = false }: { className?: string; animated?: boolean }) {
  return <svg className={className} viewBox="0 0 560 280" fill="none" aria-hidden="true" focusable="false">
    <circle cx="356" cy="112" r="81" fill="#ffd878" />
    <circle cx="330" cy="94" r="12" fill="#f5c85f" /><circle cx="391" cy="128" r="19" fill="#f5c85f" />
    <g stroke="#b7a4d5" strokeWidth="1.5" opacity=".7">
      <path d="M0 0L140 0M0 0L129 45M0 0L101 93M0 0L55 130M0 0L0 150M0 28Q15 36 28 0M0 57Q29 68 53 19Q59 12 57 0M0 90Q45 99 81 29Q93 12 90 0M0 124Q60 138 111 40Q126 18 124 0" />
      <path d="M560 0L425 0M560 0L442 49M560 0L476 100M560 0L530 135M560 0L560 145M532 0Q528 17 542 23Q550 34 560 28M503 0Q497 30 524 44Q534 65 560 58M466 0Q459 47 503 69Q520 105 560 92" />
      <path d="M492 40V107" />
    </g>
    <g className={animated ? 'halloween-moving-spider' : undefined}>
    <g stroke="#d7bfef" strokeWidth="3" strokeLinecap="round">
      <path d="M483 116L471 108L463 116M483 122L468 122L462 133M484 128L472 139L470 149M501 116L513 108L521 116M501 122L516 122L522 133M500 128L512 139L514 149" />
    </g>
    <ellipse cx="492" cy="120" rx="13" ry="17" fill="#251635" /><circle cx="487" cy="119" r="3" fill="white" /><circle cx="497" cy="119" r="3" fill="white" />
    </g>
    <g fill="#1d102c"><path d="M279 77Q261 52 244 68L229 46L219 71Q203 53 184 73Q209 73 220 93L231 85L243 97Q255 77 279 77Z" /><path d="M447 186Q431 164 418 178L407 160L400 180Q386 165 373 183Q391 184 401 198L410 191L421 201Q431 186 447 186Z" /></g>
    <g fill="#ffcc65"><path d="M151 29L154 37L162 40L154 43L151 51L148 43L140 40L148 37Z" /><path d="M434 57L437 64L444 67L437 70L434 77L431 70L424 67L431 64Z" /><path d="M311 211L314 218L321 221L314 224L311 231L308 224L301 221L308 218Z" /><circle cx="188" cy="142" r="3" /><circle cx="542" cy="196" r="3" /><circle cx="272" cy="134" r="3" /><circle cx="320" cy="24" r="3" /></g>
    <g className={animated ? 'halloween-floating-ghost' : undefined}>
    <path d="M75 225V153C75 123 93 102 116 102C140 102 157 124 157 151V223L142 215L129 231L115 219L101 232L88 219L75 225Z" fill="#fff7e9" />
    <ellipse cx="101" cy="150" rx="6" ry="10" fill="#251635" /><ellipse cx="128" cy="150" rx="6" ry="10" fill="#251635" /><ellipse cx="115" cy="176" rx="8" ry="11" fill="#251635" />
    <circle cx="91" cy="168" r="7" fill="#fac5ac" /><circle cx="139" cy="168" r="7" fill="#fac5ac" />
    <path d="M180 193Q164 172 154 180M81 187Q59 176 49 191" stroke="#fff7e9" strokeWidth="14" strokeLinecap="round" />
    </g>
    <g className={animated ? 'halloween-bobbing-pumpkin' : undefined}>
    <path d="M223 179Q213 152 232 141" stroke="#648443" strokeWidth="12" strokeLinecap="round" />
    <ellipse cx="226" cy="222" rx="65" ry="47" fill="#f57921" /><ellipse cx="206" cy="222" rx="39" ry="47" fill="#ff952f" /><ellipse cx="242" cy="222" rx="34" ry="47" fill="#ff952f" />
    <path d="M195 216L209 196L220 216Z M238 215L251 196L264 216Z M190 232L208 239L214 232L225 242L238 232L246 238L263 229Q252 262 225 258Q203 256 190 232Z" fill="#331632" />
    </g>
    <g className={animated ? 'halloween-floating-ghost halloween-small-ghost' : undefined}>
    <path d="M403 240V213C403 192 417 176 434 176C452 176 465 192 465 213V245L453 238L442 250L429 240L417 249L403 240Z" fill="#fff7e9" />
    <ellipse cx="424" cy="213" rx="4" ry="7" fill="#251635" /><ellipse cx="446" cy="213" rx="4" ry="7" fill="#251635" /><path d="M428 228Q435 236 442 228" stroke="#251635" strokeWidth="3" strokeLinecap="round" />
    </g>
    <path d="M22 269Q166 254 281 270Q402 256 540 271" stroke="#78519b" strokeWidth="3" strokeLinecap="round" />
  </svg>
}
