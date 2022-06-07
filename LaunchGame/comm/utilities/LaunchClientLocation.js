const { GeoCoord } = require('../../game/GeoCoord');
const helperFunctions = require('../../helperFunctions');
const FLAG_GPS = 0x01;
const FLAG_NETWORK = 0x02;
const FLAG_UNKNOWN = 0x04;
const FLAG_PRIVACY_ZONE = 0x08;
class LaunchClientLocation {
  constructor(data) {
    if (!data) return;
    this.cFlags = 0x00;

    if (data.buffer) {
      this.geoLocation = new GeoCoord(data.readFloat(), data.readFloat());
      this.oTime = data.readLong();
      this.fltAccuracy = data.readFloat();
      this.cFlags = data.readByte();
    }

    if (!data.buffer) {
      this.geoLocation = new GeoCoord(
        data.dblLatitudeDeg,
        data.dblLongitudeDeg,
        true
      );
      this.oTime = new Date().getTime();

      this.fltAccuracy = data.fltAccuracy;
      this.strProvider = data.strProvider;

      switch (this.strProvider) {
        case 'GPS':
          SetGPS();
          break;
        case 'NETWORK':
          SetNetwork;
          break;
        default:
          SetUnknown();
          break;
      }
    }
  }

  GetData() {
    let bb = new ByteBuffer(21);

    bb.writeFloat(this.GetLatitude());
    bb.writeFloat(this.GetLongitude());
    bb.writeLong(this.oTime);
    bb.writeFloat(this.fltAccuracy);
    bb.writeByte(this.cFlags);

    return bb.buffer;
  }

  GetLatitude() {
    return this.geoLocation.GetLatitude();
  }

  GetLongitude() {
    return this.geoLocation.GetLongitude();
  }

  SetGPS() {
    this.cFlags |= FLAG_GPS;
  }

  SetNetwork() {
    this.cFlags |= FLAG_NETWORK;
  }

  SetUnknown() {
    this.cFlags |= FLAG_UNKNOWN;
  }

  SetLocationBecauseOfPrivacyZone(geoLocation) {
    this.geoLocation = geoLocation;
    this.cFlags |= FLAG_PRIVACY_ZONE;
  }

  IsGPS() {
    return (this.cFlags & FLAG_GPS) != 0x00;
  }

  IsNetwork() {
    return (this.cFlags & FLAG_NETWORK) != 0x00;
  }

  IsUnknown() {
    return (this.cFlags & FLAG_UNKNOWN) != 0x00;
  }

  InPrivacyZone() {
    return (this.cFlags & FLAG_PRIVACY_ZONE) != 0x00;
  }

  GetLocationTypeName() {
    let str;

    if (this.IsGPS()) str = 'GPS';

    if (this.IsNetwork()) str = 'Network';

    if (!this.IsNetwork && !this.IsGPS) str = 'Unknown';

    return this.InPrivacyZone() ? str : `${str}(P)`;
  }
}

module.exports.LaunchClientLocation = LaunchClientLocation;
