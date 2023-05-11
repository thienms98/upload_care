import { useState, useEffect } from 'react';
import { uploadFile } from '@uploadcare/upload-client';
// import { fileInfo, UploadcareSimpleAuthSchema } from "@uploadcare/rest-client";

export default function ImageUploader() {
  const [fileName, setFileName] = useState('');
  const [fileUUID, setFileUUID] = useState('');
  const [fileUrl, setFileUrl] = useState('');

  // fileData must be `Blob`, `File`, `Buffer`, UUID, CDN URL or Remote URL
  const upload = async (fileData) => {
    const result = await uploadFile(fileData, {
      publicKey: process.env.REACT_APP_UPLOADCARE_PUBLIC_KEY || '5ba79114515337330f64',
      store: 'auto',
      metadata: {
        name: fileName.replace(/.png/g, ''),
        createAt: new Date(),
      },
    });
    console.log(result);
    setFileUUID(result.uuid);
    setFileUrl(result.cdnUrl);
  };

  // get cdn link - url by uuid
  // useEffect(() => {
  //   if (!fileUUID) return;
  //   const uploadcareSimpleAuthSchema = new UploadcareSimpleAuthSchema({
  //     publicKey: "5ba79114515337330f64",
  //     secretKey: "f24cb51945082fd09222",
  //   });

  //   fileInfo(
  //     {
  //       uuid: fileUUID,
  //     },
  //     { authSchema: uploadcareSimpleAuthSchema }
  //   ).then((result) => {
  //     console.log(result);
  //     setFileUrl(result.originalFileUrl);
  //   });
  // }, [fileUUID]);

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          upload(new Blob(e.target.file.files));
        }}
      >
        <input type="file" name="file" id="" onChange={(e) => setFileName(e.target.files[0].name)} />
        <input type="submit" value="Upload" />
      </form>

      <img src={fileUrl} alt="" width={500} />
    </>
  );
}
