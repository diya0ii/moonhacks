import React from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { X } from "lucide-react"; // For close button icon

interface AnalyticsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const clubData = [
  { name: "Tech Club", events: 30, members: 120 },
  { name: "Design Club", events: 22, members: 95 },
  { name: "AI Club", events: 18, members: 80 },
  { name: "Music Club", events: 25, members: 105 },
  { name: "Gaming Club", events: 15, members: 70 },
];

const eventTrends = [
  { month: "Jan", events: 12 },
  { month: "Feb", events: 18 },
  { month: "Mar", events: 25 },
  { month: "Apr", events: 30 },
  { month: "May", events: 22 },
];

const AnalyticsSidebar: React.FC<AnalyticsSidebarProps> = ({ isOpen, onClose }) => {
  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg p-4 transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-2">
        <h2 className="text-xl font-semibold">Analytics</h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded">
          <X size={20} />
        </button>
      </div>

      {/* Event Trend Line Chart */}
      <div className="mt-4">
        <h3 className="text-lg font-medium mb-2">Event Trends</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={eventTrends}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <CartesianGrid strokeDasharray="3 3" />
            <Line type="monotone" dataKey="events" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Club Comparison Bar Chart */}
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2">Club Comparison</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={clubData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <CartesianGrid strokeDasharray="3 3" />
            <Bar dataKey="events" fill="#4CAF50" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsSidebar;
