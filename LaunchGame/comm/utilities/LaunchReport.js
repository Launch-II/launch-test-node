const helperFunctions = require('../../helperFunctions');

const DATA_SIZE = 27;

const FLAG_LEFT_IS_ALLIANCE = 0x01; //LeftID refers to an alliance, not a player.
const FLAG_RIGHT_IS_ALLIANCE = 0x02; //RightID refers to an alliance, not a player.
const FLAG_RES3 = 0x04;
const FLAG_RES4 = 0x08;
const FLAG_RES5 = 0x10;
const FLAG_RES6 = 0x20;
const FLAG_RES7 = 0x40;
const FLAG_RES8 = 0x80;

const ID_NOBODY = -1;
class LaunchReport {
  constructor(data) {
    let sData = Object.keys(data).length;
    if (data.buffer) {
      this.oTimeStart = data.readLong();
      this.oTimeEnd = data.readLong();
      this.strMessage = helperFunctions.stringFromData(data);
      this.bIsMajor = data.readByte() !== 0;
      this.lLeftID(data.readInt());
      this.lRightID(data.readInt());
      this.cTimes = data.readInt();
      this.cFlags = data.readInt();
    } else {
      switch (sData) {
        // A really basic report.
        case 2:
          {
            this.strMessage = data.strMessage;
            this.bIsMajor = data.bIsMajor;
            this.lLeftID = ID_NOBODY;
            this.lRightID = ID_NOBODY;
            this.cTimes = 1;
            this.cFlags = 0;
          }
          break;

        // A report where a player did something.
        case 3:
          {
            this.strMessage = data.strMessage;
            this.bIsMajor = data.bIsMajor;
            this.lLeftID = data.lLeftID;
            this.lRightID = ID_NOBODY;
            this.cTimes = 1;
            this.cFlags = 0;
          }
          break;

        // A report where a player did something to another player.
        case 4:
          {
            this.strMessage = data.strMessage;
            this.bIsMajor = data.bIsMajor;
            this.lLeftID = data.lLeftID;
            this.lRightID = data.lRightID;
            this.cTimes = 1;
            this.cFlags = 0;
          }
          break;

        // A report where a player did something to another player.
        case 6:
          {
            this.strMessage = data.strMessage;
            this.bIsMajor = data.bIsMajor;
            this.lLeftID = data.lLeftID;
            this.lRightID = ID_NOBODY;
            this.cTimes = 1;
            this.cFlags = 0;

            if (data.bLeftIDAlliance) SetLeftIDAlliance(data.bLeftIDAlliance);

            if (data.bRightIDAlliance)
              SetRightIDAlliance(data.bRightIDAlliance);
          }
          break;

        // From data
        case 8:
          {
            this.oTimeStart = data.oTimeStart;
            this.oTimeEnd = data.oTimeEnd;
            this.strMessage = data.strMessage;
            this.bIsMajor = data.bIsMajor;
            this.lLeftID = data.lLeftID;
            this.lRightID = data.lRightID;
            this.cTimes = data.cTimes;
            this.cFlags = data.cFlags;
          }
          break;
        default:
          {
            console.log(
              'Oooh ooh ah ah (monkey noises) because you are an ape!'
            );
          }
          break;
      }
    }
  }

  GetData() {
    const bb = new ByteBuffer(
      DATA_SIZE + helperFunctions.GetStringDataSize(this.strMessage)
    );

    bb.writeLong(oTimeStart);
    bb.writeLong(oTimeEnd);
    bb.append(helperFunctions.GetStringData(this.strMessage));
    bb.append(this.bIsMajor ? 0xff : 0x00);
    bb.writeInt(lLeftID);
    bb.writeInt(lRightID);
    bb.append(cTimes);
    bb.append(cFlags);

    return bb.buffer;
  }

  Update(report) {
    //A report with the same hash was received by the client. Merge the timestamp data with this one.
    this.oTimeStart = Math.min(this.oTimeStart, report.GetStartTime());
    this.oTimeEnd = Math.max(this.oTimeEnd, report.GetEndTime());
    this.cTimes++;
  }

  HappenedAgain() {
    this.oTimeEnd = new Date.getTime();
    this.cTimes++;
  }

  SetLeftIDAlliance(bAlliance) {
    if (bAlliance) this.cFlags |= FLAG_LEFT_IS_ALLIANCE;
    else this.cFlags &= ~FLAG_LEFT_IS_ALLIANCE;
  }

  SetRightIDAlliance(bAlliance) {
    if (bAlliance) this.cFlags |= FLAG_RIGHT_IS_ALLIANCE;
    else this.cFlags &= ~FLAG_RIGHT_IS_ALLIANCE;
  }

  GetLeftIDAlliance() {
    return (this.cFlags & FLAG_LEFT_IS_ALLIANCE) != 0;
  }

  GetRightIDAlliance() {
    return (this.cFlags & FLAG_RIGHT_IS_ALLIANCE) != 0;
  }

  HasTimeRange() {
    return this.oTimeStart !== this.oTimeEnd;
  }
}
