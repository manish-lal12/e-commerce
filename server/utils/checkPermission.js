const isAuthorized = (requestUser, resourceUserId) => {
  console.log(requestUser, resourceUserId.toString());

  if (requestUser.role === "admin") return;
  if (requestUser.userId === resourceUserId.toString()) return;
  throw new Error("Not authorized to access this route");
};
//   throw new Error("Not authorized to access this route");
// };

module.exports = isAuthorized;
