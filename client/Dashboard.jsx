import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { Plus, Gauge, TrendingUp, AlertTriangle, BookOpen } from "lucide-react";
import Layout from "../components/Layout.jsx";
import StatCard from "../components/StatCard.jsx";
import SubjectCard from "../components/SubjectCard.jsx";
import SubjectFormModal from "../components/SubjectFormModal.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import DateStrip from "../components/DateStrip.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { SkeletonCard } from "../components/Skeleton.jsx";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import { todayISO } from "../utils/bunkCalc.js";

const Dashboard = () => {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [overall, setOverall] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(todayISO());
  const [dayLogs, setDayLogs] = useState({}); // subjectId -> status

  const [formOpen, setFormOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadSubjects = useCallback(async () => {
    const { data } = await api.get("/subjects");
    setSubjects(data.subjects);
    setOverall(data.overall);
  }, []);

  const loadDayLog = useCallback(async (date) => {
    const { data } = await api.get(`/attendance/day/${date}`);
    const map = {};
    data.logs.forEach((l) => (map[l.subject] = l.status));
    setDayLogs(map);
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        await Promise.all([loadSubjects(), loadDayLog(selectedDate)]);
      } catch {
        toast.error("Couldn't load your dashboard. Try refreshing.");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadDayLog(selectedDate).catch(() => toast.error("Couldn't load that day's log."));
  }, [selectedDate, loadDayLog]);

  const handleMark = async (subjectId, status) => {
    const prev = dayLogs[subjectId];
    try {
      if (status === null) {
        setDayLogs((m) => {
          const copy = { ...m };
          delete copy[subjectId];
          return copy;
        });
      } else {
        setDayLogs((m) => ({ ...m, [subjectId]: status }));
        await api.post("/attendance/mark", { subjectId, date: selectedDate, status });
        toast.success(
          status === "present" ? "Marked present ✅" : status === "absent" ? "Marked absent" : "Marked cancelled",
          { duration: 1500 }
        );
      }
      await loadSubjects();
    } catch (err) {
      setDayLogs((m) => ({ ...m, [subjectId]: prev }));
      toast.error(err.response?.data?.message || "Couldn't save that. Try again.");
    }
  };

  const handleCreateOrUpdate = async (payload) => {
    try {
      if (editingSubject) {
        await api.put(`/subjects/${editingSubject._id}`, payload);
        toast.success("Subject updated");
      } else {
        await api.post("/subjects", payload);
        toast.success("Subject added");
      }
      await loadSubjects();
      setEditingSubject(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't save subject");
      throw err;
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/subjects/${deleteTarget._id}`);
      toast.success(`${deleteTarget.name} deleted`);
      setDeleteTarget(null);
      await loadSubjects();
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't delete subject");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 animate-fade-up">
        <div>
          <h1 className="text-2xl font-display font-bold text-paper-100">
            Hey {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-sm text-paper-100/50 mt-0.5">Here's where your attendance stands right now.</p>
        </div>
        <button onClick={() => { setEditingSubject(null); setFormOpen(true); }} className="btn-primary shrink-0">
          <Plus size={16} /> Add subject
        </button>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        overall && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon={Gauge} label="Overall attendance" value={`${overall.percentage.toFixed(1)}%`} sub={`Target ${overall.target.toFixed(0)}%`} accent={overall.status === "danger" || overall.status === "critical" ? "absent" : "gold"} />
            <StatCard icon={BookOpen} label="Subjects tracked" value={overall.subjectCount} sub={overall.subjectCount === 0 ? "Add your first one" : "Across this term"} accent="cancelled" />
            <StatCard icon={AlertTriangle} label="At risk" value={overall.atRiskCount} sub={overall.atRiskCount === 0 ? "Nothing below target" : "Below their target %"} accent={overall.atRiskCount > 0 ? "absent" : "present"} />
            <StatCard icon={TrendingUp} label="Classes logged" value={overall.totalHeld} sub="Present + absent, all time" accent="present" />
          </div>
        )
      )}

      <div className="card p-4 mb-6 animate-fade-up">
        <DateStrip selectedDate={selectedDate} onSelect={setSelectedDate} />
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : subjects.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No subjects yet"
          message="Add your first subject to start logging attendance and see your live bunk-o-meter."
          action={
            <button onClick={() => setFormOpen(true)} className="btn-primary">
              <Plus size={16} /> Add your first subject
            </button>
          }
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((s) => (
            <SubjectCard
              key={s._id}
              subject={s}
              todayStatus={dayLogs[s._id] || null}
              onMark={handleMark}
              onEdit={(subj) => { setEditingSubject(subj); setFormOpen(true); }}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      <SubjectFormModal
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditingSubject(null); }}
        onSubmit={handleCreateOrUpdate}
        initialData={editingSubject}
        defaultTarget={user?.defaultTarget || 75}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete subject?"
        message={`This removes "${deleteTarget?.name}" and its entire attendance history. This can't be undone.`}
        confirmLabel="Delete permanently"
      />
    </Layout>
  );
};

export default Dashboard;
