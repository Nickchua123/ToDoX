import { Toaster } from "sonner";
import { BrowserRouter, Routes, Route } from "react-router";
import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import Unauthorized from "./pages/Unauthorized";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Layout from "./Layout";
import VerifyCode from "./pages/VerifyCode";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectTodos from "./pages/ProjectTodos";
import ProjectNotes from "./pages/ProjectNotes";

function App() {
  return (
    <>
      <Toaster richColors />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot" element={<ForgotPassword />} />
            <Route path="/reset" element={<ResetPassword />} />
            <Route path="/verify" element={<VerifyCode />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:projectId" element={<ProjectTodos />} />
            <Route path="/projects/:projectId/notes" element={<ProjectNotes />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
