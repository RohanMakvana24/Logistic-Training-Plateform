import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";

const RoleRoute = ({ allowedRoles }) => {
  const { user } = useSelector((state) => state.auth);
  const isAuthorized = allowedRoles.includes(user.role);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return isAuthorized ? <Outlet /> : <Navigate to="/errors/unauthorize" />;
};

export default RoleRoute;
