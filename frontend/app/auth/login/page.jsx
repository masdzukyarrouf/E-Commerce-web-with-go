import AuthForm from "@/app/components/AuthForm";

export default function LoginPage() {
  return (
    <div className="flex justify-center items-center min-h-screen ">
      <AuthForm type="login" />
    </div>
  );
}
