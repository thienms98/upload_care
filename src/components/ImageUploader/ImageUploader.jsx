import { useState, useEffect } from 'react';
import { uploadFile } from '@uploadcare/upload-client';
import { deleteFile, listOfFiles, UploadcareSimpleAuthSchema } from '@uploadcare/rest-client';

export default function ImageUploader() {
  const [fileName, setFileName] = useState('');
  const [fileUUID, setFileUUID] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [list, setList] = useState([]);

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
    getList();
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

  // get images uploaded list
  const uploadcareSimpleAuthSchema = new UploadcareSimpleAuthSchema({
    publicKey: '5ba79114515337330f64',
    secretKey: '0fee1891e96bda69f30c',
  });

  function getList() {
    listOfFiles({}, { authSchema: uploadcareSimpleAuthSchema }).then((res) => setList(res.results));
  }
  async function deleteItem(uuid) {
    await deleteFile(
      {
        uuid,
      },
      { authSchema: uploadcareSimpleAuthSchema },
    );
    getList();
  }

  useEffect(() => {
    getList();
  }, []);

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <button>
          <label htmlFor="file" style={{ fontSize: '32px' }}>
            Upload here
          </label>
        </button>
        <input
          type="file"
          name="file"
          id="file"
          hidden
          onChange={(e) => {
            setFileName(e.target.files[0].name);
            upload(new Blob(e.target.files));
          }}
        />
      </form>

      <img src={fileUrl} alt="" width={500} />
      <hr />

      <h3>Right click to remove image</h3>
      <div>
        {list.map((image) => {
          return (
            <>
              <img
                src={image.originalFileUrl}
                key={image.uuid}
                alt=""
                width={200}
                onContextMenu={(e) => {
                  e.preventDefault();
                  deleteItem(image.uuid);
                }}
              />
            </>
          );
        })}
      </div>
    </>
  );
}
