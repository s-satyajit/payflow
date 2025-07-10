import { AppBar } from "../components/AppBar";
import { Outlet } from "react-router-dom";

export const UserLayout = () => {
  return (
    <>
      <AppBar />
      <Outlet />
    </>
  );
};
