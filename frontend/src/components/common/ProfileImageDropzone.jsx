import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import Cropper from "react-easy-crop";

const ProfileImageCrop = ({ initImage, getProfile, removePrevImg }) => {
  const [imageSrc, setImageSrc] = useState("");
  const [croppedImage, setCroppedImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  useEffect(() => {
    if (removePrevImg === true) {
      setCroppedImage(null);
      setImageSrc(null);
    }
  }, [removePrevImg]);
  useEffect(() => {
    setCroppedImage(initImage);
  }, [initImage]);
  // Upload
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result);
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
    multiple: false,
  });

  // Crop complete
  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  // Crop button
  const handleCrop = async () => {
    if (!croppedAreaPixels || !imageSrc) return;

    const canvas = document.createElement("canvas");
    const image = new Image();
    image.src = imageSrc;

    await new Promise((resolve) => (image.onload = resolve));

    const ctx = canvas.getContext("2d");

    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
    );

    canvas.toBlob((blob) => {
      if (!blob) return;

      const file = new File([blob], "profile.png", {
        type: "image/png",
      });

      console.log("FINAL FILE:", file);
      setCroppedImage(URL.createObjectURL(blob));

      getProfile(file);
      setImageSrc(null);
    }, "image/png");
  };
  // Remove image
  const handleRemove = () => {
    setCroppedImage(null);
    setImageSrc(null);
  };

  return (
    <div style={{ textAlign: "center" }}>
      {!imageSrc && !croppedImage && (
        <div {...getRootProps()} style={styles.dropzone}>
          <input {...getInputProps()} />
          <p>Upload</p>
        </div>
      )}

      {/* ✅ CROPPER ONLY */}
      {imageSrc && (
        <>
          <div style={styles.cropContainer}>
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>

          <button type="button" onClick={handleCrop} style={styles.btn}>
            Crop
          </button>
        </>
      )}

      {/* ✅ FINAL IMAGE WITH REMOVE ICON */}
      {croppedImage && (
        <div style={styles.previewWrapper}>
          <img src={croppedImage} alt="Profile" style={styles.roundImage} />

          {/* ❌ REMOVE ICON */}
          <button onClick={handleRemove} style={styles.removeIcon}>
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  dropzone: {
    width: 150,
    height: 150,
    border: "2px dashed #ccc",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    margin: "20px auto",
  },
  cropContainer: {
    position: "relative",
    width: "100%",
    height: 300,
    background: "#333",
  },
  previewWrapper: {
    position: "relative",
    display: "inline-block",
    marginTop: 20,
  },
  roundImage: {
    width: 150,
    height: 150,
    borderRadius: "50%",
    objectFit: "cover",
  },
  removeIcon: {
    position: "absolute",
    top: -5,
    right: -5,
    background: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    width: 25,
    height: 25,
    cursor: "pointer",
    fontSize: 14,
  },
  btn: {
    marginTop: 10,
    padding: "8px 12px",
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
};

export default ProfileImageCrop;
