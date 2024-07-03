const handlerFunctions = {
  register: async (req, res) => {
    const { username, password } = req.body;

    if (await User.findOne({ where: { username: username } })) {
      res.send({
        message: "username already exists",
        success: false,
      });
      return;
    }

    const newUser = await User.create({
      username: username,
      password: password,
    });

    req.session.userId = newUser.userId;

    res.send({
      message: "user created",
      success: true,
      userId: newUser.userId,
    });
  },
};

export default handlerFunctions;
