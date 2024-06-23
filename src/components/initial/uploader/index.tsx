"use client";


import { toast } from "@/components/ui/use-toast";
import { useControllableState } from "@/hooks/use-controllable-state";
import { CircleXIcon,  FileUpIcon, LoaderIcon} from "lucide-react";

import { useCallback, useEffect, useState } from "react";
import  {
    type DropzoneProps,
    type FileRejection,
    useDropzone
  } from "react-dropzone"

interface FileUploaderProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Value of the uploader.
     * @type File[]
     * @default undefined
     * @example value={files}
     */
    value?: File[]
  
    /**
     * Function to be called when the value changes.
     * @type React.Dispatch<React.SetStateAction<File[]>>
     * @default undefined
     * @example onValueChange={(files) => setFiles(files)}
     */
    onValueChange?: React.Dispatch<React.SetStateAction<File[]>>
  
    /**
     * Function to be called when files are uploaded.
     * @type (files: File[]) => Promise<void>
     * @default undefined
     * @example onUpload={(files) => uploadFiles(files)}
     */
    onUpload?: (files: File[]) => Promise<void>
  
    /**
     * Progress of the uploaded files.
     * @type Record<string, number> | undefined
     * @default undefined
     * @example progresses={{ "file1.png": 50 }}
     */
    progresses?: Record<string, number>
  
    /**
     * Accepted file types for the uploader.
     * @type { [key: string]: string[]}
     * @default
     * ```ts
     * { "image/*": [] }
     * ```
     * @example accept={["image/png", "image/jpeg"]}
     */
    accept?: DropzoneProps["accept"]
  
    /**
     * Maximum file size for the uploader.
     * @type number | undefined
     * @default 1024 * 1024 * 2 // 2MB
     * @example maxSize={1024 * 1024 * 2} // 2MB
     */
    maxSize?: DropzoneProps["maxSize"]
  
    /**
     * Maximum number of files for the uploader.
     * @type number | undefined
     * @default 1
     * @example maxFiles={5}
     */
    maxFiles?: DropzoneProps["maxFiles"]
  
    /**
     * Whether the uploader should accept multiple files.
     * @type boolean
     * @default false
     * @example multiple
     */
    multiple?: boolean
  
    /**
     * Whether the uploader is disabled.
     * @type boolean
     * @default false
     * @example disabled
     */
    disabled?: boolean
  }

export function Uploader(props: FileUploaderProps) {

    const {
        value: valueProp,
        onValueChange,
        onUpload,
        progresses,
        accept = {'image/jpg':[], 'image/jpeg':[], 'image/png':[], 'image/webp':[]},
        // maxSize = 1024 * 1024 * 2,
        
        maxFiles = 1,
        multiple = false,
        disabled = false,
        className,
        ...dropzoneProps
      } = props



  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  function onRemove(index: number) {
    if (!files) return
    const newFiles = files.filter((_, i) => i !== index)
    setFiles(newFiles)
    onValueChange?.(newFiles)
  }


  const [files, setFiles] = useControllableState({
    prop: valueProp,
    onChange: onValueChange,
  })


  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
    if (!multiple && maxFiles === 1 && acceptedFiles.length > 1) {
        toast({
            title: "Cannot upload more than 1 file"
        })
        return
      }

      if ((files?.length ?? 0) + acceptedFiles.length > maxFiles) {
        toast({
            title: `Cannot upload more than ${maxFiles} files`
        })
        return
      }

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )

      const updatedFiles = files ? [...files, ...newFiles] : newFiles

      setFiles(updatedFiles)

      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach(({ file }) => {
            toast({
                title: `Failed to upload ${file.name}`,
            })
        })
      }

      if (
        onUpload &&
        updatedFiles.length > 0 &&
        updatedFiles.length <= maxFiles
      ) {
        const target =
          updatedFiles.length > 0 ? `${updatedFiles.length} files` : `file`

        toast({
            title: `Uploading ${target}`,
        })
      }
    },
 []);

  const { acceptedFiles, getRootProps, getInputProps, isDragActive } =
    useDropzone({ onDrop, accept, maxFiles, disabled, multiple });



  useEffect(() => {
    if (acceptedFiles[0] != null) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    }

    return () => {
        if (!files) return
        files.forEach((file) => {
          if (isFileWithPreview(file)) {
            URL.revokeObjectURL(file.preview)
          }
        })
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps


  }
    , [acceptedFiles]);

  return (
    <div className=" space-y-6">
      <div
        {...getRootProps()}
        className=" w-full flex items-center justify-center border-dashed border-[#d6d6d6] border-2 h-[150px]  rounded-2xl cursor-pointe mt-3"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <div className="w-full flex flex-col items-center justify-center bg-[#F8FAFC] h-full rounded-2xl">
            <button className=" p-3 rounded-md shadow-md mb-3 ">
              <FileUpIcon />{" "}
            </button>
            <h2 className=" font-semibold text-[18px]">Drag an Image</h2>
            <p className=" font-medium text-[13px] text-[#b3b3b3]">
              click to upload 
            </p>
          </div>
        ) : (
          <div className="">
            {loading ? (
              <>
                <div className="flex flex-col items-center justify-center">
                  <div className="">
                    {" "}
                    <LoaderIcon className=" animate-spin " />
                  </div>
                  <div className=" text-center">
                    <h2 className=" font-semibold text-[14px]">
                      Uploading Picture
                    </h2>
                    <p className=" font-normal text-[12px] text-[#b3b3b3]">
                      Do not refresh or perform any other action while the
                      picture is being upload
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                {acceptedFiles[0] == null ? (
                  <div className=" w-full flex flex-col items-center justify-center h-full rounded-2xl">
                      <FileUpIcon />{" "}
                    <h2 className=" font-bold  font tracking-tight ">
                      Choose file to upload
                    </h2>
                    <p className=" font-medium text-[13px] text-[#b3b3b3]">
                      click to upload 
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="">
                    {files && files.length > 0 && (
        <div className="flex flex-col items-center">
          {files.map((file, index) =>
            isFileWithPreview(file) ? (
              <div key={index} className="my-3 flex flex-col w-fit">
                <div className="w-full flex items-end justify-start">
                  <button
                    className="z-50 absolute -mb-2 -ml-2"
                    onClick={() => onRemove(index)}
                  >
                    <CircleXIcon
                      className="text-red-500 border-2 border-white bg-white rounded-full"
                      width={15}
                      height={15}
                    />
                  </button>
                </div>
                <img
                  src={file.preview}
                  className="w-16 h-16 rounded-md object-cover"
                  alt="Upload preview"
                  width={64}
                  height={64}
                />
              </div>
            ) : null
          )}
          <div className="text-center">
            <h2 className="font-semibold text-[14px]">Image Uploaded</h2>
            <p className="font-normal text-[12px] text-[#b3b3b3]">
              Click to submit to update the picture
            </p>
          </div>
        </div>
      )}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>
      <div className="">
        {error && (
          <div className=" py-4 px-3 border-2 border-[#fd4747] rounded-lg">
            <h1 className="text-[#fd4747] text-[15px]">
              Sorry, something went wrong!
            </h1>
            <p className="text-[#fd4747] text-[11px]">Please try again.</p>
          </div>
        )}
      </div>
  
    </div>
  );
}

function isFileWithPreview(file: File): file is File & { preview: string } {
    return "preview" in file && typeof file.preview === "string"
  }