console.log('Loading config.js');

// Dependencies
const helperFunctions = require('../helperFunctions');
const ByteBuffer = require('bytebuffer');

// Entities
const { LaunchType } = require('../game/schemas/LaunchType');
const { MissileType } = require('../game/schemas/MissileType');
const { InterceptorType } = require('../game/schemas/InterceptorType');

const DATA_SIZE = (RULES_DATA_SIZE = 380 + 9 * 4); //Rules` , ` plus a 32-bit int count for each list.

module.exports.Config = class Config {
  constructor(data) {
    if (!data) return;
    if (Array.isArray(data)) {
      let cData = data;
      let lSize = data.length;

      let bb = new ByteBuffer(lSize).append(cData).reset();

      this.emailAddress = helperFunctions.stringFromData(bb);

      this.cVariant = bb.readByte();
      this.cDebugFlags = bb.readByte();
      this.lStartingWealth = bb.readInt();
      this.lRespawnWealth = bb.readInt();
      this.lRespawnTime = bb.readInt();
      this.lRespawnProtectionTime = bb.readInt();
      this.lHourlyWealth = bb.readInt();
      this.lCMSSystemCost = bb.readInt();
      this.lSAMSystemCost = bb.readInt();
      this.lCMSStructureCost = bb.readInt();
      this.lNukeCMSStructureCost = bb.readInt();
      this.lSAMStructureCost = bb.readInt();
      this.lSentryGunStructureCost = bb.readInt();
      this.lOreMineStructureCost = bb.readInt();
      this.fltInterceptorBaseHitChance = helperFunctions.roundFloat(
        bb.readFloat()
      );
      this.fltRubbleMinValue = helperFunctions.roundFloat(bb.readFloat());
      this.fltRubbleMaxValue = helperFunctions.roundFloat(bb.readFloat());
      this.lRubbleMinTime = bb.readInt();
      this.lRubbleMaxTime = bb.readInt();
      this.fltStructureSeparation = helperFunctions.roundFloat(bb.readFloat());
      this.nPlayerBaseHP = bb.readShort();
      this.nStructureBaseHP = bb.readShort();
      this.lStructureBootTime = bb.readInt();
      this.cInitialMissileSlots = bb.readByte();
      this.cInitialInterceptorSlots = bb.readByte();
      this.fltRequiredAccuracy = helperFunctions.roundFloat(bb.readFloat());
      this.lMinRadiationTime = bb.readInt();
      this.lMaxRadiationTime = bb.readInt();
      this.lMissileUpgradeBaseCost = bb.readInt();
      this.cMissileUpgradeCount = bb.readByte();
      this.fltResaleValue = helperFunctions.roundFloat(bb.readFloat());
      this.lDecommissionTime = bb.readInt();
      this.lReloadTimeBase = bb.readInt();
      this.lReloadTimeStage1 = bb.readInt();
      this.lReloadTimeStage2 = bb.readInt();
      this.lReloadTimeStage3 = bb.readInt();
      this.lReloadStage1Cost = bb.readInt();
      this.lReloadStage2Cost = bb.readInt();
      this.lReloadStage3Cost = bb.readInt();
      this.fltRepairSalvageDistance = helperFunctions.roundFloat(
        bb.readFloat()
      );
      this.lMissileSiteMaintenanceCost = bb.readInt();
      this.lSAMSiteMaintenanceCost = bb.readInt();
      this.lSentryGunMaintenanceCost = bb.readInt();
      this.lOreMineMaintenanceCost = bb.readInt();
      this.lHealthInterval = bb.readInt();
      this.lRadiationInterval = bb.readInt();
      this.lPlayerRepairCost = bb.readInt();
      this.lStructureRepairCost = bb.readInt();
      this.oAWOLTime = bb.readLong();
      this.oRemoveTime = bb.readLong();
      this.lNukeUpgradeCost = bb.readInt();
      this.lAllianceCooloffTime = bb.readInt();
      this.lMissileNuclearCost = bb.readInt();
      this.lMissileTrackingCost = bb.readInt();
      this.lMissileECMCost = bb.readInt();
      this.fltEMPChance = helperFunctions.roundFloat(bb.readFloat());
      this.fltEMPRadiusMultiplier = helperFunctions.roundFloat(bb.readFloat());
      this.fltECMInterceptorChanceReduction = helperFunctions.roundFloat(
        bb.readFloat()
      );
      this.fltManualInterceptorChanceIncrease = helperFunctions.roundFloat(
        bb.readFloat()
      );
      this.lSentryGunReloadTime = bb.readInt();
      this.fltSentryGunRange = helperFunctions.roundFloat(bb.readFloat());
      this.fltSentryGunHitChance = helperFunctions.roundFloat(bb.readFloat());
      this.fltOreMineRadius = helperFunctions.roundFloat(bb.readFloat());
      this.fltOreCollectRadius = helperFunctions.roundFloat(bb.readFloat());
      this.fltOreCompeteRadius = helperFunctions.roundFloat(bb.readFloat());
      this.lMaxOreValue = bb.readInt();
      this.lOreMineGenerateTime = bb.readInt();
      this.lOreMinExpiry = bb.readInt();
      this.lOreMaxExpiry = bb.readInt();
      this.lMissileSpeedIndexCost = bb.readInt();
      this.fltMissileSpeedIndexCostPow = helperFunctions.roundFloat(
        bb.readFloat()
      );
      this.lMissileRangeIndexCost = bb.readInt();
      this.fltMissileRangeIndexCostPow = helperFunctions.roundFloat(
        bb.readFloat()
      );
      this.lMissileBlastRadiusIndexCost = bb.readInt();
      this.fltMissileBlastRadiusIndexCostPow = helperFunctions.roundFloat(
        bb.readFloat()
      );
      this.lNukeBlastRadiusIndexCost = bb.readInt();
      this.fltNukeBlastRadiusIndexCostPow = helperFunctions.roundFloat(
        bb.readFloat()
      );
      this.lMissileMaxDamageIndexCost = bb.readInt();
      this.fltMissileMaxDamageIndexCostPow = helperFunctions.roundFloat(
        bb.readFloat()
      );
      this.lInterceptorSpeedIndexCost = bb.readInt();
      this.fltInterceptorSpeedIndexCostPow = helperFunctions.roundFloat(
        bb.readFloat()
      );
      this.lInterceptorRangeIndexCost = bb.readInt();
      this.fltInterceptorRangeIndexCostPow = helperFunctions.roundFloat(
        bb.readFloat()
      );
      this.fltMissilePrepTimePerMagnitude = helperFunctions.roundFloat(
        bb.readFloat()
      );
      this.fltInterceptorPrepTimePerMagnitude = helperFunctions.roundFloat(
        bb.readFloat()
      );
      this.lHourlyBonusDiplomaticPresence = bb.readInt();
      this.lHourlyBonusPoliticalEngagement = bb.readInt();
      this.lHourlyBonusDefenderOfTheNation = bb.readInt();
      this.lHourlyBonusNuclearSuperpower = bb.readInt();
      this.lHourlyBonusWeeklyKillsBatch = bb.readInt();
      this.lHourlyBonusSurvivor = bb.readInt();
      this.lHourlyBonusHippy = bb.readInt();
      this.lHourlyBonusPeaceMaker = bb.readInt();
      this.lHourlyBonusWarMonger = bb.readInt();
      this.lHourlyBonusLoneWolf = bb.readInt();
      this.fltLoneWolfDistance = helperFunctions.roundFloat(bb.readFloat());

      this.missileSpeeds = AssignFloatPropertyTable(bb);
      this.missileRanges = AssignFloatPropertyTable(bb);
      this.missileBlastRadii = AssignFloatPropertyTable(bb);
      this.nukeBlastRadii = AssignFloatPropertyTable(bb);
      this.missileMaxDamages = AssignShortPropertyTable(bb);
      this.interceptorSpeeds = AssignFloatPropertyTable(bb);
      this.interceptorRanges = AssignFloatPropertyTable(bb);

      this.MissileTypes = AssignMissileTypes(bb);
      this.InterceptorTypes = AssignInterceptorTypes(bb);

      this.lChecksum = helperFunctions.crc32(cData.toString());

      this.fltOreMineDiameter = this.fltOreCompeteRadius;
    }

    if (!Array.isArray(data)) {
      // Loading from JSON

      this.emailAddress = data.emailAddress;

      this.cVariant = data.cVariant;
      this.cDebugFlags = data.cDebugFlags;
      this.tickRate = data.lTickRate;
      this.lStartingWealth = data.lStartingWealth;
      this.lRespawnWealth = data.lRespawnWealth;
      this.lRespawnTime = data.lRespawnTime;
      this.lRespawnProtectionTime = data.lRespawnProtectionTime;
      this.lHourlyWealth = data.lHourlyWealth;
      this.lCMSSystemCost = data.lCMSSystemCost;
      this.lSAMSystemCost = data.lSAMSystemCost;
      this.lCMSStructureCost = data.lCMSStructureCost;
      this.lNukeCMSStructureCost = data.lNukeCMSStructureCost;
      this.lSAMStructureCost = data.lSAMStructureCost;
      this.lSentryGunStructureCost = data.lSentryGunStructureCost;
      this.lOreMineStructureCost = data.lOreMineStructureCost;
      this.fltInterceptorBaseHitChance = data.fltInterceptorBaseHitChance;
      this.fltRubbleMinValue = data.fltRubbleMinValue;
      this.fltRubbleMaxValue = data.fltRubbleMaxValue;
      this.lRubbleMinTime = data.lRubbleMinTime;
      this.lRubbleMaxTime = data.lRubbleMaxTime;
      this.fltStructureSeparation = data.fltStructureSeparation;
      this.nPlayerBaseHP = data.nPlayerBaseHP;
      this.nStructureBaseHP = data.nStructureBaseHP;
      this.lStructureBootTime = data.lStructureBootTime;
      this.cInitialMissileSlots = data.cInitialMissileSlots;
      this.cInitialInterceptorSlots = data.cInitialInterceptorSlots;
      this.fltRequiredAccuracy = data.fltRequiredAccuracy;
      this.lMinRadiationTime = data.lMinRadiationTime;
      this.lMaxRadiationTime = data.lMaxRadiationTime;
      this.lMissileUpgradeBaseCost = data.lMissileUpgradeBaseCost;
      this.cMissileUpgradeCount = data.cMissileUpgradeCount;
      this.fltResaleValue = data.fltResaleValue;
      this.lDecommissionTime = data.lDecommissionTime;
      this.lReloadTimeBase = data.lReloadTimeBase;
      this.lReloadTimeStage1 = data.lReloadTimeStage1;
      this.lReloadTimeStage2 = data.lReloadTimeStage2;
      this.lReloadTimeStage3 = data.lReloadTimeStage3;
      this.lReloadStage1Cost = data.lReloadStage1Cost;
      this.lReloadStage2Cost = data.lReloadStage2Cost;
      this.lReloadStage3Cost = data.lReloadStage3Cost;
      this.fltRepairSalvageDistance = data.fltRepairSalvageDistance;
      this.lMissileSiteMaintenanceCost = data.lMissileSiteMaintenanceCost;
      this.lSAMSiteMaintenanceCost = data.lSAMSiteMaintenanceCost;
      this.lSentryGunMaintenanceCost = data.lSentryGunMaintenanceCost;
      this.lOreMineMaintenanceCost = data.lOreMineMaintenanceCost;
      this.lHealthInterval = data.lHealthInterval;
      this.lRadiationInterval = data.lRadiationInterval;
      this.lPlayerRepairCost = data.lPlayerRepairCost;
      this.lStructureRepairCost = data.lStructureRepairCost;
      this.oAWOLTime = data.oAWOLTime;
      this.oRemoveTime = data.oRemoveTime;
      this.lNukeUpgradeCost = data.lNukeUpgradeCost;
      this.lAllianceCooloffTime = data.lAllianceCooloffTime;
      this.lMissileNuclearCost = data.lMissileNuclearCost;
      this.lMissileTrackingCost = data.lMissileTrackingCost;
      this.lMissileECMCost = data.lMissileECMCost;
      this.fltEMPChance = data.fltEMPChance;
      this.fltEMPRadiusMultiplier = data.fltEMPRadiusMultiplier;
      this.fltECMInterceptorChanceReduction =
        data.fltECMInterceptorChanceReduction;
      this.fltManualInterceptorChanceIncrease =
        data.fltManualInterceptorChanceIncrease;
      this.lSentryGunReloadTime = data.lSentryGunReloadTime;
      this.fltSentryGunRange = data.fltSentryGunRange;
      this.fltSentryGunHitChance = data.fltSentryGunHitChance;
      this.fltOreMineRadius = data.fltOreMineRadius;
      this.fltOreCollectRadius = data.fltOreCollectRadius;
      this.fltOreCompeteRadius = data.fltOreCompeteRadius;
      this.lMaxOreValue = data.lMaxOreValue;
      this.lOreMineGenerateTime = data.lOreMineGenerateTime;
      this.lOreMinExpiry = data.lOreMinExpiry;
      this.lOreMaxExpiry = data.lOreMaxExpiry;
      this.lMissileSpeedIndexCost = data.lMissileSpeedIndexCost;
      this.fltMissileSpeedIndexCostPow = data.fltMissileSpeedIndexCostPow;
      this.lMissileRangeIndexCost = data.lMissileRangeIndexCost;
      this.fltMissileRangeIndexCostPow = data.fltMissileRangeIndexCostPow;
      this.lMissileBlastRadiusIndexCost = data.lMissileBlastRadiusIndexCost;
      this.fltMissileBlastRadiusIndexCostPow =
        data.fltMissileBlastRadiusIndexCostPow;
      this.lNukeBlastRadiusIndexCost = data.lNukeBlastRadiusIndexCost;
      this.fltNukeBlastRadiusIndexCostPow = data.fltNukeBlastRadiusIndexCostPow;
      this.lMissileMaxDamageIndexCost = data.lMissileMaxDamageIndexCost;
      this.fltMissileMaxDamageIndexCostPow =
        data.fltMissileMaxDamageIndexCostPow;
      this.lInterceptorSpeedIndexCost = data.lInterceptorSpeedIndexCost;
      this.fltInterceptorSpeedIndexCostPow =
        data.fltInterceptorSpeedIndexCostPow;
      this.lInterceptorRangeIndexCost = data.lInterceptorRangeIndexCost;
      this.fltInterceptorRangeIndexCostPow =
        data.fltInterceptorRangeIndexCostPow;
      this.fltMissilePrepTimePerMagnitude = data.fltMissilePrepTimePerMagnitude;
      this.fltInterceptorPrepTimePerMagnitude =
        data.fltInterceptorPrepTimePerMagnitude;
      this.lHourlyBonusDiplomaticPresence = data.lHourlyBonusDiplomaticPresence;
      this.lHourlyBonusPoliticalEngagement =
        data.lHourlyBonusPoliticalEngagement;
      this.lHourlyBonusDefenderOfTheNation =
        data.lHourlyBonusDefenderOfTheNation;
      this.lHourlyBonusNuclearSuperpower = data.lHourlyBonusNuclearSuperpower;
      this.lHourlyBonusWeeklyKillsBatch = data.lHourlyBonusWeeklyKillsBatch;
      this.lHourlyBonusSurvivor = data.lHourlyBonusSurvivor;
      this.lHourlyBonusHippy = data.lHourlyBonusHippy;
      this.lHourlyBonusPeaceMaker = data.lHourlyBonusPeaceMaker;
      this.lHourlyBonusWarMonger = data.lHourlyBonusWarMonger;
      this.lHourlyBonusLoneWolf = data.lHourlyBonusLoneWolf;
      this.fltLoneWolfDistance = data.fltLoneWolfDistance;

      this.port = data.port;

      this.missileSpeeds = data.missileSpeeds;
      this.missileRanges = data.missileRanges;
      this.missileBlastRadii = data.missileBlastRadii;
      this.nukeBlastRadii = data.nukeBlastRadii;
      this.missileMaxDamages = data.missileMaxDamages;
      this.interceptorSpeeds = data.interceptorSpeeds;
      this.interceptorRanges = data.interceptorRanges;

      this.MissileTypes = data.MissileTypes.map((missileData, idx) => {
        return new MissileType({
          cID: missileData.ID,
          bPurchasable: missileData.Purchasable,
          strName: missileData.Name,
          lAssetID: missileData.AssetID,
          bNuclear: missileData.Nuclear,
          bTracking: missileData.Tracking,
          bECM: missileData.ECM,
          cSpeedIndex: missileData.SpeedIndex,
          cMissileCost: missileData.MissileCost,
          cRangeIndex: missileData.RangeIndex,
          cBlastRadiusIndex: missileData.BlastRadiusIndex,
          cMaxDamageIndex: missileData.MaxDamageIndex,
        });
      });

      this.InterceptorTypes = data.InterceptorTypes.map((missileData, idx) => {
        // console.log({ InterceptorData: missileData });
        return new InterceptorType({
          cID: missileData.ID,
          bPurchasable: missileData.Purchasable,
          strName: missileData.Name,
          lAssetID: missileData.AssetID,
          cInterceptorCost: missileData.InterceptorCost,
          fltHitChance: missileData.HitChance,
          cSpeedIndex: missileData.SpeedIndex,
          cRangeIndex: missileData.RangeIndex,
        });
      });
      // console.log({ MissileTypes: this.MissileTypes });

      // this.InterceptorTypes = data.InterceptorTypes;

      this.lChecksum = 54345; // dummy value for the time being

      this.fltOreMineDiameter = this.fltOreCompeteRadius;

      // May need more data to instantiate this way, unsure.
    }
  }

  GetData() {
    console.log('Generating bytebuffer from Config object');

    // Compute data size
    let lSize =
      RULES_DATA_SIZE + helperFunctions.getStringDataSize(this.emailAddress);

    lSize += this.missileSpeeds.length * 5;
    lSize += this.missileRanges.length * 5;
    lSize += this.missileBlastRadii.length * 5;
    lSize += this.nukeBlastRadii.length * 5;
    lSize += this.missileMaxDamages.length * 5;
    lSize += this.interceptorSpeeds.length * 5;
    lSize += this.interceptorRanges.length * 5;

    this.MissileTypes.forEach((missile, idx) => {
      lSize += missile.GetData().buffer.length * 5;
    });

    this.InterceptorTypes.forEach((interceptor, idx) => {
      lSize += interceptor.GetData().buffer.length * 5;
    });

    const bb = new ByteBuffer(lSize);

    bb.append(helperFunctions.getStringData(this.emailAddress));

    bb.writeByte(this.cVariant);
    bb.writeByte(this.cDebugFlags);
    // bb.writeInt(this.tickRate); // Not currently communicable. Disregard.
    bb.writeInt(this.lStartingWealth);
    bb.writeInt(this.lRespawnWealth);
    bb.writeInt(this.lRespawnTime);
    bb.writeInt(this.lRespawnProtectionTime);
    bb.writeInt(this.lHourlyWealth);
    bb.writeInt(this.lCMSSystemCost);
    bb.writeInt(this.lSAMSystemCost);
    bb.writeInt(this.lCMSStructureCost);
    bb.writeInt(this.lNukeCMSStructureCost);
    bb.writeInt(this.lSAMStructureCost);
    bb.writeInt(this.lSentryGunStructureCost);
    bb.writeInt(this.lOreMineStructureCost);
    bb.writeFloat(this.fltInterceptorBaseHitChance);
    bb.writeFloat(this.fltRubbleMinValue);
    bb.writeFloat(this.fltRubbleMaxValue);
    bb.writeInt(this.lRubbleMinTime);
    bb.writeInt(this.lRubbleMaxTime);
    bb.writeFloat(this.fltStructureSeparation);
    bb.writeShort(this.nPlayerBaseHP);
    bb.writeShort(this.nStructureBaseHP);
    bb.writeInt(this.lStructureBootTime);
    bb.writeByte(this.cInitialMissileSlots);
    bb.writeByte(this.cInitialInterceptorSlots);
    bb.writeFloat(this.fltRequiredAccuracy);
    bb.writeInt(this.lMinRadiationTime);
    bb.writeInt(this.lMaxRadiationTime);
    bb.writeInt(this.lMissileUpgradeBaseCost);
    bb.writeByte(this.cMissileUpgradeCount);
    bb.writeFloat(this.fltResaleValue);
    bb.writeInt(this.lDecommissionTime);
    bb.writeInt(this.lReloadTimeBase);
    bb.writeInt(this.lReloadTimeStage1);
    bb.writeInt(this.lReloadTimeStage2);
    bb.writeInt(this.lReloadTimeStage3);
    bb.writeInt(this.lReloadStage1Cost);
    bb.writeInt(this.lReloadStage2Cost);
    bb.writeInt(this.lReloadStage3Cost);
    bb.writeFloat(this.fltRepairSalvageDistance);
    bb.writeInt(this.lMissileSiteMaintenanceCost);
    bb.writeInt(this.lSAMSiteMaintenanceCost);
    bb.writeInt(this.lSentryGunMaintenanceCost);
    bb.writeInt(this.lOreMineMaintenanceCost);
    bb.writeInt(this.lHealthInterval);
    bb.writeInt(this.lRadiationInterval);
    bb.writeInt(this.lPlayerRepairCost);
    bb.writeInt(this.lStructureRepairCost);
    bb.writeLong(this.oAWOLTime);
    bb.writeLong(this.oRemoveTime);
    bb.writeInt(this.lNukeUpgradeCost);
    bb.writeInt(this.lAllianceCooloffTime);
    bb.writeInt(this.lMissileNuclearCost);
    bb.writeInt(this.lMissileTrackingCost);
    bb.writeInt(this.lMissileECMCost);
    bb.writeFloat(this.fltEMPChance);
    bb.writeFloat(this.fltEMPRadiusMultiplier);
    bb.writeFloat(this.fltECMInterceptorChanceReduction);
    bb.writeFloat(this.fltManualInterceptorChanceIncrease);
    bb.writeInt(this.lSentryGunReloadTime);
    bb.writeFloat(this.fltSentryGunRange);
    bb.writeFloat(this.fltSentryGunHitChance);
    bb.writeFloat(this.fltOreMineRadius);
    bb.writeFloat(this.fltOreCollectRadius);
    bb.writeFloat(this.fltOreCompeteRadius);
    bb.writeInt(this.lMaxOreValue);
    bb.writeInt(this.lOreMineGenerateTime);
    bb.writeInt(this.lOreMinExpiry);
    bb.writeInt(this.lOreMaxExpiry);
    bb.writeInt(this.lMissileSpeedIndexCost);
    bb.writeFloat(this.fltMissileSpeedIndexCostPow);
    bb.writeInt(this.lMissileRangeIndexCost);
    bb.writeFloat(this.fltMissileRangeIndexCostPow);
    bb.writeInt(this.lMissileBlastRadiusIndexCost);
    bb.writeFloat(this.fltMissileBlastRadiusIndexCostPow);
    bb.writeInt(this.lNukeBlastRadiusIndexCost);
    bb.writeFloat(this.fltNukeBlastRadiusIndexCostPow);
    bb.writeInt(this.lMissileMaxDamageIndexCost);
    bb.writeFloat(this.fltMissileMaxDamageIndexCostPow);
    bb.writeInt(this.lInterceptorSpeedIndexCost);
    bb.writeFloat(this.fltInterceptorSpeedIndexCostPow);
    bb.writeInt(this.lInterceptorRangeIndexCost);
    bb.writeFloat(this.fltInterceptorRangeIndexCostPow);
    bb.writeFloat(this.fltMissilePrepTimePerMagnitude);
    bb.writeFloat(this.fltInterceptorPrepTimePerMagnitude);
    bb.writeInt(this.lHourlyBonusDiplomaticPresence);
    bb.writeInt(this.lHourlyBonusPoliticalEngagement);
    bb.writeInt(this.lHourlyBonusDefenderOfTheNation);
    bb.writeInt(this.lHourlyBonusNuclearSuperpower);
    bb.writeInt(this.lHourlyBonusWeeklyKillsBatch);
    bb.writeInt(this.lHourlyBonusSurvivor);
    bb.writeInt(this.lHourlyBonusHippy);
    bb.writeInt(this.lHourlyBonusPeaceMaker);
    bb.writeInt(this.lHourlyBonusWarMonger);
    bb.writeInt(this.lHourlyBonusLoneWolf);
    bb.writeFloat(this.fltLoneWolfDistance);

    PutFloatPropertyTable(bb, this.missileSpeeds);
    PutFloatPropertyTable(bb, this.missileRanges);
    PutFloatPropertyTable(bb, this.missileBlastRadii);
    PutFloatPropertyTable(bb, this.nukeBlastRadii);
    PutShortPropertyTable(bb, this.missileMaxDamages);
    PutFloatPropertyTable(bb, this.interceptorSpeeds);
    PutFloatPropertyTable(bb, this.interceptorRanges);

    bb.writeInt(this.MissileTypes.length);
    this.MissileTypes.forEach((missile, idx) => {
      bb.append(missile.GetData());
    });

    bb.writeInt(this.InterceptorTypes.length);
    this.InterceptorTypes.forEach((interceptor, idx) => {
      bb.append(interceptor.GetData());
    });

    let cData = bb.buffer;

    return cData;
  }
};

const PutFloatPropertyTable = (bb, array) => {
  let tableLength = array.length;

  bb.writeInt(tableLength);

  array.forEach((property, idx) => {
    let objArray = Object.keys(property);

    // This should work?
    bb.writeByte(property[objArray[0]]);
    bb.writeFloat(property[objArray[1]]);
  });
};

const PutShortPropertyTable = (bb, array) => {
  bb.writeInt(array.length);

  array.forEach((property, idx) => {
    let objArray = Object.keys(property);

    // This should work?
    bb.writeByte(property[objArray[0]]);
    bb.writeShort(property[objArray[1]]);
  });
};

const AssignFloatPropertyTable = (bb) => {
  var lCount = bb.readInt();

  var internalTable = {};

  for (let i = 0; i < lCount; i++) {
    internalTable[bb.readByte()] = helperFunctions.roundFloat(bb.readFloat());
  }
  return internalTable;
};

const AssignShortPropertyTable = (bb) => {
  var lCount = bb.readInt();

  var internalTable = {};

  for (let i = 0; i < lCount; i++) {
    internalTable[bb.readByte()] = bb.readShort();
  }
  return internalTable;
};

const AssignMissileTypes = (bb) => {
  var lMissileTypes = bb.readInt();

  var internalTable = {};

  for (let i = 0; i < lMissileTypes; i++) {
    let missileType = new MissileType(bb); // Create new missile object
    internalTable[missileType.getID()] = missileType;
  }
  return internalTable;
};

const AssignInterceptorTypes = (bb) => {
  var lInterceptorTypes = bb.readInt();

  var internalTable = {};

  for (let i = 0; i < lInterceptorTypes; i++) {
    let interceptorType = new InterceptorType(bb); // Create new missile object
    internalTable[interceptorType.getID()] = interceptorType;
  }
  return internalTable;
};
