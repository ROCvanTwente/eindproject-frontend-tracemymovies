import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router";
import { X, Search, Plus, Check, Loader2, List } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";

export function AddToListsModal({ isOpen, onClose, movieId, movieTitle }) {
  const auth = useAuth();
  const navigate = useNavigate();

  const token = useMemo(
    () =>
      auth?.token ||
      auth?.user?.token ||
      localStorage.getItem("auth_token") ||
      sessionStorage.getItem("auth_token"),
    [auth]
  );

  const [loading, setLoading] = useState(true);
  const [lists, setLists] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setSearch("");

    const fetchLists = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/Lists/for-movie/${movieId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) throw new Error("Failed to load lists");
        const data = await res.json();
        setLists(data);
        setSelected(new Set(data.filter((l) => l.inList).map((l) => l.listId)));
      } catch {
        toast.error("Could not load your lists");
        setLists([]);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchLists();
  }, [isOpen, movieId, token]);

  if (!isOpen) return null;

  const toggleList = (listId) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(listId)) next.delete(listId);
      else next.add(listId);
      return next;
    });
  };

  const handleNewList = () => {
    onClose();
    navigate("/list/new");
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const toAdd = lists.filter((l) => selected.has(l.listId) && !l.inList);
      const toRemove = lists.filter((l) => !selected.has(l.listId) && l.inList);

      for (const list of toAdd) {
        await fetch(`${import.meta.env.VITE_API_BASE_URL}/Lists/${list.listId}/movies`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ movieId }),
        });
      }
      for (const list of toRemove) {
        await fetch(`${import.meta.env.VITE_API_BASE_URL}/Lists/${list.listId}/movies/${movieId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      toast.success("Lists updated");
      onClose();
    } catch {
      toast.error("Could not update lists");
    } finally {
      setSaving(false);
    }
  };

  const filteredLists = lists.filter((l) =>
    l.listName.toLowerCase().includes(search.toLowerCase())
  );

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center px-4" style={{ zIndex: 99999 }}>
      <div className="fixed inset-0 bg-black/85 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-[#151921] border border-[#BFBCFC]/20 rounded-xl shadow-2xl z-[100000]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#BFBCFC]/10">
          <h3 className="text-[#F8FAFC] font-bold truncate pr-4">
            Add '{movieTitle}' to lists
          </h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full hover:bg-[#BFBCFC]/10 flex items-center justify-center flex-shrink-0"
          >
            <X className="w-4 h-4 text-[#94A3B8]" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-[#BFBCFC]/10">
          <button
            onClick={handleNewList}
            className="flex items-center gap-1.5 text-[#BFBCFC] text-sm font-medium hover:text-[#AFA9FF] transition-colors flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            New list...
          </button>

          <div className="relative w-full max-w-[180px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Type to search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0B0E14] border border-[#BFBCFC]/15 rounded-lg pl-8 pr-3 py-1.5 text-[#F8FAFC] text-sm placeholder-[#94A3B8] focus:outline-none focus:border-[#BFBCFC]/40"
            />
          </div>
        </div>

        {/* List of lists */}
        <div className="max-h-80 overflow-y-auto p-2">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-5 h-5 text-[#BFBCFC] animate-spin" />
            </div>
          ) : filteredLists.length === 0 ? (
            <div className="text-center py-8">
              <List className="w-8 h-8 text-[#BFBCFC]/20 mx-auto mb-2" />
              <p className="text-[#94A3B8] text-sm">
                {lists.length === 0 ? "You don't have any lists yet." : "No lists found."}
              </p>
            </div>
          ) : (
            filteredLists.map((list) => {
              const isSelected = selected.has(list.listId);
              return (
                <button
                  key={list.listId}
                  onClick={() => toggleList(list.listId)}
                  className="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg hover:bg-[#BFBCFC]/8 transition-colors text-left"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 transition-colors ${
                        isSelected
                          ? "bg-[#BFBCFC] border-[#BFBCFC]"
                          : "border-[#BFBCFC]/30"
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#0B0E14]" />}
                    </div>
                    <span className="text-[#F8FAFC] text-sm font-medium truncate">{list.listName}</span>
                  </div>
                  <span className="text-[#94A3B8] text-xs flex-shrink-0">
                    {list.movieCount} {list.movieCount === 1 ? "film" : "films"}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-[#BFBCFC]/10">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg font-medium text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#151921] transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="bg-[#BFBCFC] hover:bg-[#AFA9FF] text-[#0B0E14] px-6 py-2 rounded-lg font-medium transition-all shadow-lg shadow-[#BFBCFC]/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Add"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
