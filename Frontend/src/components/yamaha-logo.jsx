export function YamahaLogo({ className, ...props }) {
  return (
    <div className={`flex items-center ${className}`} style={{ display: "flex", alignItems: "center" }} {...props}>
      <svg
        viewBox="0 0 200 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ height: "100%", width: "auto" }}
      >
        <path d="M20 10H180V30H20V10Z" fill="#E60012" />
        <path d="M40 15L50 25H60L50 15H40Z" fill="white" />
        <path d="M70 15L80 25H90L80 15H70Z" fill="white" />
        <path d="M100 15V25H110V20H120V25H130V15H100Z" fill="white" />
        <path d="M140 15L150 25H160L150 15H140Z" fill="white" />
      </svg>
      <span style={{ marginLeft: "0.5rem", fontWeight: "bold", fontSize: "1.25rem", color: "var(--color-primary)" }}>
        Social
      </span>
    </div>
  )
}
