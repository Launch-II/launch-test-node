const { Damageable } = require('./Damageable');
const { GeoCoord } = require('../GeoCoord');
const { TimeDelay } = require('../../comm/utilities/TimeDelay');
const { MissileSystem } = require('../systems/MissileSystem');
const ByteBuffer = require('bytebuffer');

const helperFunctions = require('../../helperFunctions');
// const gameSimulation = require('../../../LaunchServer/server/gameSimulation');

const DATA_SIZE = 30;
const STATS_DATA_SIZE = 20;

const FLAG1_BANNED = 0x01; //Banned. NOTE: NOT SAVED (well, it is, but the server ignores it), but determined at run time when getting player data.
const FLAG1_RES2 = 0x02; //Unused.
const FLAG1_RES3 = 0x04; //Unused.
const FLAG1_HAS_CMS = 0x08; //Player possesses a cruise missile system.
const FLAG1_HAS_SAM = 0x10; //Player possesses a missile defense system.
const FLAG1_MP = 0x20; //The player is a leader in an alliance.
const FLAG1_AWOL = 0x40; //The player is AWOL. NOTE: AWOL can only happen to dead players, to stop them being considered for scoring.
const FLAG1_RSPAWN_PROT = 0x80; //The player is subject to respawn protection.

const FLAG2_ALLIANCE_REQ_JOIN = 0x01; //Player is only requesting to join an alliance, and isn't actually in one yet.
const FLAG2_ADMIN = 0x02; //Player is an administrator.
const FLAG2_RES2 = 0x04; //Unused.
const FLAG2_RES3 = 0x08; //Unused.
const FLAG2_RES4 = 0x10; //Unused.
const FLAG2_RES5 = 0x20; //Unused.
const FLAG2_RES6 = 0x40; //Unused.
const FLAG2_RES7 = 0x80; //Unused.

class Player extends Damageable {
  constructor(data, rID) {
    if (!data) return;

    // From data
    if (data.geoPosition) {
      super(data);
      this.user = null;

      if (this.lAllianceID == -1) {
        this.SetIsAnMP(false);
      }
      return;
    }
    // From bytebuffer
    if (data.buffer) {
      super(data);
      this.user = null;

      this.strName = helperFunctions.stringFromData(data);
      this.lAvatarID = data.readInt();
      this.lWealth = data.readInt();
      this.oLastSeen = data.readLong();
      this.dlyStateChange = new TimeDelay(data);
      this.lAllianceID = data.readInt();
      this.cFlags1 = data.readByte();
      this.cFlags2 = data.readByte();
      this.dlyAllianceCooloff = new TimeDelay(data);

      this.bBanned = (this.cFlags1 && FLAG1_BANNED) !== 0x00;
      this.bHasCMS = (this.cFlags1 && FLAG1_HAS_CMS) !== 0x00;
      this.bHasSAM = (this.cFlags1 && FLAG1_HAS_SAM) !== 0x00;
      this.bLeader = (this.cFlags1 && FLAG1_MP) !== 0x00;
      this.bAWOL = (this.cFlags1 && FLAG1_AWOL) !== 0x00;
      this.bRespawnProtected = (this.cFlags1 && FLAG1_RSPAWN_PROT) !== 0x00;
      this.bRequestingAllianceJoin =
        (this.cFlags2 && FLAG2_ALLIANCE_REQ_JOIN) !== 0x00;
      this.bAdmin = (this.cFlags2 && FLAG2_ADMIN) !== 0x00;

      if (rID == super.lID) {
        if (this.bHasCMS) {
          this.missiles = new MissileSystem(this, data);
        }
        if (this.bHasSAM) {
          this.interceptors = new MissileSystem(this, data);
        }
      } else {
        if (this.bHasCMS) {
          this.missiles = new MissileSystem();
        }
        if (this.bHasSAM) {
          this.interceptors = new MissileSystem();
        }
      }

      if (data.remaining !== 0) {
        this.nKills = data.readShort();
        this.nDeaths = data.readShort();
        this.lOffenseSpending = data.readInt();
        this.lDefenseSpending = data.readInt();
        this.lDamageInflicted = data.readInt();
        this.lDamageReceived = data.readInt();
        this.bHasFullStats = true;
      } else {
        this.bHasFullStats = false;
      }

      return;
    }
    // New Player
    super({
      lID: data.lID,
      geoPosition: new GeoCoord(),
      nHP: 0,
      nMaxHP: data.startingHP,
    });
    this.user = null;

    this.strName = data.strName;
    this.lAvatarID = data.lAvatarID;
    this.lWealth = data.lStartingWealth;
    this.dlyStateChange = new TimeDelay();
    this.lAllianceID = -1;
    this.dlyAllianceCooloff = new TimeDelay();
    this.bHasCMS = false;
    this.bHasSAM = false;
    this.bLeader = false;
    this.bAWOL = false;
    this.bRespawnProtected = true;
    this.bRequestingAllianceJoin = false;
    this.bAdmin = false;

    this.nKills = 0;
    this.nDeaths = 0;
    this.lOffenseSpending = 0;
    this.lDefenseSpending = 0;
    this.lDamageInflicted = 0;
    this.lDamageReceived = 0;

    this.SetLastSeen();
    return;
  }

  SetIsAnMP(bIsAnMP) {
    this.bLeader = bIsAnMP;
    this.Changed(false);
  }

  SetUser(user) {
    this.user = user;
  }

  GetUser() {
    return this.user;
  }

  AddMissileSystem(timeOrSys, missileSlotCount) {
    if (missileSlotCount) {
      this.missiles = new MissileSystem(this, timeOrSys, missileSlotCount);
    } else {
      this.missiles = timeOrSys;
    }
    SetHasCruiseMissileSystem(true);
  }

  AddInterceptorSystem(timeOrSys, missileSlotCount) {
    if (missileSlotCount) {
      this.interceptors = new MissileSystem(this, timeOrSys, missileSlotCount);
    } else {
      this.interceptors = timeOrSys;
    }
    SetHasAirDefenseSystem(true);
  }

  RemoveMissileSystem(saleValue) {
    this.lWealth += saleValue;
    SetHasCruiseMissileSystem(false);
    this.interceptors = null;
  }

  Tick(timeMS) {
    this.dlyStateChange.Tick(timeMS);
    this.dlyAllianceCooloff.Tick(timeMS);

    if (this.bHasCMS) {
      this.missiles.Tick(thisMS);
    }
    if (this.bHasSAM) {
      this.interceptors.Tick(thisMS);
    }
  }

  GetData(lAskingID) {
    let cBaseData = super.GetData(lAskingID);

    let thisAsking = lAskingID == this.lID;
    let cMissileSystemData =
      thisAsking && this.bHasCMS ? this.missiles.GetData() : 0x00;
    let cInterceptorSystemData =
      thisAsking && this.bHasSAM ? this.interceptors.GetData() : 0x00;

    const bb = new ByteBuffer(
      cBaseData.length +
        DATA_SIZE +
        helperFunctions.getStringDataSize(this.strName) +
        cMissileSystemData.length +
        cInterceptorSystemData.length
    );

    bb.append(cBaseData);
    bb.append(helperFunctions.getStringData(this.strName));
    bb.writeInt(this.lAvatarID);
    bb.writeInt(this.lWealth);
    bb.writeLong(this.oLastSeen);
    this.dlyStateChange.GetData(bb);
    bb.writeInt(this.lAllianceID);
    bb.writeByte(this.GetFlags1());
    bb.writeByte(this.GetFlags2());
    this.dlyAllianceCooloff.GetData(bb);
    if (thisAsking) {
      if (this.bHasCMS) {
        bb.append(this.cMissileSystemData);
      } else {
        bb.writeByte(0x00);
      }
      if (this.bHasSAM) {
        bb.append(this.cInterceptorSystemData);
      } else {
        bb.writeByte(0x00);
      }
    } else {
      bb.writeByte(0x00);
    }

    return bb.buffer;
  }

  GetFullStatsData(lAskingID) {
    let cStandardData = GetData(lAskingID);

    const bb = new ByteBuffer(cStandardData.length + STATS_DATA_SIZE);

    bb.append(this.cStandardData);
    bb.writeShort(this.nKills);
    bb.writeShort(this.nDeaths);
    bb.writeInt(this.lOffenseSpending);
    bb.writeInt(lDefenseSpending);
    bb.writeInt(lDamageInflicted);
    bb.writeInt(lDamageReceived);

    return bb.buffer;
  }

  SetAvatarID(lAvatarID) {
    this.lAvatarID = lAvatarID;
    this.Changed(false);
  }

  GetAllianceMemberID() {
    if (GetRequestingToJoinAlliance()) return -1;

    return this.lAllianceID;
  }

  GetAllianceJoiningID() {
    //Return the ID of the alliance the player is requesting to join. If they're already in one, the answer is "no alliance".
    if (GetRequestingToJoinAlliance()) return -1;

    return this.lAllianceID;
  }

  SetAllianceID(lAllianceID) {
    this.lAllianceID = lAllianceID;
    SetRequestingToJoinAlliance(false);
    this.Changed(false);
  }

  SetAllianceRequestToJoin(lAllianceID) {
    this.lAllianceID = lAllianceID;
    SetRequestingToJoinAlliance(true);
    this.Changed(false);
  }

  RejectAllianceRequestToJoin() {
    lAllianceID = -1;
    SetRequestingToJoinAlliance(false);
    this.Changed(false);
  }

  SetAllianceCooloffTime(lAllianceCooloff) {
    this.dlyAllianceCooloff.Set(lAllianceCooloff);
  }

  GetAllianceCooloffExpired() {
    return this.dlyAllianceCooloff.Expired();
  }

  GetAllianceCooloffRemaining() {
    return this.dlyAllianceCooloff.GetRemaining();
  }

  GetStateTimeRemaining() {
    return this.dlyStateChange.GetRemaining();
  }

  GetStateTimeExpired() {
    return this.dlyStateChange.Expired();
  }

  GetFlags1() {
    this.bBanned = this.GetBanned_Server();

    let cFlags1 = 0x00;

    cFlags1 |= this.bBanned ? FLAG1_BANNED : 0x00;
    cFlags1 |= this.bHasCMS ? FLAG1_HAS_CMS : 0x00;
    cFlags1 |= this.bHasSAM ? FLAG1_HAS_SAM : 0x00;
    cFlags1 |= this.bLeader ? FLAG1_MP : 0x00;
    cFlags1 |= this.bAWOL ? FLAG1_AWOL : 0x00;
    cFlags1 |= this.bRespawnProtected ? FLAG1_RSPAWN_PROT : 0x00;

    return cFlags1;
  }

  GetFlags2() {
    let cFlags2 = 0x00;

    cFlags2 |= this.bRequestingAllianceJoin ? FLAG2_ALLIANCE_REQ_JOIN : 0x00;
    cFlags2 |= this.bAdmin ? FLAG2_ADMIN : 0x00;

    return cFlags2;
  }

  GetCanRespawn() {
    return this.Destroyed() && this.dlyStateChange.Expired();
  }

  SetDead(respawnTime) {
    this.SetHP(0);

    this.nDeaths++;

    this.dlyStateChange(respawnTime);

    SetHasAirDefenseSystem(false);
    SetHasCruiseMissileSystem(false);

    this.missiles = null;
    this.interceptors = null;

    this.Changed(false);
  }

  SetLastSeen() {
    this.oLastSeen = new Date().getTime();
  }

  SetAWOL(bAWOL) {
    this.bAWOL = bAWOL;
    this.Changed(false);
  }

  SetRespawnProtected(bProtected) {
    this.bRespawnProtected = bProtected;
    this.Changed(false);
  }

  SetRequestingToJoinAlliance(bRequestingToJoin) {
    this.bRequestingAllianceJoin = bRequestingToJoin;
    this.Changed(false);
  }

  Respawn(nHP, lRespawnProtectionTime) {
    SetHP(nHP);
    dlyStateChange.Set(lRespawnProtectionTime);
    SetRespawnProtected(true);
    this.Changed(false);
  }

  SetCompassionateInvulnerability(lProtectionTime) {
    dlyStateChange.Set(lProtectionTime);
    SetRespawnProtected(true);
    this.Changed(false);
  }

  Park(oParkTime) {
    oLastSeen += oParkTime;
    this.Changed(false);
  }

  SetHasCruiseMissileSystem(bHasCMS) {
    this.bHasCMS = bHasCMS;
    this.Changed(true);
  }

  SetHasAirDefenseSystem(bHasSAM) {
    this.bHasSAM = bHasSAM;
    this.Changed(true);
  }

  SetIsAnMP(bIsAnMP) {
    this.bLeader = bIsAnMP;
    this.Changed(false);
  }

  SubtractWealth(lWealth) {
    if (this.lWealth >= lWealth) {
      this.lWealth -= lWealth;
      this.Changed(false);
      return true;
    }

    return false;
  }

  AddWealth(lWealth) {
    this.lWealth += lWealth;
    this.Changed(false);
  }

  SetWealth(lWealth) {
    this.lWealth = lWealth;
    this.Changed(false);
  }

  Functioning() {
    //Can be hit or detected. Immediately influential on the game.
    return !Destroyed() && !GetAWOL();
  }
  SystemChanged(system) {
    //One of our systems changed, therefore we changed.
    this.Changed(true);
  }

  GetIsAnAdmin() {
    return bAdmin;
  }

  SetIsAnAdmin(bIsAdmin) {
    this.bAdmin = bIsAdmin;
    this.Changed(false);
  }

  ChangeName(strNewName) {
    strName = strNewName;
    this.Changed(false);
  }

  IncrementKills() {
    this.nKills++;
  }

  AddOffenseSpending(lAmount) {
    this.lOffenseSpending += lAmount;
  }

  AddDefenseSpending(lAmount) {
    this.lDefenseSpending += lAmount;
  }

  AddDamageInflicted(nDamage) {
    this.lDamageInflicted += nDamage;
  }

  AddDamageReceived(nDamage) {
    this.lDamageReceived += nDamage;
  }

  ResetStats() {
    this.nKills = 0;
    this.nDeaths = 0;
    this.lOffenseSpending = 0;
    this.lDefenseSpending = 0;
    this.lDamageInflicted = 0;
    this.lDamageReceived = 0;
  }

  GetOwnedBy(lID) {
    return lID == this.lID;
  }

  ApparentlyEquals(entity) {
    if (entity instanceof Player) return entity.GetID() == this.lID;
    return false;
  }

  GetBanned_Server() {
    if (this.user !== null) return this.user.banState !== 'NOT';

    //Fail deadly.
    return true;
  }

  StatsCopy(statsCopy) {
    this.nKills = statsCopy.nKills;
    this.nDeaths = statsCopy.nDeaths;
    this.lDamageInflicted = statsCopy.lDamageInflicted;
    this.lOffenseSpending = statsCopy.lOffenseSpending;
    this.lDamageReceived = statsCopy.lDamageReceived;
    this.lDefenseSpending = statsCopy.lDefenseSpending;
  }
}

module.exports.Player = Player;
