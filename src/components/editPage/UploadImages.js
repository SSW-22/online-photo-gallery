/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-console */
/* eslint-disable prettier/prettier */

import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useDropzone } from "react-dropzone";
import { ImCancelCircle } from "react-icons/im";
import uuid from "react-uuid";
import { galleryActions } from "../../store/gallery-slice";
import PreviewSlide from "./PreviewSlide";
import getCroppedImg from "../crop/cropimage";
import Crop from "../crop/Crop";
import ModeSelector from "./ModeSelector";

function UploadImages({ setImageFiles, setDeletedItem }) {
  const dispatch = useDispatch();
  const [imageData, setImageData] = useState({
    title: "",
    date: "",
    description: "",
    imgUrl: "",
    id: uuid(),
  });
  const [errorInput, setErrorInput] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const cropImage = async () => {
    try {
      if (typeof imageData.imgUrl === "object") {
        const { file, url } = await getCroppedImg(
          URL.createObjectURL(imageData.imgUrl),
          croppedAreaPixels
        );
        // Save selected image files to seperate state since redux can not store non-serializable value which is image file.
        setImageFiles((prev) => {
          return [...prev, { ...imageData, imgUrl: file }];
        });

        dispatch(
          galleryActions.addImage({
            ...imageData,
            imgUrl: url,
          })
        );
      } else {
        dispatch(galleryActions.addImage(imageData));
      }
    } catch (error) {
      console.log(error);
    }
  };
  // Handling the title, and description for the current user-selected image and save as an obj.
  const inputHandler = (e) => {
    const { id, value } = e.target;

    setImageData((prev) => {
      return { ...prev, [id]: value };
    });
  };

  // Grab current user-selected image and add into imageData.
  const onDrop = useCallback((acceptedFiles) => {
    const newImg = acceptedFiles[0];
    setImageData((prev) => {
      // return { ...prev, imgUrl: newImg, id: uuid() };
      return { ...prev, imgUrl: newImg };
    });
  }, []);

  const { fileRejections, getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/jpg": [],
      "image/png": [],
    },
  });
  // push the current image with title, description and url into images array for preview and update to firestore.
  const submitHandler = (e) => {
    e.preventDefault();
    if (!imageData.title || !imageData.imgUrl) {
      console.log("wrong info");
      setErrorInput(true);
      return;
    }

    cropImage();

    setImageData({
      title: "",
      date: "",
      description: "",
      imgUrl: "",
      id: uuid(),
    });
    setErrorInput(false);
    e.target.reset();
  };
  const cancelHandler = (e) => {
    e.preventDefault();
    setImageData({
      title: "",
      date: "",
      description: "",
      imgUrl: "",
      id: uuid(),
    });
  };
  return (
    <div className="container mx-auto h-full font-['average']">
      <p>Maximum 10 photos per event are supported</p>
      <div className="flex mt-5">
        <div>
          <div className="w-[300px] h-[300px] bg-[#D9D9D9] flex flex-col justify-center items-center relative">
            {imageData.imgUrl && (
              <button
                className="absolute top-0 right-0 m-[1rem] z-[99]"
                type="button"
                onClick={() => {
                  setImageData((prev) => {
                    return { ...prev, imgUrl: "" };
                  });
                }}
              >
                <ImCancelCircle />
              </button>
            )}
            <div {...getRootProps({ className: "dropzone" })}>
              <input {...getInputProps()} />
              {!imageData.imgUrl && (
                <>
                  <p className="cursor-pointer">
                    Drop your image here, or{" "}
                    <span className="text-[#007BED]">browse</span>
                  </p>
                  <p>Support jpeg, jpg, png</p>
                </>
              )}
            </div>
            {imageData.imgUrl && (
              <Crop imgUrl={imageData.imgUrl} onCropComplete={onCropComplete} />
            )}
          </div>
          {fileRejections[0]?.file && (
            <p className="text-red-500">
              Only *.jpeg and *.png images will be accepted
            </p>
          )}

          {errorInput && imageData.imgUrl.length <= 0 && (
            <p className="text-red-500">Please select the image</p>
          )}
        </div>
        <form onSubmit={submitHandler} className="flex flex-col ml-[2.5rem]">
          <label htmlFor="title" className="flex flex-col h-[70px]">
            Title
            <input
              className={`border-b focus:outline-none
              ${
                errorInput && imageData.title.length <= 0
                  ? "border-red-500"
                  : "border-black"
              }`}
              id="title"
              type="text"
              value={imageData.title}
              onChange={inputHandler}
            />
            {errorInput && imageData.title.length <= 0 && (
              <p className="text-red-500">Please fill out this field</p>
            )}
          </label>
          <label htmlFor="date" className="flex flex-col h-[70px]">
            Date
            <input
              className="border-b border-black"
              type="date"
              id="date"
              value={imageData.date}
              onChange={inputHandler}
            />
          </label>
          <label htmlFor="description" className="flex flex-col">
            Description
            <textarea
              className="border border-black resize-none focus:outline-none"
              id="description"
              value={imageData.description}
              onChange={inputHandler}
            />
          </label>

          <button type="submit">Add to preview</button>
          <button type="button" onClick={cancelHandler}>
            Cancel
          </button>
        </form>
      </div>

      <div className="flex justify-between mt-[2rem]">
        <div className="flex mb-[1rem] items-center">
          <p>Choose your theme: </p>
          <ModeSelector />
        </div>
        <button type="button">View in gallery Mode</button>
      </div>
      <PreviewSlide
        setDeletedItem={setDeletedItem}
        setImageFiles={setImageFiles}
        setImageData={setImageData}
      />
    </div>
  );
}

export default UploadImages;
