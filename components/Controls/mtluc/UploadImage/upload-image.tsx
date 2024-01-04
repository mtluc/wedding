/* eslint-disable @next/next/no-img-element */
import { DragEvent, FormEvent, createRef, useState } from "react";
import { buildClass, handlerRequertException } from "../base/common";
import styles from "./upload-image.module.scss";
import Modal from "../Modal/modal";

const UploadImage = ({
  onUpload,
  onClose,
}: {
  onUpload?: (files: File[]) => Promise<boolean>;
  onClose?: () => void;
}) => {
  const inputRef = createRef<HTMLInputElement>();
  const [files, setFiles] = useState(
    [] as {
      file: File;
      base64: string;
    }[]
  );

  const toBase64 = async (file: File) => {
    return (
      ((await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
      })) as string) || ""
    );
  };

  const onChoseImage = async (e: FormEvent) => {
    try {
      e.preventDefault();
      const _files = [...files];
      if (inputRef.current?.files?.length) {
        for (let i = 0; i < inputRef.current.files.length; i++) {
          _files.push({
            file: inputRef.current.files[i],
            base64: await toBase64(inputRef.current.files[i]),
          });
        }
        inputRef.current.value = "";
        setFiles(_files);
      }
    } catch (error) {
      handlerRequertException(error);
    }
  };

  const stopEvent = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const onDrop = async (e: DragEvent) => {
    try {
      e.preventDefault();
      e.stopPropagation();
      const _files: {
        file: File;
        base64: string;
      }[] = [];
      const _filesIn = e.dataTransfer.files;
      if (_filesIn?.length) {
        for (let i = 0; i < _filesIn.length; i++) {
          if (
            _filesIn[i].type == "image/png" ||
            _filesIn[i].type == "image/jpeg"
          ) {
            _files.push({
              file: _filesIn[i],
              base64: await toBase64(_filesIn[i]),
            });
          }
        }
        if (_files.length) {
          setFiles([...files, ..._files]);
        }
      }
    } catch (error) {
      handlerRequertException(error);
    }
  };

  const onPaste = async (e: any) => {
    try {
      e.preventDefault();
      e.stopPropagation();
      const _files: {
        file: File;
        base64: string;
      }[] = [];
      const _filesIn = e.clipboardData.files;
      if (_filesIn?.length) {
        for (let i = 0; i < _filesIn.length; i++) {
          if (
            _filesIn[i].type == "image/png" ||
            _filesIn[i].type == "image/jpeg"
          ) {
            _files.push({
              file: _filesIn[i],
              base64: await toBase64(_filesIn[i]),
            });
          }
        }
        if (_files.length) {
          setFiles([...files, ..._files]);
        }
      }
    } catch (error) {
      handlerRequertException(error);
    }
  };
  return (
    <Modal
      title="Upload ảnh"
      onClose={() => {
        onClose?.();
      }}
    >
      <div className={styles.waper}>
        <input
          ref={inputRef}
          type="file"
          name="choseFile"
          id="choseFile"
          multiple
          hidden
          accept="image/png,image/jpeg"
          onChange={onChoseImage}
        />
        <div className={styles.main}>
          <div
            className={buildClass(["custom-scroll", styles.preview])}
            tabIndex={0}
            onDrop={onDrop}
            onDrag={stopEvent}
            onDragStart={stopEvent}
            onDragEnd={stopEvent}
            onDragOver={stopEvent}
            onDragEnter={stopEvent}
            onDragLeave={stopEvent}
            onPaste={onPaste}
            contentEditable
            suppressContentEditableWarning
            onKeyDown={(e) => {
              if (!(e.key?.toLowerCase() == "v" && e.ctrlKey)) {
                e.preventDefault();
              }
            }}
          >
            {files.length ? (
              files.map((fileInf, idx) => {
                return (
                  <div
                    key={idx}
                    className={buildClass([
                      files.length < 2
                        ? "col-12"
                        : files.length < 5
                          ? "col-6"
                          : "col-4",
                      styles.item_preview,
                    ])}
                  >
                    <img src={fileInf.base64} alt={fileInf.file.name} />
                    <div className={styles.file_name}>{fileInf.file.name}</div>
                    <div className={styles.action}>
                      <button
                        type="button"
                        title="Xóa"
                        onClick={() => {
                          setFiles(files.filter((x) => x != fileInf));
                        }}
                      >
                        <i className="fa fa-trash" />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className={styles.empty_image}>Kéo hoặc dán ảnh vào đây</div>
            )}
          </div>
          <div className={styles.task_bar}>
            <button
              type="button"
              className="btn"
              onClick={(e) => {
                e.preventDefault();
                if (inputRef?.current) {
                  inputRef.current.value = "";
                  inputRef.current.click();
                }
              }}
            >
              Chọn ảnh
            </button>
            <button className="btn-primary-ltr" disabled={!files?.length} onClick={(e) => {
              e.preventDefault();
              onUpload?.(files.map(({ file }) => file));
            }}>
              Upload
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
export default UploadImage;
