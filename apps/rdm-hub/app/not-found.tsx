import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 className="font-serif text-6xl font-bold text-[#c8a356]">404</h1>
      <p className="mt-4 text-lg text-[#9ca3af]">
        Esta página no existe en el territorio.
      </p>
      <Link
        href="/"
        className="mt-8 bg-[#c8a356] text-[#0a0b0e] px-6 py-3 rounded-lg font-medium hover:bg-[#d4b26a] transition-colors"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
