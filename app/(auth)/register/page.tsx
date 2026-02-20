import RegisterForm from "./RegisterForm"
import { redirect } from 'next/navigation';

export default function page() {
  if(process.env.ALLOW_REGISTRATION !== "true") {
    redirect("/login")
  }
  return (
    <RegisterForm />
  )
}
