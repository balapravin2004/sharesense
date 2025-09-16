import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

// Fetch all notes
export const fetchAllNotes = createAsyncThunk(
  "notes/fetchAllNotes",
  async (_, { rejectWithValue }) => {
    const toastId = toast.loading("Fetching notes...");
    try {
      const res = await axios.get("/api/allnotes");
      const data = Array.isArray(res.data) ? res.data : res.data?.notes ?? [];
      toast.success("Notes loaded", { id: toastId });
      return data;
    } catch (error) {
      toast.error(error.response?.data?.error || "Error fetching notes", {
        id: toastId,
      });
      return rejectWithValue(
        error.response?.data?.error || "Error fetching notes"
      );
    }
  }
);

// Delete a note
export const deleteNote = createAsyncThunk(
  "notes/deleteNote",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/deletenote/${id}`);
      toast.success("Deleted successfully");
      return id;
    } catch (error) {
      toast.error(error.response?.data?.error || "Error deleting note");
      return rejectWithValue(
        error.response?.data?.error || "Error deleting note"
      );
    }
  }
);

const notesSlice = createSlice({
  name: "notes",
  initialState: {
    notes: [],
    filteredNotes: [],
    loading: false,
    deletingId: null,
    query: "",
    showImages: false,
    filterMode: "both", // general, user, or both
  },
  reducers: {
    setQuery: (state, action) => {
      state.query = action.payload;
      const q = state.query.trim().toLowerCase();
      const filteredByQuery = !q
        ? state.notes
        : state.notes.filter((n) =>
            (n.content || "")
              .replace(/<[^>]*>/g, "")
              .toLowerCase()
              .includes(q)
          );

      state.filteredNotes = filteredByQuery.filter((note) => {
        if (state.filterMode === "general") return note.isGlobal;
        if (state.filterMode === "user") return !note.isGlobal;
        return true; // both
      });
    },
    toggleShowImages: (state) => {
      state.showImages = !state.showImages;
    },
    setDeletingId: (state, action) => {
      state.deletingId = action.payload;
    },
    setFilterMode: (state, action) => {
      state.filterMode = action.payload;
      // Reapply filtering based on query
      const q = state.query.trim().toLowerCase();
      const filteredByQuery = !q
        ? state.notes
        : state.notes.filter((n) =>
            (n.content || "")
              .replace(/<[^>]*>/g, "")
              .toLowerCase()
              .includes(q)
          );

      state.filteredNotes = filteredByQuery.filter((note) => {
        if (state.filterMode === "general") return note.isGlobal;
        if (state.filterMode === "user") return !note.isGlobal;
        return true; // both
      });
    },
    setFilteredNotes: (state, action) => {
      // Directly set filteredNotes from API response
      state.filteredNotes = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllNotes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllNotes.fulfilled, (state, action) => {
        state.notes = action.payload;
        // Apply filterMode initially
        const filtered = state.notes.filter((note) => {
          if (state.filterMode === "general") return note.isGlobal;
          if (state.filterMode === "user") return !note.isGlobal;
          return true;
        });
        state.filteredNotes = filtered;
        state.loading = false;
      })
      .addCase(fetchAllNotes.rejected, (state) => {
        state.loading = false;
      })
      .addCase(deleteNote.pending, (state, action) => {
        state.deletingId = action.meta.arg;
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.notes = state.notes.filter((n) => n.id !== action.payload);
        state.filteredNotes = state.filteredNotes.filter(
          (n) => n.id !== action.payload
        );
        state.deletingId = null;
      })
      .addCase(deleteNote.rejected, (state) => {
        state.deletingId = null;
      });
  },
});

export const {
  setQuery,
  toggleShowImages,
  setDeletingId,
  setFilterMode,
  setFilteredNotes,
} = notesSlice.actions;

export default notesSlice.reducer;
