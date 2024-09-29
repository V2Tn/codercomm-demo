import React, { useState } from "react";
import {
  Avatar,
  Box,
  IconButton,
  Paper,
  Stack,
  Typography,
  Menu,
  Button,
} from "@mui/material";
import Modal from "@mui/material/Modal";
import MenuItem from "@mui/material/MenuItem";
import { fDate } from "../../utils/formatTime";
import CommentReaction from "./CommentReaction";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import useAuth from "../../hooks/useAuth";
import { useDispatch } from "react-redux";
import { deleteComment } from "./commentSlice";

const confirmStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 3,
  border: "1px solid #ccc",
};

function CommentCard({ comment, userID }) {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleOpenConfirmModal = () => {
    if (user._id === userID) {
      setOpenConfirm(true);
    }
    handleClose();
  };

  const handleCloseConfirmModal = () => {
    setOpenConfirm(false);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    dispatch(deleteComment(comment._id));
    handleCloseConfirmModal();
  };

  const handleCancel = () => {
    handleCloseConfirmModal();
  };

  const renderMenu = (
    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
      <MenuItem onClick={handleOpenConfirmModal}>Delete</MenuItem>
    </Menu>
  );

  return (
    <>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Avatar
          alt={comment.author?.name}
          src={comment.author?.avatarUrl}
          sx={{ width: 40, height: 40 }}
        />
        <Paper
          sx={{
            p: 2,
            flexGrow: 1,
            bgcolor: "background.neutral",
            borderRadius: 2,
            boxShadow: 2,
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mb: 1 }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {comment.author?.name}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.disabled" }}>
              {fDate(comment.createdAt)}
            </Typography>
          </Stack>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
            {comment.content}
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <CommentReaction comment={comment} />
            <IconButton onClick={handleClick} size="small">
              <MoreHorizIcon />
            </IconButton>
          </Box>
        </Paper>
      </Stack>
      {user._id === userID && renderMenu}
      <Modal
        open={openConfirm}
        onClose={handleCloseConfirmModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={confirmStyle}>
          <Typography
            sx={{ mb: 2 }}
            id="modal-modal-title"
            variant="h6"
            component="h2"
          >
            Are you sure you want to delete?
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              sx={{
                backgroundColor: "primary.main",
                color: "white",
                mr: 1,
                "&:hover": {
                  backgroundColor: "secondary.main",
                },
              }}
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              sx={{
                backgroundColor: "error.main",
                color: "white",
                "&:hover": {
                  backgroundColor: "error.dark",
                },
              }}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}

export default CommentCard;
