import LoginForm from "../../adapters/primary/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </main>
  );
}
