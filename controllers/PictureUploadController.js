const imageMimeTypes = ["image/jpeg", "image/png", "images/gif"];

const savePicture = (user, encodedPic) => {
  if (encodedPic == null) return;
  const pic = JSON.parse(encodedPic);
  if (pic != null && imageMimeTypes.includes(pic.type)) {
    user.profilePic = new Buffer.from(pic.data, "base64");
    user.profilePicType = pic.type;
  }
};

module.exports = { savePicture };
