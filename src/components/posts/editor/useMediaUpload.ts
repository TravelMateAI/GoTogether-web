import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

export interface Attachment {
  file: File;
  mediaId?: string;
  isUploading: boolean;
}

export default function useMediaUpload() {
  const { toast } = useToast();

  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>();

  async function handleStartUpload(files: File[]) {
    if (isUploading) {
      toast({
        variant: "destructive",
        description: "Please wait for the current upload to finish.",
      });
      return;
    }

    if (attachments.length + files.length > 5) {
      toast({
        variant: "destructive",
        description: "You can only upload up to 5 attachments per post.",
      });
      return;
    }

    const renamedFiles = files.map((file) => {
      const extension = file.name.split(".").pop();
      return new File([file], `attachment_${crypto.randomUUID()}.${extension}`, {
        type: file.type,
      });
    });

    setAttachments((prev) => [
      ...prev,
      ...renamedFiles.map((file) => ({ file, isUploading: true })),
    ]);

    try {
      setIsUploading(true);

      const formData = new FormData();
      renamedFiles.forEach((file) => formData.append("files", file));

      console.log("Hello");

      const uploadEndpoint = "/api/uploadthing/attachment"; // Update if different
      const response = await fetch(uploadEndpoint, {
        method: "POST",
        body: formData,
      });

      console.log(response);

      const text = await response.text();

      let result;
      try {
        result = JSON.parse(text);
      } catch (e) {
        console.error("Upload failed - HTML returned instead of JSON:\n", text);
        throw new Error("Upload failed: Unexpected server response (not JSON)");
      }


      console.log(result);

      if (!response.ok) throw new Error(result?.message || "Upload failed");

      setAttachments((prev) =>
        prev.map((a) => {
          const match = result.find((r: any) => r.name === a.file.name);
          if (!match) return a;
          return {
            ...a,
            mediaId: match.serverData?.mediaId,
            isUploading: false,
          };
        })
      );
    } catch (e: any) {
      setAttachments((prev) => prev.filter((a) => !a.isUploading));
      toast({
        variant: "destructive",
        description: e?.message || "Upload failed.",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(undefined);
    }
  }

  function removeAttachment(fileName: string) {
    setAttachments((prev) => prev.filter((a) => a.file.name !== fileName));
  }

  function reset() {
    setAttachments([]);
    setUploadProgress(undefined);
    setIsUploading(false);
  }

  return {
    startUpload: handleStartUpload,
    attachments,
    isUploading,
    uploadProgress,
    removeAttachment,
    reset,
  };
}
