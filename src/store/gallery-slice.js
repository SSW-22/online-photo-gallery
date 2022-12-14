/* eslint-disable no-console */

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import checkUserGallery from "../firebase/checkUserGallery";

const initialGalleryState = {
  gallery: {
    subtitle: "",
    title: "",
    lightMode: "light",
    images: [],
    thumbnailBgColor: "",
    thumbnailTextColor: "",
    email: "",
    status: "", // none | draft | hosted
  },
  status: "idle", // "idle" | "loading" | "succeeded" | "failed"
  error: null,
  updated: false,
};

export const checkGallery = createAsyncThunk(
  "post/checkGallery",
  async (uid) => {
    try {
      const response = await checkUserGallery(uid);
      // console.log(response);
      return response;
    } catch (error) {
      console.log(error.message);
      return error.message;
    }
  }
);

const gallerySlice = createSlice({
  name: "gallery",
  initialState: initialGalleryState,
  reducers: {
    setInitial(state) {
      const previousData = state;
      previousData.gallery = { ...initialGalleryState.gallery, status: "none" };
    },
    addTitle(state, action) {
      const previousData = state;
      previousData.gallery.title = action.payload;
      previousData.updated = true;
    },
    addSubtitle(state, action) {
      const previousData = state;
      previousData.gallery.subtitle = action.payload;
      previousData.updated = true;
    },
    addMode(state, action) {
      const previousData = state;
      previousData.gallery.lightMode = action.payload;
      previousData.updated = true;
    },
    addThumbnailBgColor(state, action) {
      const previousData = state;
      previousData.gallery.thumbnailBgColor = action.payload;
      previousData.updated = true;
    },
    addThumbnailTextColor(state, action) {
      const previousData = state;
      previousData.gallery.thumbnailTextColor = action.payload;
      previousData.updated = true;
    },
    addEmail(state, action) {
      const previousData = state;
      previousData.gallery.email = action.payload;
      previousData.updated = true;
    },
    addImage(state, action) {
      const previousData = state;
      const newImage = action.payload;
      const existImages = state.gallery.images.find(
        (image) => image.id === newImage.id
      );
      if (!existImages) {
        state.gallery.images.push({
          id: newImage.id,
          title: newImage.title,
          description: newImage.description,
          imgUrl: newImage.imgUrl,
          date: newImage.date,
        });
      } else {
        existImages.title = newImage.title;
        existImages.description = newImage.description;
        existImages.imgUrl = newImage.imgUrl;
        existImages.date = newImage.date;
      }
      previousData.updated = true;
    },
    removeImage(state, action) {
      const selectedImageId = action.payload;
      const previousData = state;
      previousData.gallery.images = previousData.gallery.images.filter(
        (item) => item.id !== selectedImageId
      );
      previousData.updated = true;
    },
    sortImages(state, action) {
      const previousData = state;
      previousData.gallery.images = action.payload;
      previousData.updated = true;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(checkGallery.pending, (state) => {
        const previousData = state;
        previousData.status = "loading";
      })
      .addCase(checkGallery.fulfilled, (state, action) => {
        const previousData = state;
        previousData.status = "succeeded";
        previousData.updated = false;
        previousData.gallery.status = action.payload.status;
        previousData.gallery.lightMode = action.payload.lightMode || "light";
        previousData.gallery.images = action.payload.images || [];
        previousData.gallery.thumbnailBgColor =
          action.payload.thumbnailBgColor || "";
        previousData.gallery.thumbnailTextColor =
          action.payload.thumbnailTextColor || "";
        previousData.gallery.title = action.payload.title || "";
        previousData.gallery.subtitle = action.payload.subtitle || "";
        previousData.gallery.email = action.payload.email || "";
      })
      .addCase(checkGallery.rejected, (state, action) => {
        const previousData = state;
        previousData.state = "failed";
        previousData.error = action.error.message;
      });
  },
});

export const galleryActions = gallerySlice.actions;

export default gallerySlice.reducer;
