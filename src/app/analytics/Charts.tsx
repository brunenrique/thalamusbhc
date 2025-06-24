'use client';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface Props {
  userRoles: { name: string; value: number }[];
  appointments: { day: string; total: number }[];
  notifications: { day: string; success: number }[];
  sessionsByPsychologist: { name: string; sessions: number }[];
  weeklySessions: { day: string; total: number }[];
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

export default function Charts({
  userRoles,
  appointments,
  notifications,
  sessionsByPsychologist,
  weeklySessions,
}: Props) {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      <div className="h-64">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={userRoles} dataKey="value" nameKey="name" label>
              {userRoles.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="h-64">
        <ResponsiveContainer>
          <BarChart data={appointments}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="h-64">
        <ResponsiveContainer>
          <LineChart data={notifications}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="success" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="h-64">
        <ResponsiveContainer>
          <BarChart data={sessionsByPsychologist} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" />
            <YAxis type="category" dataKey="name" width={80} />
            <Tooltip />
            <Bar dataKey="sessions" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="h-64">
        <ResponsiveContainer>
          <LineChart data={weeklySessions}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="total" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
