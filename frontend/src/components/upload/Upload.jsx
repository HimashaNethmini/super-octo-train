import { IKContext, IKImage, IKUpload } from "imagekitio-react";
import { useRef } from "react";

const urlEndpoint = import.meta.env.VITE_IMAGE_KIT_ENDPOINT;
const publicKey = import.meta.env.VITE_IMAGE_KIT_PUBLIC_KEY;

const authenticator = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/upload");

    //if not aunthenticated
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`
      );
    }

    //if authenticated, send token and signature to upload images
    const data = await response.json();
    const { signature, expire, token } = data;
    return { signature, expire, token };
  } catch (error) {
    throw new Error(`Authentication request failed: ${error.message}`);
  }
};

const Upload = (setImg) => {
  //when user clicks on attachment img, it should runs the upload component
  const iKUploadRef = useRef(null);

  const onError = (err) => {
    console.log("Error", err);
  };

  const onSuccess = (res) => {
    console.log("Success", res);
    setImg((prev) => ({ ...prev, isLoading: false, dbData: res }));
  };

  const onUploadProgress = (progress) => {
    console.log("Progress", progress);
  };

  const onUploadStart = (evt) => {
    console.log("Start", evt);
    setImg((prev) => ({ ...prev, isLoading: true }));
  };

  return (
    <div className="Upload">
      <IKContext
        urlEndpoint={urlEndpoint}
        publicKey={publicKey}
        authenticator={authenticator}
      >
        {/* upload component */}
        <IKUpload
          fileName="test-upload.png"
          onError={onError}
          onSuccess={onSuccess}
          useUniqueFileName={true}
          onUploadProgress={onUploadProgress}
          onUploadStart={onUploadStart}
          style={{ display: "none" }}
          ref={iKUploadRef}
        />
        {/* automatically run upload comp. */}
        {
          <label onClick={() => iKUploadRef.current.click()}>
            <img src="/attachment.png" alt="" />
          </label>
        }
      </IKContext>
    </div>
  );
};

export default Upload;
