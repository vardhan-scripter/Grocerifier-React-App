import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home(){
    const navigate = useNavigate();
    useEffect(() => {
        const authInfo = localStorage.getItem("authInfo");
        if (authInfo !== null) {
          const authInfoJson = JSON.parse(authInfo);
          if (new Date() < new Date(authInfoJson.expiresIn)) {
            navigate("/dashboard", { replace: true });
          }
        }
      }, [navigate]);

    return (
        <div className="container page-body">
            <div className="col-md-8 offset-2 text-center mt-5">
                <h1> Your now at Grocify Homepage</h1>
            </div>
        </div>
      );
}