import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, BookOpen } from "lucide-react";
import Layout from "../components/Layout.jsx";
import SubjectFormModal from "../components/SubjectFormModal.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import EmptyState from "../components/EmptyState.jsx";
import BunkMeter from "../components/BunkMeter.jsx";
import { SkeletonRow } from "../components/Skeleton.jsx";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import { Settings2, Trash2 } from "lucide-react";

const SubjectsPage = () => {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    try {
      const { data } = await api.get("/subjects");
      setSubjects(data.subjects);
    } catch {
      toast.error("Couldn't load subjects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (payload) => {
    try {
      if (editingSubject) {
        await api.put(`/subjects/${editingSubject._id}`, payload);
        toast.success("Subject updated");
      } else {
        await api.post("/subjects", payload);
        toast.success("Subject added");
      }
      await load();
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
      await load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't delete subject");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6 animate-fade-up">
        <div>
          <h1 className="text-2xl font-display font-bold text-paper-100">Subjects</h1>
          <p className="text-sm text-paper-100/50 mt-0.5">Manage targets, colors, and course codes.</p>
        </div>
        <button onClick={() => { setEditingSubject(null); setFormOpen(true); }} className="btn-primary shrink-0">
          <Plus size={16} /> Add subject
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)}
        </div>
      ) : subjects.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No subjects yet"
          message="Add a subject to start tracking its attendance and bunk margin."
          action={<button onClick={() => setFormOpen(true)} className="btn-primary"><Plus size={16} /> Add subject</button>}
        />
      ) : (
        <div className="space-y-3">
          {subjects.map((s) => (
            <div key={s._id} className="card p-5 flex flex-col sm:flex-row sm:items-center gap-4 animate-fade-up">
              <div className="flex items-center gap-3 sm:w-52 shrink-0">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center font-display font-bold text-sm shrink-0"
                  style={{ backgroundColor: `${s.color}22`, color: s.color }}
                >
                  {s.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-paper-100 truncate">{s.name}</p>
                  <p className="text-xs text-paper-100/40">{s.code || "No code"}</p>
                </div>
              </div>

              <div className="flex-1 max-w-md">
                <BunkMeter stats={s.stats} />
              </div>

              <div className="flex items-center gap-2 sm:ml-auto shrink-0">
                <button
                  onClick={() => { setEditingSubject(s); setFormOpen(true); }}
                  className="btn-secondary !px-3 !py-2"
                  aria-label="Edit subject"
                >
                  <Settings2 size={14} />
                </button>
                <button
                  onClick={() => setDeleteTarget(s)}
                  className="btn-danger !px-3 !py-2"
                  aria-label="Delete subject"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <SubjectFormModal
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditingSubject(null); }}
        onSubmit={handleSubmit}
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

export default SubjectsPage;
