import ReactMde from "react-mde";
import * as Showdown from "showdown";
import "react-mde/lib/styles/css/react-mde-all.css";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlus,
  FaSave,
  FaEdit,
  FaTrash,
  FaTimes,
  FaBook,
  FaCalendarAlt,
  FaSearch,
} from "react-icons/fa";
import {
  createJournalEntry,
  updateJournalEntry,
  getJournalEntries,
  deleteJournalEntry,
} from "../api/api";
import Toast from "./Toast";

const converter = new Showdown.Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true,
  emoji: true,
  parseImgDimensions: true,
  smoothLivePreview: true,
});

interface JournalEntry {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at?: string;
}

interface ToastState {
  message: string;
  type: "success" | "error" | "info" | "warning";
  isVisible: boolean;
}

function Note() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState<JournalEntry | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedTab, setSelectedTab] = useState<"write" | "preview">("write");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState<ToastState>({
    message: "",
    type: "info",
    isVisible: false,
  });
  const showToast = (message: string, type: ToastState["type"]) => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  const fetchEntries = useCallback(async () => {
    try {
      const response = await getJournalEntries();
      setEntries(response.data.entries || []);
    } catch (error) {
      console.error("Error fetching entries:", error);
      showToast("Failed to load journal entries", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);
  const handleCreateEntry = () => {
    setIsCreating(true);
    setIsEditing(false);
    setCurrentEntry(null);
    setTitle("");
    setContent(`# My New Journal Entry

Welcome to your journal! Here's what you can do with **Markdown**:

## Formatting Text
- Use **bold** for emphasis
- Use *italics* for subtle emphasis
- Use \`inline code\` for technical terms

## Lists and Organization
1. Create numbered lists like this
2. Perfect for step-by-step thoughts
3. Keep your ideas organized

### Bullet Points
- Simple bullet points
- Great for quick notes
- Easy to scan

## Quotes and Thoughts
> "The journey of a thousand miles begins with a single step."
> 
> Use blockquotes for memorable quotes or important thoughts

## Code and Technical Notes
\`\`\`javascript
// You can even include code snippets
function myThoughts() {
  return "Beautifully formatted!";
}
\`\`\`

## Tables for Data
| Date | Mood | Notes |
|------|------|-------|
| Today | Great | Started journaling! |
| Tomorrow | Excited | More to write |

---

**Happy journaling!** 📝✨`);
    setSelectedTab("write");
  };

  const handleEditEntry = (entry: JournalEntry) => {
    setIsEditing(true);
    setIsCreating(false);
    setCurrentEntry(entry);
    setTitle(entry.title);
    setContent(entry.content);
    setSelectedTab("write");
  };

  const handleSaveEntry = async () => {
    if (!title.trim()) {
      showToast("Please enter a title for your entry", "warning");
      return;
    }
    if (!content.trim()) {
      showToast("Please enter some content for your entry", "warning");
      return;
    }
    setSaving(true);
    try {
      if (isCreating) {
        await createJournalEntry(title, content);
        showToast("Journal entry created successfully!", "success");
        fetchEntries();
      } else if (isEditing && currentEntry) {
        await updateJournalEntry(currentEntry.id, title, content);
        showToast("Journal entry updated successfully!", "success");
        fetchEntries();
      }

      handleCancelEdit();
    } catch (error) {
      console.error("Error saving entry:", error);
      showToast("Failed to save journal entry", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEntry = async (entryId: number) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) {
      return;
    }

    try {
      await deleteJournalEntry(entryId);
      showToast("Journal entry deleted successfully!", "success");
      fetchEntries();
      if (currentEntry?.id === entryId) {
        handleCancelEdit();
      }
    } catch (error) {
      console.error("Error deleting entry:", error);
      showToast("Failed to delete journal entry", "error");
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setIsCreating(false);
    setCurrentEntry(null);
    setTitle("");
    setContent("");
  };

  const filteredEntries = entries.filter(
    (entry) =>
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center p-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full"
        />
        <motion.p
          className="ml-4 text-secondary font-medium"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Loading your journal...
        </motion.p>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col lg:flex-row gap-6 p-4 max-w-7xl mx-auto">
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />

      {/* Journal Entries Sidebar */}
      <motion.div
        className="lg:w-1/3 bg-secondary-bg rounded-lg shadow-lg p-6"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FaBook className="text-secondary" />
            My Journal
          </h2>
          <motion.button
            onClick={handleCreateEntry}
            className="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-opacity-80 transition-colors flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaPlus />
            New Entry
          </motion.button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search entries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
          />
        </div>

        {/* Entries List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          <AnimatePresence>
            {filteredEntries.length === 0 ? (
              <motion.div
                className="text-center py-8 text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {searchTerm
                  ? "No entries match your search"
                  : "No journal entries yet. Create your first one!"}
              </motion.div>
            ) : (
              filteredEntries.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                    currentEntry?.id === entry.id
                      ? "border-secondary bg-primary bg-opacity-20"
                      : "border-primary hover:border-secondary hover:shadow-md"
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleEditEntry(entry)}
                  whileHover={{ scale: 1.02 }}
                >
                  <h3 className="font-semibold text-sm mb-2 line-clamp-1">
                    {entry.title}
                  </h3>
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                    {entry.content.replace(/[#*_`]/g, "").substring(0, 100)}...
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <FaCalendarAlt />
                      {formatDate(entry.created_at)}
                    </span>
                    <div className="flex gap-2">
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditEntry(entry);
                        }}
                        className="text-blue-500 hover:text-blue-700 p-1"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FaEdit size={12} />
                      </motion.button>
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteEntry(entry.id);
                        }}
                        className="text-red-500 hover:text-red-700 p-1"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FaTrash size={12} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Editor Section */}
      <motion.div
        className="lg:w-2/3 bg-secondary-bg rounded-lg shadow-lg overflow-hidden"
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {isCreating || isEditing ? (
          <>
            {/* Editor Header */}
            <div className="p-4 border-b border-primary bg-primary bg-opacity-10">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FaEdit className="text-secondary" />
                  {isCreating ? "Create New Entry" : "Edit Entry"}
                </h3>
                <div className="flex gap-2">
                  <motion.button
                    onClick={handleSaveEntry}
                    disabled={saving}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2 disabled:opacity-50"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {saving ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <FaSave />
                    )}
                    {saving ? "Saving..." : "Save"}
                  </motion.button>
                  <motion.button
                    onClick={handleCancelEdit}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaTimes />
                    Cancel
                  </motion.button>
                </div>
              </div>

              {/* Title Input */}
              <input
                type="text"
                placeholder="Enter your journal entry title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary text-lg font-medium"
              />
            </div>

            {/* Markdown Editor */}
            <div className="h-96 lg:h-[600px]">
              <ReactMde
                value={content}
                onChange={setContent}
                selectedTab={selectedTab}
                onTabChange={setSelectedTab}
                generateMarkdownPreview={(markdown) =>
                  Promise.resolve(converter.makeHtml(markdown))
                }
                childProps={{
                  writeButton: {
                    tabIndex: -1,
                  },
                  previewButton: {
                    tabIndex: -1,
                  },
                  textArea: {
                    placeholder:
                      "Write your journal entry in Markdown...\n\nTips:\n- Use # for headings\n- Use **bold** for emphasis\n- Use > for quotes\n- Use - for bullet points",
                  },
                }}
              />
            </div>
          </>
        ) : (
          /* Welcome/Empty State */
          <div className="h-full flex items-center justify-center p-8">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <FaBook className="text-6xl text-secondary mx-auto mb-4 opacity-50" />
              <h3 className="text-2xl font-bold mb-2">
                Welcome to Your Journal
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Start documenting your thoughts, experiences, and ideas. Create
                a new entry or select an existing one to begin writing.
              </p>
              <motion.button
                onClick={handleCreateEntry}
                className="bg-secondary text-white px-6 py-3 rounded-lg hover:bg-opacity-80 transition-colors flex items-center gap-2 mx-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaPlus />
                Create Your First Entry
              </motion.button>
            </motion.div>
          </div>
        )}{" "}
      </motion.div>
    </div>
  );
}

export default Note;
