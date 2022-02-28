const UsersCollection = require("../../models/Users");

const SearchUser = async (req, res) => {
  //searching user with both regex and text index
  const { searchkeyword } = req.params;
  try {
    if (!searchkeyword) {
      return res
        .status(404)
        .send({ type: "error", msg: "No empty values allowed" });
    }
    //this will search from created compound index in schema
    let resultFound = await UsersCollection.find(
      {
        $text: { $search: searchkeyword },
      },
      "name email"
    );
    //above giving only full word search eg->outlook true, but out ->false
    //for partial search provided with regexSearch eg-> out ->true and outlook->true
    //so if above gives empty array do this below ops
    if (resultFound.length < 1) {
      resultFound = await UsersCollection.find(
        {
          $or: [
            {
              name: { $regex: searchkeyword },
            },
            {
              email: { $regex: searchkeyword },
            },
          ],
        },
        "name email"
      );
    }
    res.send({ type: "success", usersFound: resultFound });
  } catch (err) {
    return res.status(500).send({ type: "error", msg: err.message });
  }
};

module.exports = SearchUser;
