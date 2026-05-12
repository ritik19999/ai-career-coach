import { Navigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import ThinkingLoader from "../../components/Loader";


const Protected = ({ children }) => {

    const { loading, user, handleLogout } = useAuth();

    if (loading) {
        return <ThinkingLoader text="Loading" />
    }

    if (!user) {
        return <Navigate to="/login" />
    }

    return (
        <div className="protected-layout">

            <header className="protected-navbar">
                <h1 className="logo"><span style={{ color: "#b92dff" }}>Gen</span>AI</h1>

                <button
                    onClick={() => handleLogout()}
                    className="logout-btn"
                >
                    Logout
                </button>
            </header>

            <main className="protected-content">
                {children}
            </main>

        </div>
    )
}

export default Protected;