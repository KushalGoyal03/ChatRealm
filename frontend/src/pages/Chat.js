import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import axios from "axios";

const Chat = () => {
  const [groups, setGroups] = useState([]);
  const [open, setOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [emails, setEmails] = useState("");

  // Fetch user's groups
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/groups")
      .then((res) => setGroups(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Handle creating a new group
  const handleCreateGroup = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/groups/create", {
        name: groupName,
        members: emails.split(",").map((email) => email.trim()),
      });

      setGroups([...groups, res.data]); // Add new group to the list
      setOpen(false);
      setGroupName("");
      setEmails("");
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Group Chats
      </Typography>

      {/* Create Group Button */}
      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        Create Group
      </Button>

      {/* List of Groups */}
      <List>
        {groups.map((group) => (
          <ListItem key={group._id} button>
            <ListItemText primary={group.name} />
          </ListItem>
        ))}
      </List>

      {/* Create Group Modal */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Create a New Group</DialogTitle>
        <DialogContent>
          <TextField
            label="Group Name"
            fullWidth
            margin="normal"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          <TextField
            label="Invite Users (comma-separated emails)"
            fullWidth
            margin="normal"
            value={emails}
            onChange={(e) => setEmails(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateGroup} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Chat;

// import React from "react";
// import { Container, Typography, Box } from "@mui/material";

// const Chat = () => {
//   return (
//     <Container>
//       <Box textAlign="center" mt={5}>
//         <Typography
//           variant="h3"
//           sx={{ marginTop: "10rem", fontWeight: "bold" }}
//         >
//           Connect, Chat, and Share
//         </Typography>
//       </Box>
//     </Container>
//   );
// };

// export default Chat;
