const express = require('express');
const router = express.Router();
const Groups = require('../models/Groups');
const User = require('../models/User');
const verifyToken = require('../middleware/authMiddleware');


router.get('/', async (req, res) => {
  try {
    const groups = await Groups.find();
    res.status(200).json(groups);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch the groups' });
  }
});

router.post('/create', verifyToken, async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Group name is required' });
  }

  try {
    const existingGroup = await Groups.findOne({ name });
    if (existingGroup) {
      return res.status(400).json({ message: 'Group name already exists' });
    }

    const newGroup = new Groups({
      name,
      members: [],
    });

    await newGroup.save();
    res.status(201).json({ message: 'Group created successfully', group: newGroup });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create group' });
  }
});

router.post('/join/:groupId', verifyToken, async (req, res) => {
  try {
    const group = await Groups.findById(req.params.groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    if (group.members.includes(req.user.id)) {
      return res.status(400).json({ message: 'Already a member of the group' });
    }

    group.members.push(req.user.id);
    await group.save();
    res.status(200).json({ message: 'Joined group successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to join the group' });
  }
});

module.exports = router;



// router.post('', async (req, res) => {
//   try {
//    const { name, description } = req.body;

//     const newGroup = new Groups({
//       name,
//       description,
//       members: [],
//     });

//     await newGroup.save();
//     res.status(201).json(newGroup);
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to create group' });
//   }
// });