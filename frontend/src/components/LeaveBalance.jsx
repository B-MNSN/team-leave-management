import { useState, useEffect } from "react";
import { FaUmbrellaBeach, FaNotesMedical, FaUser } from "react-icons/fa";
import api from "../api/api";

function LeaveBalance() {
    const user = JSON.parse(localStorage.getItem("user"));

    const [balance, setBalance] = useState([]);

    useEffect(() => {
        try {
            const fetchBalance = async () => {
                const res = await api.get(`/leave/balance/${user.id}`);
                if (res.status === 200) {
                    setBalance(res.data);
                }
            };

            fetchBalance();
            
        } catch (error) {
            console.error("Error fetching leave balance:", error);
        }
    }, []);

    return (
        <div className="row g-3 mb-4">

            {balance?.map((item, index) => (
                <div className="col-md-4" key={index}>
                    <div className={`leave-card ${item.code}`}>
                        <div className="leave-card-header">
                            <span className="leave-label">
                                {item.name}
                            </span>

                            <span className="leave-icon">
                                {item.code === "ANNUAL" && <FaUmbrellaBeach />}
                                {item.code === "SICK" && <FaNotesMedical />}
                                {item.code === "PERSONAL" && <FaUser />}
                            </span>
                        </div>
                        <h4>
                            {item.used_days} / <small>{item.annual_quota}</small>
                        </h4>
                        <small>
                            days remaining
                        </small>
                    </div>
                </div>

            ))}

        </div>
    );
}

export default LeaveBalance;