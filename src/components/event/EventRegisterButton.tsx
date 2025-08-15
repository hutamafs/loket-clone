"use client";

export default function EventRegisterButton({ eventId }: { eventId: string }) {
  const handleRegister = () => {
    alert(`Registration for event ${eventId} - Coming soon!`);
  };

  return (
    <button
      onClick={handleRegister}
      className="w-full bg-blue-600 text-white text-sm h-11 hover:bg-blue-700 font-medium transition-colors"
    >
      Register
    </button>
  );
}
