import "../styles/components/logo.css"

export function YamahaLogo({ className }) {
  return (
    <div className={`yamaha-logo ${className || ""}`}>
      <svg viewBox="0 0 200 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="yamaha-logo-svg">
        <path d="M20 10H180V30H20V10Z" fill="#E60012" />
        <path d="M40 15L50 25H60L50 15H40Z" fill="white" />
        <path d="M70 15L80 25H90L80 15H70Z" fill="white" />
        <path d="M100 15V25H110V20H120V25H130V15H100Z" fill="white" />
        <path d="M140 15L150 25H160L150 15H140Z" fill="white" />
      </svg>
      <span className="yamaha-logo-text">Social</span>
    </div>
  )
}
