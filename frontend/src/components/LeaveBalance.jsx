import { FaUmbrellaBeach, FaNotesMedical, FaUser } from "react-icons/fa";

function LeaveBalance({ balance }) {

    const items = [
        {
            label: "Annual Leave",
            value: balance.annual,
            type: "annual",
            icon: <FaUmbrellaBeach />
        },
        {
            label: "Sick Leave",
            value: balance.sick,
            type: "sick",
            icon: <FaNotesMedical />
        },
        {
            label: "Personal Leave",
            value: balance.personal,
            type: "personal",
            icon: <FaUser />
        }
    ];

    return (
        <div className="row g-3 mb-4">

            {items.map((item, index) => (

                <div className="col-md-4" key={index}>

                    <div className={`leave-card ${item.type}`}>

                        <div className="leave-card-header">
                            <span className="leave-label">
                                {item.label}
                            </span>

                            <span className="leave-icon">
                                {item.icon}
                            </span>
                        </div>
                        <h4>
                            {item.value}
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