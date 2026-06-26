import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./layout/Layout";
import { DashboardPage } from "./pages/DashboardPage";
import { LivraisonsPage } from "./pages/LivraisonsPage";
import { ChauffeursPage } from "./pages/ChauffeursPage";
import { CamionsPage } from "./pages/CamionsPage";
import { FacturationPage } from "./pages/FacturationPage";
import { ParametresPage } from "./pages/ParametresPage";
import { ProfilPage } from "./pages/ProfilPage";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import "./styles.css";

function App() {
  return (
    <Router>
     <Routes>
       {/* Public Routes */}
       <Route path="/landing" element={<LandingPage />} />
       <Route path="/login" element={<LoginPage />} />
       <Route path="/register" element={<RegisterPage />} />
       <Route path="/" element={<LandingPage />} />

       {/* Protected Routes */}
       <Route
         path="/dashboard"
         element={
           <ProtectedRoute>
             <Layout>
               <DashboardPage />
             </Layout>
           </ProtectedRoute>
         }
       />
       <Route
         path="/livraisons/*"
         element={
           <ProtectedRoute>
             <Layout>
               <LivraisonsPage />
             </Layout>
           </ProtectedRoute>
         }
       />
       <Route
         path="/chauffeurs/*"
         element={
           <ProtectedRoute>
             <Layout>
               <ChauffeursPage />
             </Layout>
           </ProtectedRoute>
         }
       />
       <Route
         path="/camions/*"
         element={
           <ProtectedRoute>
             <Layout>
               <CamionsPage />
             </Layout>
           </ProtectedRoute>
         }
       />
       <Route
         path="/facturation"
         element={
           <ProtectedRoute>
             <Layout>
               <FacturationPage />
             </Layout>
           </ProtectedRoute>
         }
       />
       <Route
         path="/parametres"
         element={
           <ProtectedRoute>
             <Layout>
               <ParametresPage />
             </Layout>
           </ProtectedRoute>
         }
       />
       <Route
         path="/profil"
         element={
           <ProtectedRoute>
             <Layout>
               <ProfilPage />
             </Layout>
           </ProtectedRoute>
         }
       />
     </Routes>
    </Router>
  );
}

export default App;
