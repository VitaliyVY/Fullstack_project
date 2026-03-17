import { IKContext, IKUpload } from "imagekitio-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const authenticator = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/posts/upload-auth`,
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`,
      );
    }

    const data = await response.json();
    const { signature, expire, token } = data;
    return { signature, expire, token };
  } catch (error) {
    throw new Error(`Authentication request failed: ${error.message}`);
  }
};

const getInitialConfig = () => ({
  publicKey: import.meta.env.VITE_IK_PUBLIC_KEY || "",
  urlEndpoint: import.meta.env.VITE_IK_URL_ENDPOINT || "",
});

const Upload = ({ children, type, setProgress, setData }) => {
  const ref = useRef(null);
  const [ikConfig, setIkConfig] = useState(getInitialConfig);
  const isConfigReady = Boolean(ikConfig.publicKey && ikConfig.urlEndpoint);

  useEffect(() => {
    if (isConfigReady) return;

    let isCancelled = false;

    const loadConfig = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/posts/upload-config`,
        );

        if (!response.ok) {
          throw new Error(`Config request failed with status ${response.status}`);
        }

        const data = await response.json();
        if (isCancelled) return;

        setIkConfig({
          publicKey: data.publicKey || "",
          urlEndpoint: data.urlEndpoint || "",
        });
      } catch (error) {
        if (!isCancelled) {
          console.error(error);
        }
      }
    };

    loadConfig();

    return () => {
      isCancelled = true;
    };
  }, [isConfigReady]);

  const onError = (err) => {
    console.log(err);
    toast.error("Image upload failed!");
  };

  const onSuccess = (res) => {
    console.log(res);
    setData(res);
    if (setProgress) setProgress(100);
  };

  const onUploadProgress = (progress) => {
    const total = progress?.total || 0;
    const loaded = progress?.loaded || 0;
    const value = total > 0 ? Math.round((loaded / total) * 100) : 0;
    if (setProgress) setProgress(value);
  };

  const handleOpenPicker = () => {
    if (!isConfigReady) {
      toast.error("Upload is not ready yet. Please try again.");
      return;
    }
    ref.current?.click();
  };

  return (
    <IKContext
      publicKey={ikConfig.publicKey}
      urlEndpoint={ikConfig.urlEndpoint}
      authenticator={authenticator}
    >
      {isConfigReady && (
        <IKUpload
          useUniqueFileName
          onError={onError}
          onSuccess={onSuccess}
          onUploadProgress={onUploadProgress}
          className="hidden"
          ref={ref}
          accept={`${type}/*`}
        />
      )}
      <div className="cursor-pointer" onClick={handleOpenPicker}>
        {children}
      </div>
    </IKContext>
  );
};

export default Upload;
