const helperFunctions = require('../helperFunctions');
const { TimeDelay } = require('../comm/utilities/TimeDelay');
const banstates = ['NOT', 'TIME_BANNED_ACK', 'TIME_BANNED', 'PERMABANNED'];

const INFO_HASH_LENGTH = 8;

const BAN_DURATION_INITIAL = 3600000;
const BAN_MULTIPLIER = 4;
const NEXT_BAN_HOURLY_REDUCTION = 10000;

class User {
  constructor(data) {
    // Accepts a bytebuffer or an object.
    if (!data) return;
    this.bAttackAlarm = false;
    this.bNuclearEscalationAlarm = false;
    this.bAllyAttackAlarm = false;
    this.Reports = [];

    if (Object.keys(data).length > 2) {
      // console.log('Restoring User from data:', data);
      this.UID = data.UID;
      this.lPlayerID = data.lPlayerID;
      this.banState = banstates[data.cBanState];
      this.oNextBanTime = data.oNextBanTime;
      this.dlyBanDuration = new TimeDelay(data.oBanDurationRemaining);
      this.strBanReason = data.strBanReason;
      this.strLastIP = data.strLastIP;
      this.bLastTypeMobile = data.bLastTypeMobile;
      this.oDeviceCheckedDate = data.oDeviceCheckedDate;
      this.bLastDeviceCheckFailed = data.bLastDeviceCheckFailed;
      this.bDeviceChecksAPIFailed = data.bDeviceChecksAPIFailed;
      this.bProscribed = data.bProscribed;
      this.lDeviceChecksFailCode = data.lDeviceChecksFailCode;
      this.bProfileMatch = data.bProfileMatch;
      this.bBasicIntegrity = data.bBasicIntegrity;
      this.bApproved = data.bApproved;
      this.oExpired = data.oExpired;
      this.strDeviceShortHash = data.strDeviceShortHash;
      this.strAppListShortHash = data.strAppListShortHash;
    }
    if (Object.keys(data).length == 2) {
      // If passed with only two parameters
      console.log('Creating new User from data:', data);
      this.UID = data.UID;
      this.lPlayerID = data.lPlayerID;
      this.banState = 'NOT';
      this.oNextBanTime = BAN_DURATION_INITIAL;
      this.dlyBanDuration = new TimeDelay();
      this.strBanReason = '';
      this.strLastIP = '';
      this.oDeviceCheckedDate = 0;
      this.bLastDeviceCheckFailed = false;
      this.bDeviceChecksAPIFailed = false;
      this.bProscribed = false;
      this.lDeviceChecksFailCode = 0;
      this.bProfileMatch = false;
      this.bBasicIntegrity = false;
      this.bApproved = false;
      this.oExpired = 0;
      this.strDeviceShortHash = '';
      this.strAppListShortHash = '';
    }
  }

  Tick(timeMS) {
    if (this.banState == 'TIME_BANNED') {
      this.dlyBanDuration.Tick(timeMS);

      if (this.dlyBanDuration.Expired()) {
        this.banState = 'NOT';
        this.strBanReason = '';
      }
    }
  }

  AckBan() {
    if (this.banState == 'TIME_BANNED_ACK') {
      this.banState = 'TIME_BANNED';
    }
  }

  TempBan(strReason) {
    RequireNewChecks();
    this.strBanReason = strReason;
    this.banState = 'TIME_BANNED_ACK';
    this.dlyBanDuration.Set(this.oNextBanTime);
    this.oNextBanTime *= BAN_MULTIPLIER;
  }

  PermaBan(strReason) {
    RequireNewChecks();
    this.strBanReason = strReason;
    this.banState = 'PERMABANNED';
  }

  Unban() {
    this.strBanReason = '';
    this.banState = 'NOT';
  }

  SetLastNetwork(strIPAddress, bMobile) {
    this.strLastIP = strIPAddress;
    this.bLastTypeMobile = bMobile;
  }

  HourlyTick() {
    this.oNextBanTime -= NEXT_BAN_HOURLY_REDUCTION;
    this.oNextBanTime = Math.max(this.oNextBanTime, BAN_DURATION_INITIAL);
  }

  GetBanDurationRemaining() {
    return this.dlyBanDuration.GetRemaining();
  }

  AddReport(reports) {
    let message = report.strMessage;

    if (
      this.Reports.find((report) => report.strMessage == message) !== undefined
    ) {
      this.Reports.find(
        this.Reports.find((report) => report.strMessage == message)
      ).HappenedAgain();
    } else {
      Reports.push(report);

      //Remove first report if we've breached the limit.
      if (this.Reports.length > 100) {
        this.Reports.splice(0, 1);
      }
    }
    // I don't know the format of the report object
  }

  AcknowledgeReports() {
    // I don't know the format of the report object

    if (this.Reports.length > 0) {
      this.Reports.splice(0, 1);
    }
  }

  AcknowledgeReports(lCount) {
    while (Reports.length > 0 && lCount > 0) {
      Reports.slice(0, 1);
      lCount--;
    }
  }

  HasReports() {
    return this.Reports.length > 0;
  }

  GetUnreadReports() {
    return Reports.length;
  }

  GetNextReport() {
    return Reports[0];
  }

  GetReports() {
    return Reports;
  }

  SetUnderAttack() {
    this.bAttackAlarm = true;
  }

  SetNuclearEscalation() {
    this.bNuclearEscalationAlarm = true;
  }

  SetAllyUnderAttack() {
    this.bAllyAttackAlarm = true;
  }

  ClearAlarms() {
    this.bAttackAlarm = false;
    this.bNuclearEscalationAlarm = false;
    this.bAllyAttackAlarm = false;
  }

  SetPreviousLocation(location) {
    this.locationPrevious = location;
  }

  AccountRestricted() {
    if (this.bApproved) return false;

    if (
      !this.bLastDeviceCheckFailed &&
      !this.bDeviceChecksAPIFailed &&
      !this.bProscribed
    ) {
      return false;
    }

    return true;
  }

  ApproveAccount() {
    this.bApproved = true;
  }

  RequireNewChecks() {
    this.bApproved = false;
    this.oDeviceCheckedDate = 0;
    this.bLastDeviceCheckFailed = false;
    this.bDeviceChecksAPIFailed = false;
    this.bProscribed = false;
    this.lDeviceChecksFailCode = 0;
    this.bProfileMatch = false;
    this.bBasicIntegrity = false;
  }

  DeviceCheckRequired() {
    if (!this.bApproved) {
      return (
        this.oDeviceCheckedDate == 0 ||
        this.bLastDeviceCheckFailed ||
        this.bDeviceChecksAPIFailed
      );
    }

    return false;
  }

  UpdateDeviceChecks(
    bCompleteFailure,
    bAPIFailure,
    lFailureCode,
    bProfileMatch,
    bBasicIntegrity
  ) {
    this.bLastDeviceCheckFailed = bCompleteFailure;
    this.bDeviceChecksAPIFailed = bAPIFailure;
    this.lDeviceChecksFailCode = lFailureCode;
    this.bProfileMatch = bProfileMatch;
    this.bBasicIntegrity = bBasicIntegrity;

    this.oDeviceCheckedDate = new Date().getTime();
  }

  Proscribe() {
    this.bProscribed = true;
  }

  Expire() {
    this.Reports.length = 0;
    this.oExpired = new Date().getTime();
  }

  SetDeviceShortHash(strHash) {
    this.strDeviceShortHash = strHash;
  }

  SetAppListShortHash(strHash) {
    this.strAppListShortHash = strHash;
  }

  GetData() {
    let cIMEI = helperFunctions.getStringData(this.strIMEI);
    let cBanReason = helperFunctions.getStringData(this.strBanReason);
    let cLastIP = helperFunctions.getStringData(this.strLastIP);
    let cDeviceShortHash = helperFunctions.getStringData(
      this.strDeviceShortHash
    );
    let cAppListShortHash = helperFunctions.getStringData(
      this.strAppListShortHash
    );

    const bb = new ByteBuffer(
      cIMEI.length +
        cBanReason.length +
        cLastIP.length +
        cDeviceShortHash.length +
        cAppListShortHash.length +
        51
    );

    bb.append(this.cIMEI);
    bb.writeInt(this.lPlayerID);
    bb.append(banstates.indexOf(this.banState));
    bb.writeLong(this.oNextBanTime);
    bb.writeLong(this.dlyBanDuration.GetRemaining());
    bb.append(this.cBanReason);
    bb.append(this.cLastIP);
    bb.append(this.bLastTypeMobile ? 0xff : 0x00);
    bb.writeLong(this.oDeviceCheckedDate);
    bb.append(this.bLastDeviceCheckFailed ? 0xff : 0x00);
    bb.append(this.bDeviceChecksAPIFailed ? 0xff : 0x00);
    bb.append(this.bProscribed ? 0xff : 0x00);
    bb.writeInt(this.lDeviceChecksFailCode);
    bb.append(this.bProfileMatch ? 0xff : 0x00);
    bb.append(this.bBasicIntegrity ? 0xff : 0x00);
    bb.append(this.bApproved ? 0xff : 0x00);
    bb.writeLong(this.oExpired);
    bb.append(this.cDeviceShortHash);
    bb.append(this.cAppListShortHash);
    bb.append(this.bAttackAlarm ? 0xff : 0x00);
    bb.append(this.bNuclearEscalationAlarm ? 0xff : 0x00);
    bb.append(this.bAllyAttackAlarm ? 0xff : 0x00);

    return bb.buffer;
  }

  DoMultiAccountDetection() {
    if (this.bDoMultiAccountDetection) {
      this.bDoMultiAccountDetection = false;

      //As a hack for now, accounts can be approved in exceptional cases to stop multi account detection checks, e.g. if a user proves it's two identical but separate devices.
      return !bApproved;
    }

    return false;
  }

  GetBanDurationRemaining() {
    return this.dlyBanDuration.GetRemaining();
  }

  AckBan() {
    if (this.banState == 'TIME_BANNED_ACK') this.banState = 'TIME_BANNED';
  }

  ArmMultiAccountDetection() {
    this.bDoMultiAccountDetection = true;
  }
}

module.exports.User = User;
