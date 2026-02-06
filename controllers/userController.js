let users = [];

// GET → return all users
export const getUsers = (req, res) => {
  res.json(users);
};

export const createUser = (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }
  const newUser = {
    id: Date.now(),
    name,
  };
  users.push(newUser);
  res.status(201).json(newUser);
};
// PATCH → update user name
export const updateUser = (req, res) => {
  const user = users.find((u) => u.id == req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.name = req.body.name || user.name;

  res.json(user);
};

// DELETE → remove user
export const deleteUser = (req, res) => {
  users = users.filter((u) => u.id != req.params.id);

  res.json({ message: "User deleted" });
};