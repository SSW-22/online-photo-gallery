/* eslint-disable prettier/prettier */
/* eslint-disable no-console */

import { useEffect, useState } from "react";

function GalleryLoading({ images, setImgsLoaded, lightMode }) {
  const [progress, setProgress] = useState(0);
  const counterValid = progress < 100;

  // The purpose of this event is to display the loading animation while waiting for the images to be fully downloaded. The progress bar and percentage will be shown.
  useEffect(() => {
    const timer =
      counterValid &&
      setInterval(() => {
        setProgress((prev) => prev + 1);
      }, 10);
    return () => clearInterval(timer);
  }, [counterValid]);

  useEffect(() => {
    const loadImage = (image) => {
      return new Promise((resolve, reject) => {
        const loadImg = new Image();
        loadImg.src = image.imgUrl;
        // wait 2 seconds to simulate loading time
        loadImg.onload = () => {
          // setTimeout(() => {
          // }, 2000);
          resolve(image.imgUrl);
        };
        loadImg.onerror = (err) => reject(err);
      });
    };
    // Wait for the loading animation to finish, even if the image is fully downloaded. (I've separated the logic as all images are downloading too fast to display the progress bar number.)
    Promise.all(images.map((image) => loadImage(image)))
      .then(() => !counterValid && setImgsLoaded(true))
      .catch((err) => console.log("Failed to load images", err));
  }, [images, setImgsLoaded, counterValid]);

  return (
    <section
      className={`${
        lightMode === "light" ? "text-black" : "text-white bg-[#484848]"
      }
        relative flex justify-center items-center h-[100vh] w-[100vw]`}
    >
      <h1>Checking your ticket...</h1>
      <div className="absolute bottom-20 w-[80%] flex flex-col">
        <p className="text-[50px] self-end">{progress}%</p>
        <div
          className={`${
            lightMode === "light" ? "bg-[#D9D9D9]" : "bg-[#484848]"
          } relative h-[2px] w-[100%]`}
        >
          <div
            className={`${
              lightMode === "light" ? "bg-[black]" : "bg-[white]"
            } h-[2px] absolute`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </section>
  );
}

export default GalleryLoading;
