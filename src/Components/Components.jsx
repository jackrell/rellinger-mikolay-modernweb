import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import HomePage from "./Home/HomePage";
import UserPage from "./User/UserPage";
import ClassPage from "./Class/ClassPage";

const Components = () => {
    return (
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/users" element={<UserPage />} />
            <Route path="/classes" element={<ClassPage />} />
          </Routes>
        </Router>
    );
};

export default Components;