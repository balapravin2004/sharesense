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
    notes: [], // all notes from API
    baseFilteredNotes: [], // filtered by filterMode but before query
    filteredNotes: [], // what is shown on FE after query
    loading: false,
    deletingId: null,
    query: "",
    showImages: false,
    filterMode: "both", // general, user, or both
  },
  reducers: {
    setQuery: (state, action) => {
      console.clear();
      console.log("action.payload", action.payload);

      state.query = action.payload;
      const q = state.query.trim().toLowerCase();

      // Use baseFilteredNotes as source for query filtering
      let temp = [...state.baseFilteredNotes];

      if (q) {
        temp = temp.filter((note) =>
          (note.content || "")
            .replace(/<[^>]*>/g, "")
            .toLowerCase()
            .includes(q)
        );
      }

      state.filteredNotes = temp;
      console.log("filteredNotes", state.filteredNotes);
    },

    toggleShowImages: (state) => {
      state.showImages = !state.showImages;
    },

    setDeletingId: (state, action) => {
      state.deletingId = action.payload;
    },

    setFilterMode: (state, action) => {
      state.filterMode = action.payload;

      // Update baseFilteredNotes according to new filterMode
      state.baseFilteredNotes = state.notes.filter((note) => {
        if (state.filterMode === "general") return note.isGlobal;
        if (state.filterMode === "user") return !note.isGlobal;
        return true; // both
      });

      // Apply query on top of new baseFilteredNotes
      const q = state.query.trim().toLowerCase();
      let temp = [...state.baseFilteredNotes];
      if (q) {
        temp = temp.filter((note) =>
          (note.content || "")
            .replace(/<[^>]*>/g, "")
            .toLowerCase()
            .includes(q)
        );
      }
      state.filteredNotes = temp;
    },

    setFilteredNotes: (state, action) => {
      // Set all notes and baseFilteredNotes
      state.notes = action.payload;
      state.baseFilteredNotes = action.payload.filter((note) => {
        if (state.filterMode === "general") return note.isGlobal;
        if (state.filterMode === "user") return !note.isGlobal;
        return true;
      });

      // Apply query on top
      const q = state.query.trim().toLowerCase();
      let temp = [...state.baseFilteredNotes];
      if (q) {
        temp = temp.filter((note) =>
          (note.content || "")
            .replace(/<[^>]*>/g, "")
            .toLowerCase()
            .includes(q)
        );
      }
      state.filteredNotes = temp;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllNotes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllNotes.fulfilled, (state, action) => {
        state.notes = action.payload;

        // Initialize baseFilteredNotes based on filterMode
        state.baseFilteredNotes = state.notes.filter((note) => {
          if (state.filterMode === "general") return note.isGlobal;
          if (state.filterMode === "user") return !note.isGlobal;
          return true;
        });

        // Apply query if any
        const q = state.query.trim().toLowerCase();
        let temp = [...state.baseFilteredNotes];
        if (q) {
          temp = temp.filter((note) =>
            (note.content || "")
              .replace(/<[^>]*>/g, "")
              .toLowerCase()
              .includes(q)
          );
        }
        state.filteredNotes = temp;

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
        state.baseFilteredNotes = state.baseFilteredNotes.filter(
          (n) => n.id !== action.payload
        );
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
