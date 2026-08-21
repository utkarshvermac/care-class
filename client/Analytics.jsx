import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { BarChart3 } from "lucide-react";
import Layout from "../components/Layout.jsx";
import EmptyState from "../components/EmptyState.jsx";
import api from "../api/axios.js";

const STATUS_COLORS = { present: "#3DD68C", absent: "#F1637A", cancelled: "#6C7A99" };

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card px-3 py-2 text-xs">
      <p className="font-semibold text-paper-100 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

const AnalyticsPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/subjects");
        setSubjects(data.subjects);
      } catch {
        toast.error("Couldn't load analytics");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const barData = subjects.map((s) => ({
    name: s.name.length > 10 ? s.name.slice(0, 10) + "…" : s.name,
    Present: s.stats.present,
    Absent: s.stats.absent,
    Target: s.targetPercentage,
    Percentage: s.stats.percentage,
  }));

  const totals = subjects.reduce(
    (acc, s) => {
      acc.present += s.stats.present;
      acc.absent += s.stats.absent;
      return acc;
    },
    { present: 0, absent: 0 }
  );
  const pieData = [
    { name: "Present", value: totals.present, color: STATUS_COLORS.present },
    { name: "Absent", value: totals.absent, color: STATUS_COLORS.absent },
  ].filter((d) => d.value > 0);

  return (
    <Layout>
      <div className="mb-6 animate-fade-up">
        <h1 className="text-2xl font-display font-bold text-paper-100">Analytics</h1>
        <p className="text-sm text-paper-100/50 mt-0.5">Where your attendance stands, subject by subject.</p>
      </div>

      {loading ? (
        <div className="card p-10 text-center text-paper-100/40 animate-fade-up">Loading analytics…</div>
      ) : subjects.length === 0 ? (
        <EmptyState
          icon={BarChart3}
          title="Nothing to analyze yet"
          message="Add subjects and start logging attendance to see charts here."
        />
      ) : (
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 card p-5 animate-fade-up">
            <h3 className="font-display font-semibold text-paper-100 mb-4">Attendance % vs target</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#232B45" vertical={false} />
                <XAxis dataKey="name" stroke="#8B96AB" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#8B96AB" fontSize={12} tickLine={false} axisLine={false} unit="%" />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                <Bar dataKey="Percentage" fill="#E8B84B" radius={[6, 6, 0, 0]} name="Attendance %" />
                <Bar dataKey="Target" fill="#3A4360" radius={[6, 6, 0, 0]} name="Target %" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card p-5 animate-fade-up">
            <h3 className="font-display font-semibold text-paper-100 mb-4">Overall split</h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
                  {pieData.map((d) => (
                    <Cell key={d.name} fill={d.color} stroke="none" />
                  ))}
                </Pie>
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  formatter={(v) => <span className="text-xs text-paper-100/70">{v}</span>}
                />
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="lg:col-span-3 card p-5 animate-fade-up">
            <h3 className="font-display font-semibold text-paper-100 mb-4">Present vs absent, by subject</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#232B45" vertical={false} />
                <XAxis dataKey="name" stroke="#8B96AB" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#8B96AB" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                <Bar dataKey="Present" stackId="a" fill={STATUS_COLORS.present} radius={[0, 0, 0, 0]} />
                <Bar dataKey="Absent" stackId="a" fill={STATUS_COLORS.absent} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AnalyticsPage;
