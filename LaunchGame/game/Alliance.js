const helperFunctions = require('../helperFunctions');

const DATA_SIZE = 8;

const ALLIANCE_ID_UNAFFILIATED = -1;
const ALLIANCE_AVATAR_DEFAULT = -1;
const ALLIANCE_MAX_DESCRIPTION_CHARS = 140;

class Alliance {
  constructor(data) {
    if (!data) return;
    // New Alliance
    // From data
    // From ByteBuffer
    if (data.buffer) {
      this.lID = data.readInt();
      this.strName = helperFunctions.StringFromData(data);
      this.strDescription = helperFunctions.StringFromData(data);
      this.lAvatarID = data.readInt();
      return;
    }
  }
}

module.exports.Alliance = Alliance;
