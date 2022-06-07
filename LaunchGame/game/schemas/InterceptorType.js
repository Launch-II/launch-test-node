console.log('Loading InterceptorType.js');
const helperFunctions = require('../../helperFunctions');
const ByteBuffer = require('bytebuffer');

const { LaunchType } = require('./LaunchType');

const FEATURE_MAGNITUDE_NUKE = 5;
const FEATURE_MAGNITUDE_TRACKING = 2;
const FEATURE_MAGNITUDE_ECM = 2;

const DATA_SIZE = 10;

module.exports.InterceptorType = class InterceptorType extends LaunchType {
  constructor(data) {
    if (!data) return;
    if (data.buffer) {
      super(data);

      this.cInterceptorCost = data.readInt();
      this.fltHitChance = helperFunctions.roundFloat(data.readFloat()); // Watch out - this wasn't in the code!
      this.cSpeedIndex = data.readByte();
      this.cRangeIndex = data.readByte();
    }
    if (!data.buffer) {
      super(data);

      this.cInterceptorCost = data.cInterceptorCost;
      this.fltHitChance = data.fltHitChance;
      this.cSpeedIndex = data.cSpeedIndex;
      this.cRangeIndex = data.cRangeIndex;
    }
  }
  getDataSize() {
    return DATA_SIZE;
  }
  GetData() {
    let cBaseData = super.GetData();

    let bb = new ByteBuffer(DATA_SIZE + cBaseData.length);

    bb.append(cBaseData);
    bb.writeInt(this.cInterceptorCost);
    bb.writeFloat(this.fltHitChance);
    bb.writeByte(this.cSpeedIndex);
    bb.writeByte(this.cRangeIndex);

    return bb.buffer;
  }

  GetFeatureMagnitude() {
    return 1 + this.cSpeedIndex + this.cRangeIndex;
  }
};
