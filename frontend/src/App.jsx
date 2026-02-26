import { useEffect, useState } from "react";

function App() {
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [activity, setActivity] = useState("");
  const [activityType, setActivityType] = useState("Email");

  // ✅ Role-based access state
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const sampleLeads = [
      {
        _id: "699ac5807de5e7bf7f366010",
        name: "Priya Verma",
        email: "priya@gmail.com",
        phone: "9876541230",
        company: "Infosys",
        status: "New",
        stage: "New",
        dealValue: 50000,
        activities: [],
      },
      {
        _id: "699ac5807de5e7bf7f366011",
        name: "Rahul Sharma",
        email: "rahul@gmail.com",
        phone: "9876543210",
        company: "TCS",
        status: "Contacted",
        stage: "Contacted",
        dealValue: 80000,
        activities: [],
      },
      {
        _id: "699ac5807de5e7bf7f366012",
        name: "Ankit Patel",
        email: "ankit@gmail.com",
        phone: "9876512345",
        company: "Wipro",
        status: "Proposal",
        stage: "Proposal",
        dealValue: 120000,
        activities: [],
      },
      {
        _id: "699ac5807de5e7bf7f366013",
        name: "Sneha Joshi",
        email: "sneha@gmail.com",
        phone: "9898989898",
        company: "HCL",
        status: "Won",
        stage: "Won",
        dealValue: 200000,
        activities: [],
      },
      {
        _id: "699ac5807de5e7bf7f366014",
        name: "Amit Singh",
        email: "amit@gmail.com",
        phone: "9123456789",
        company: "Capgemini",
        status: "Lost",
        stage: "Lost",
        dealValue: 60000,
        activities: [],
      },
    ];
    setLeads(sampleLeads);
  }, []);

  // KPI calculations
  const totalLeads = leads.length;
  const contactedLeads = leads.filter((l) => l.stage === "Contacted").length;
  const wonDeals = leads.filter((l) => l.stage === "Won").length;
  const conversionRate =
    totalLeads > 0 ? ((wonDeals / totalLeads) * 100).toFixed(1) : 0;
  const totalRevenue = leads
    .filter((l) => l.stage === "Won")
    .reduce((sum, l) => sum + (l.dealValue || 0), 0);

  // Update stage
  const updateStage = (id, stage) => {
    setLeads((prev) =>
      prev.map((l) => (l._id === id ? { ...l, stage } : l))
    );
  };

  // Edit
  const handleEdit = (lead) => {
    const newName = prompt("Enter new name", lead.name);
    if (!newName) return;
    setLeads((prev) =>
      prev.map((l) =>
        l._id === lead._id ? { ...l, name: newName } : l
      )
    );
  };

  // Delete
  const handleDelete = (id) => {
    setLeads((prev) => prev.filter((l) => l._id !== id));
  };

  // Activity
  const addActivity = () => {
    if (!activity || !selectedLead) return;
    setLeads((prev) =>
      prev.map((l) =>
        l._id === selectedLead
          ? {
              ...l,
              activities: [
                ...(l.activities || []),
                {
                  type: activityType,
                  message: activity,
                  date: new Date(),
                },
              ],
            }
          : l
      )
    );
    setActivity("");
  };

  // ✅ LOGIN SCREEN (Demo)
  if (!userRole) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Login</h2>
        <button onClick={() => setUserRole("admin")}>
          Login as Admin
        </button>
        <button onClick={() => setUserRole("sales")}>
          Login as Sales
        </button>
        <button onClick={() => setUserRole("viewer")}>
          Login as Viewer
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>CRM Dashboard</h1>

      {/* Logout */}
      <button onClick={() => setUserRole(null)}>Logout</button>

      {/* KPI */}
      <div style={{ display: "flex", gap: "30px", marginBottom: "20px" }}>
        <div>
          <h3>Total Leads</h3>
          <p>{totalLeads}</p>
        </div>
        <div>
          <h3>Contacted</h3>
          <p>{contactedLeads}</p>
        </div>
        <div>
          <h3>Won Deals</h3>
          <p>{wonDeals}</p>
        </div>
        <div>
          <h3>Conversion Rate</h3>
          <p>{conversionRate}%</p>
        </div>
        <div>
          <h3>Total Revenue</h3>
          <p>₹ {totalRevenue}</p>
        </div>
      </div>

      {/* Leads Table */}
      {leads.length === 0 ? (
        <p>No leads found</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Company</th>
              <th>Stage</th>
              <th>Deal Value</th>
              <th>Update Stage</th>
              <th>Actions</th>
              <th>Activity</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead._id}>
                <td>{lead.name}</td>
                <td>{lead.email}</td>
                <td>{lead.company}</td>
                <td>{lead.stage}</td>
                <td>{lead.dealValue}</td>

                <td>
                  <select
                    value={lead.stage}
                    onChange={(e) =>
                      updateStage(lead._id, e.target.value)
                    }
                    disabled={userRole === "viewer"}
                  >
                    <option>New</option>
                    <option>Contacted</option>
                    <option>Proposal</option>
                    <option>Won</option>
                    <option>Lost</option>
                  </select>
                </td>

                <td>
                  {(userRole === "admin" || userRole === "sales") && (
                    <button onClick={() => handleEdit(lead)}>
                      Edit
                    </button>
                  )}

                  {userRole === "admin" && (
                    <button
                      onClick={() => handleDelete(lead._id)}
                    >
                      Delete
                    </button>
                  )}
                </td>

                <td>
                  <button
                    onClick={() => setSelectedLead(lead._id)}
                  >
                    View Activity
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Activity */}
      {selectedLead && (
        <div style={{ marginTop: "20px" }}>
          <h3>Activity Log</h3>

          <select
            value={activityType}
            onChange={(e) => setActivityType(e.target.value)}
          >
            <option>Email</option>
            <option>Call</option>
            <option>Meeting</option>
            <option>Follow-up</option>
          </select>

          <input
            type="text"
            placeholder="Enter message"
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
          />

          {userRole !== "viewer" && (
            <button onClick={addActivity}>Add</button>
          )}

          <ul>
            {leads
              .find((l) => l._id === selectedLead)
              ?.activities?.map((a, i) => (
                <li key={i}>
                  <b>{a.type}</b>: {a.message} (
                  {a.date
                    ? new Date(a.date).toLocaleString()
                    : "No date"}
                  )
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;