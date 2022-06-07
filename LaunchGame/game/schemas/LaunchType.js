console.log('Loading LaunchType.js');

const helperFunctions = require('../../helperFunctions');
const ByteBuffer = require('bytebuffer');

const ASSET_ID_DEFAULT = -1;
const INDEX_TYPE_OVERRIDE = -1;

const DATA_SIZE = 6;

// FUTURE ME: IF YOU RUN INTO ISSUES HERE, IT'S PROBABLY BECAUSE THIS HAS BEEN CREATED FROM THE TOBSTER MISSILE SCHEMA, NOT THE CORBIN SCHEMA!!!

module.exports.LaunchType = class LaunchType {
  constructor(data) {
    if (!data) return;
    if (data.buffer) {
      this.cID = data.readByte();
      this.bPurchasable = data.readByte() !== 0;
      this.strName = helperFunctions.stringFromDataNew(data);
      this.lAssetID = data.readInt();
    }
    if (!data.buffer) {
      this.cID = data.cID;
      this.bPurchasable = data.bPurchasable;
      this.strName = data.strName;
      this.lAssetID = data.lAssetID;
    }
  }

  GetData() {
    let bb = new ByteBuffer(
      DATA_SIZE + helperFunctions.getStringDataSize(this.strName)
    );

    bb.writeByte(this.cID);
    bb.writeByte(this.bPurchasable ? 0xff : 0x00);
    bb.append(helperFunctions.getStringData(this.strName));
    bb.writeInt(this.lAssetID);

    return bb.buffer;
  }
  getDataSize() {
    return DATA_SIZE;
  }
  getID() {
    return this.cID;
  }
  getName() {
    return this.strName;
  }
  getPurchasable() {
    return this.bPurchasable;
  }
  getAssetID() {
    return this.lAssetID;
  }
};
