// store/uploadSlice.js
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Outside Redux: keep non-serializable things here
const fileControllers = new Map(); // tempId -> { file, cancelSource }

// Thunk for uploading a single file
export const uploadFileDirect =
  ({ file, token, tempId }) =>
  async (dispatch) => {
    const source = axios.CancelToken.source();
    fileControllers.set(tempId, { file, cancelSource: source });

    // add entry to Redux with serializable metadata only
    dispatch(
      addUploading({
        tempId,
        name: file.name,
        size: file.size,
        type: file.type,
        progress: 0,
      })
    );

    const form = new FormData();
    form.append("files", file, file.name);

    try {
      const res = await axios.post("/api/upload", form, {
        headers: {
          "Content-Type": "multipart/form-data",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        onUploadProgress: (e) => {
          const percent = e.total ? Math.round((e.loaded * 100) / e.total) : 0;
          dispatch(setFileProgress({ tempId, progress: percent }));
        },
        cancelToken: source.token,
      });

      dispatch(finUpload({ tempId, file: res.data.files[0] }));
      fileControllers.delete(tempId);
    } catch (e) {
      if (axios.isCancel(e)) {
        dispatch(removeUploading(tempId));
      } else {
        dispatch(
          setUploadError({ tempId, error: e.message || "Upload failed" })
        );
      }
      fileControllers.delete(tempId);
    }
  };

// Thunk for deleting a file from server & Redux
export const deleteFile =
  ({ id, token }) =>
  async (dispatch) => {
    try {
      await axios.delete(`/api/deletefile/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      dispatch(removeFile(id));
    } catch (e) {
      console.error("Delete failed", e);
      // optionally: dispatch an error action or toast
    }
  };

const uploadSlice = createSlice({
  name: "uploads",
  initialState: {
    uploading: {}, // tempId -> { name, size, type, progress, error? }
    files: [], // completed files
  },
  reducers: {
    addUploading: (state, action) => {
      const { tempId, name, size, type, progress } = action.payload;
      state.uploading[tempId] = { name, size, type, progress };
    },
    setFileProgress: (state, action) => {
      const { tempId, progress } = action.payload;
      if (state.uploading[tempId]) {
        state.uploading[tempId].progress = progress;
      }
    },
    finUpload: (state, action) => {
      const { tempId, file } = action.payload;
      delete state.uploading[tempId];
      state.files.unshift(file);
    },
    removeUploading: (state, action) => {
      delete state.uploading[action.payload];
    },
    cancelUpload: (state, action) => {
      const tempId = action.payload;
      const ctrl = fileControllers.get(tempId);
      if (ctrl) {
        ctrl.cancelSource.cancel("user_cancel");
        fileControllers.delete(tempId);
      }
      delete state.uploading[tempId];
    },
    setUploadError: (state, action) => {
      const { tempId, error } = action.payload;
      if (state.uploading[tempId]) {
        state.uploading[tempId].error = error;
      }
    },
    setFiles: (state, action) => {
      state.files = action.payload;
    },
    // NEW reducer for removing file from completed list
    removeFile: (state, action) => {
      state.files = state.files.filter((f) => f.id !== action.payload);
    },
  },
});

export const {
  addUploading,
  setFileProgress,
  finUpload,
  removeUploading,
  cancelUpload,
  setUploadError,
  setFiles,
  removeFile, // export newly added reducer
} = uploadSlice.actions;

export default uploadSlice.reducer;
