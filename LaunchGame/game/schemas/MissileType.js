console.log('Loading MissileType.js');
const helperFunctions = require('../../helperFunctions');
const ByteBuffer = require('bytebuffer');

const { LaunchType } = require('./LaunchType');

const FEATURE_MAGNITUDE_NUKE = 5;
const FEATURE_MAGNITUDE_TRACKING = 2;
const FEATURE_MAGNITUDE_ECM = 2;

const DATA_SIZE = 11;

module.exports.MissileType = class MissileType extends LaunchType {
  constructor(data) {
    if (!data) return;
    if (data.buffer) {
      super(data);
      this.bNuclear = data.readByte() !== 0;
      this.bTracking = data.readByte() !== 0;
      this.bECM = data.readByte() !== 0;
      this.cSpeedIndex = data.readByte();
      this.cMissileCost = data.readInt();
      this.cRangeIndex = data.readByte();
      this.cBlastRadiusIndex = data.readByte();
      this.cMaxDamageIndex = data.readByte();
    }
    if (!data.buffer) {
      super(data);
      // console.log({ data });
      this.bNuclear = data.bNuclear;
      this.bTracking = data.bTracking;
      this.bECM = data.bECM;
      this.cSpeedIndex = data.cSpeedIndex;
      this.cMissileCost = data.cMissileCost;
      this.cRangeIndex = data.cRangeIndex;
      this.cBlastRadiusIndex = data.cBlastRadiusIndex;
      this.cMaxDamageIndex = data.cMaxDamageIndex;
    }
  }
  GetData() {
    let cBaseData = super.GetData();

    let bb = new ByteBuffer(DATA_SIZE + cBaseData.length);

    bb.append(cBaseData);
    bb.writeByte(this.bNuclear ? 0xff : 0x00);
    bb.writeByte(this.bTracking ? 0xff : 0x00);
    bb.writeByte(this.bECM ? 0xff : 0x00);
    bb.writeByte(this.cSpeedIndex);
    bb.writeInt(this.cMissileCost);
    bb.writeByte(this.cRangeIndex);
    bb.writeByte(this.cBlastRadiusIndex);
    bb.writeByte(this.cMaxDamageIndex);

    return bb.buffer;
  }
  GetDataSize() {
    return DATA_SIZE;
  }
};
