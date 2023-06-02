import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getStoredUserAuth } from "../Utils/GetStoredUserAuth";

export default function Home(){
    const navigate = useNavigate();
    useEffect(() => {
        const auth = getStoredUserAuth();
        if (auth !== null) {
          navigate("/dashboard", { replace: true });
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