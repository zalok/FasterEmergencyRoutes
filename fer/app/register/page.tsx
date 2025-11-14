import RegisterForm from "../../adapters/primary/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <RegisterForm />
      </div>
    </main>
  );
}