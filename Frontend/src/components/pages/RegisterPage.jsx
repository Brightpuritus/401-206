import { RegisterForm } from "../register-form"

function RegisterPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--color-background)",
      }}
    >
      <RegisterForm />
    </div>
  )
}

export default RegisterPage
