// src/app/api/uploadthing/core.ts
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const uploadRouter = {
  uploadFile: f({
    blob: { maxFileSize: "16MB", maxFileCount: 5 },
  }).onUploadComplete(({ file }) => {
    console.log("Upload completed:", file);
  }),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
