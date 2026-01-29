import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Avatar,
  IconButton,
  Skeleton,
  Box
} from '@mui/material';
import { red } from '@mui/material/colors';
import EditIcon from '@mui/icons-material/Edit';
import AttachmentIcon from '@mui/icons-material/AttachFile';

import { getInitials } from '../utils/others';

export default function CommentCard({ comment, onClickEdit, wrapperStyle = {}, loading = false }) {
  const handleAttachmentClick = (url) => {
    window.open(url, '_blank');
  };

  return (
    <Card
      variant="outlined"
      sx={{ width: '100%', borderRadius: 0, '--Card-radius': 0, ...wrapperStyle }}
    >
      <CardHeader
        avatar={
          loading ? (
            <Skeleton animation="wave" variant="circular" width={40} height={40} />
          ) : (
            <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
              {getInitials(comment.fullname)}
            </Avatar>
          )
        }
        action={
          loading ? null : (
            <Box sx={{ display: 'flex' }}>
              {comment.image_url && (
                <IconButton
                  aria-label="attachment"
                  onClick={() => handleAttachmentClick(comment.image_url)}
                  sx={{ mr: 1 }}
                >
                  <AttachmentIcon />
                </IconButton>
              )}
              <IconButton aria-label="settings" onClick={onClickEdit}>
                <EditIcon />
              </IconButton>
            </Box>
          )
        }
        title={
          loading ? (
            <Skeleton animation="wave" height={10} width="50%" style={{ marginBottom: 6 }} />
          ) : (
            comment.fullname
          )
        }
        subheader={
          loading ? (
            <Skeleton animation="wave" height={10} width="40%" />
          ) : (
            new Date(comment.comment_time).toLocaleDateString()
          )
        }
      />
      <CardContent orientation="horizontal">
        {loading ? (
          <>
            <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
            <Skeleton animation="wave" height={10} width="80%" />
          </>
        ) : (
          <Typography variant="body1" color="text.secondary">
            {comment.comment}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
