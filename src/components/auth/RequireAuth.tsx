import { Navigate } from "react-router-dom";
import { getSessionUser } from "../../lib/auth";

export default function RequireAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = getSessionUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
