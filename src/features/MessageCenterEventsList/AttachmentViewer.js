import { useState } from "react";
import { Box, Link, Dialog, IconButton } from "@mui/material";
import InsertDriveFile from "@mui/icons-material/InsertDriveFile";
import CloseIcon from "@mui/icons-material/Close";

const AttachmentViewer = ({ attachment }) => {
  const [open, setOpen] = useState(false);

  if (!attachment || !attachment.url) return null;

  const fileUrl = attachment.url;
  const filename = fileUrl.split("/").pop().split("?")[0]; // limpiar querystring de S3
  const extension = filename.split(".").pop().toLowerCase();

  // Tipos soportados
  const imageExtensions = ["png", "jpg", "jpeg", "gif", "webp"];
  const pdfExtensions = ["pdf"];
  const docExtensions = ["doc", "docx"];
  const excelExtensions = ["xls", "xlsx"];

  const isImage = imageExtensions.includes(extension);
  const isPdf = pdfExtensions.includes(extension);
  const isDoc = docExtensions.includes(extension);
  const isExcel = excelExtensions.includes(extension);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box margin="10px 0">
      {isImage ? (
        <>
          {/* Miniatura de imagen */}
          <img
            src={fileUrl}
            width="150px"
            alt={filename}
            style={{ cursor: "pointer", borderRadius: "4px" }}
            onClick={handleOpen}
          />

          {/* Modal estilo fancybox */}
          <Dialog open={open} onClose={handleClose} maxWidth="lg">
            <Box
              position="relative"
              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={{ background: "black" }}
            >
              <IconButton
                onClick={handleClose}
                sx={{ position: "absolute", top: 8, right: 8, color: "white" }}
              >
                <CloseIcon />
              </IconButton>
              <img
                src={fileUrl}
                alt={filename}
                style={{ maxWidth: "90vw", maxHeight: "90vh" }}
              />
            </Box>
          </Dialog>
        </>
      ) : isPdf ? (
        <Box display="flex" alignItems="center" gap={1}>
          <InsertDriveFile color="error" /> {/* PDF rojo */}
          <Link href={fileUrl} target="_blank" color="error" rel="noreferrer">
            {filename}
          </Link>
        </Box>
      ) : isDoc ? (
        <Box display="flex" alignItems="center" gap={1}>
          <InsertDriveFile color="primary" /> {/* Word azul */}
          <Link href={fileUrl} target="_blank" color="primary" rel="noreferrer">
            {filename}
          </Link>
        </Box>
      ) : isExcel ? (
        <Box display="flex" alignItems="center" gap={1}>
          <InsertDriveFile sx={{ color: "green" }} /> {/* Excel verde */}
          <Link href={fileUrl} target="_blank" sx={{ color: "green" }} rel="noreferrer">
            {filename}
          </Link>
        </Box>
      ) : (
        // fallback para cualquier otro archivo
        <Box display="flex" alignItems="center" gap={1}>
          <InsertDriveFile />
          <Link href={fileUrl} target="_blank" rel="noreferrer">
            {filename}
          </Link>
        </Box>
      )}
    </Box>
  );
};

export default AttachmentViewer;