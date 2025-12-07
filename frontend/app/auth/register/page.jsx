import AuthForm from "@/app/components/AuthForm";

export default function RegisterPage() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <AuthForm type="register" />
    </div>
  );
}
