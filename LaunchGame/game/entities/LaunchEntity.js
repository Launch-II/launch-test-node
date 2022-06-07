console.log('Loading LaunchEntity.js');
const ByteBuffer = require('bytebuffer');
const helperFunctions = require('../../helperFunctions');
const { GeoCoord } = require('../GeoCoord');
// const gameSimulation = require('../../../LaunchServer/server/gameSimulation');

// FUTURE ME: IF YOU RUN INTO ISSUES HERE, IT'S PROBABLY BECAUSE THIS HAS BEEN CREATED FROM THE TOBSTER MISSILE SCHEMA, NOT THE CORBIN SCHEMA!!!

const DATA_SIZE = 12;
const ID_NONE = -1;

class LaunchEntity {
  constructor(data) {
    // Accepts a bytebuffer or an object with parameters
    if (!data) return;
    if (data.buffer) {
      this.lID = data.readInt();
      this.geoPosition = new GeoCoord(
        helperFunctions.roundFloat(data.readFloat()),
        helperFunctions.roundFloat(data.readFloat())
      );
    }
    if (!data.buffer) {
      this.lID = data.lID;
      this.geoPosition = data.geoPosition;
    }
  }
  GetData(lAskingID) {
    const bb = new ByteBuffer(DATA_SIZE);
    bb.writeInt(this.lID);
    bb.writeFloat(this.geoPosition.GetLatitude());
    bb.writeFloat(this.geoPosition.GetLongitude());
    return bb.buffer;
  }
  GetPosition() {
    return this.geoPosition;
  }

  SetPosition(geoPosition) {
    this.geoPosition = geoPosition;
    Changed(false);
  }
  GetID() {
    return this.lID;
  }
  GetPosition() {
    return this.geoPosition;
  }
  Changed(bOwner) {
    gameSimulation.entityChanged(this, bOwner);
  }
}

module.exports.LaunchEntity = LaunchEntity;
