import React, { useState } from "react";
import {
  Box,
  Link,
  Card,
  Stack,
  Avatar,
  Typography,
  CardHeader,
  IconButton,
  Menu,
  Button,
  Divider,
} from "@mui/material";
import Modal from "@mui/material/Modal";
import { Link as RouterLink } from "react-router-dom";
import { fDate } from "../../utils/formatTime";
import MenuItem from "@mui/material/MenuItem";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/material/styles";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PostReaction from "./PostReaction";
import CommentForm from "../comment/CommentForm";
import CommentList from "../comment/CommentList";
import { useDispatch, useSelector } from "react-redux";
import { deletePost } from "./postSlice";
import useAuth from "../../hooks/useAuth";
import EditIcon from "@mui/icons-material/Edit";
import EditForm from "./EditForm";

const IconStyle = styled(Box)(({ theme }) => ({
  width: 20,
  height: 20,
  marginTop: 1,
  flexShrink: 0,
  marginRight: theme.spacing(2),
}));

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 420,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 3,
};

const confirmStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 420,
  height: 120,
  bgcolor: "background.paper",
  border: "2px solid #000",
  borderRadius: 1,
  boxShadow: 24,
  p: 3,
};

function PostCard({ post, userID }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { isLoading } = useSelector((state) => state.post);
  const [open, setOpen] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);

  const handleOpenModal = () => setOpen(true);
  const handleCloseModal = () => setOpen(false);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleDelete = () => {
    dispatch(deletePost(post._id));
    handleCloseConfirmModal();
  };

  const handleCancel = () => handleCloseConfirmModal();
  const handleOpenConfirmModal = () => {
    if (user._id === userID) {
      setOpenConfirm(true);
      handleClose();
    }
  };

  const handleCloseConfirmModal = () => setOpenConfirm(false);

  const renderMenu = (
    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
      <MenuItem onClick={handleOpenConfirmModal}>
        <IconStyle>
          <DeleteIcon />
        </IconStyle>
        Delete
      </MenuItem>
      <MenuItem onClick={handleOpenModal}>
        <IconStyle>
          <EditIcon />
        </IconStyle>
        Edit
      </MenuItem>
    </Menu>
  );

  return (
    <Card sx={{ mb: 3, p: 2, borderRadius: 2, boxShadow: 3 }}>
      <CardHeader
        disableTypography
        sx={{ padding: 0 }}
        avatar={
          <Avatar src={post?.author?.avatarUrl} alt={post?.author?.name} />
        }
        title={
          <Link
            variant="subtitle1"
            color="text.primary"
            component={RouterLink}
            sx={{ fontWeight: 600 }}
            to={`/user/${post.author._id}`}
          >
            {post?.author?.name}
          </Link>
        }
        subheader={
          <Typography
            variant="caption"
            sx={{ display: "block", color: "text.secondary" }}
          >
            {fDate(post.createdAt)}
          </Typography>
        }
        action={
          <IconButton onClick={handleClick}>
            <MoreVertIcon loading={isLoading} />
          </IconButton>
        }
      />
      {user._id === userID && renderMenu}

      <Divider sx={{ my: 2 }} />

      <Stack spacing={2}>
        <Typography>{post.content}</Typography>
        {post.image && (
          <Box
            sx={{
              borderRadius: 2,
              overflow: "hidden",
              height: 300,
              "& img": { objectFit: "cover", width: 1, height: 1 },
              transition: "transform 0.2s",
              "&:hover": {
                transform: "scale(1.02)",
              },
            }}
          >
            <img src={post.image} alt="post" />
          </Box>
        )}
        <PostReaction post={post} />
        <CommentList postId={post._id} userID={userID} />
        <CommentForm postId={post._id} />
      </Stack>

      {/* Modal for Edit */}
      <Modal open={open} onClose={handleCloseModal}>
        <Box sx={style}>
          <EditForm post={post} handleCloseModal={handleCloseModal} />
        </Box>
      </Modal>

      {/* Modal for Confirm Delete */}
      <Modal open={openConfirm} onClose={handleCloseConfirmModal}>
        <Box sx={confirmStyle}>
          <Typography sx={{ mb: 2 }} variant="h6" component="h2">
            Are you sure you want to delete?
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button variant="outlined" onClick={handleCancel} sx={{ mr: 1 }}>
              Cancel
            </Button>
            <Button variant="contained" color="error" onClick={handleDelete}>
              Delete
            </Button>
          </Box>
        </Box>
      </Modal>
    </Card>
  );
}

export default PostCard;
