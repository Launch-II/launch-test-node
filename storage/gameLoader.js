// Dependencies
const fs = require('fs');

// Imports
const gameConfig = require('../config.json');
const game = require('../game.json');

const { Config } = require('./../LaunchGame/game/Config');
const { User } = require('./../LaunchGame/game/User');

const helperFunctions = require('../LaunchGame/helperFunctions');
const gameSimulation = require('../gameSimulation');

const fileHandler = require('./fileHandler');

module.exports.loadConfig = () => {
  let parsedConfig = helperFunctions.parsedJsonStringsToInt({
    emailAddress: gameConfig.ServerEmail,
    cVariant: 0,
    cDebugFlags: gameConfig.DebugFlags,
    lTickRate: gameConfig.TickRate,
    lStartingWealth: gameConfig.StartingWealth,
    lRespawnWealth: gameConfig.RespawnWealth,
    lRespawnTime: gameConfig.RespawnTime,
    lRespawnProtectionTime: gameConfig.RespawnProtectionTime,
    lHourlyWealth: gameConfig.HourlyWealth,
    lCMSSystemCost: gameConfig.CMSSystemCost,
    lSAMSystemCost: gameConfig.SAMSystemCost,
    lCMSStructureCost: gameConfig.CMSStructureCost,
    lNukeCMSStructureCost: gameConfig.NCMSStructureCost,
    lSAMStructureCost: gameConfig.SAMStructureCost,
    lSentryGunStructureCost: gameConfig.SentryGunStructureCost,
    lOreMineStructureCost: gameConfig.OreMineStructureCost,
    fltInterceptorBaseHitChance: gameConfig.InterceptorBaseHitChance,
    fltRubbleMinValue: gameConfig.RubbleMinValue,
    fltRubbleMaxValue: gameConfig.RubbleMaxValue,
    lRubbleMinTime: gameConfig.RubbleMinTime,
    lRubbleMaxTime: gameConfig.RubbleMaxTime,
    fltStructureSeparation: gameConfig.StructureSeparation,
    nPlayerBaseHP: gameConfig.PlayerBaseHP,
    nStructureBaseHP: gameConfig.StructureBaseHP,
    lStructureBootTime: gameConfig.StructureBootTime,
    cInitialMissileSlots: gameConfig.InitialCMSSlots,
    cInitialInterceptorSlots: gameConfig.InitialSAMSlots,
    fltRequiredAccuracy: gameConfig.RequiredAccuracy,
    lMinRadiationTime: gameConfig.MinRadiationTime,
    lMaxRadiationTime: gameConfig.MaxRadiationTime,
    lMissileUpgradeBaseCost: gameConfig.MissileSlotUpgradeBaseCost,
    cMissileUpgradeCount: gameConfig.MissileSlotUpgradeCount,
    fltResaleValue: gameConfig.ResaleValue,
    lDecommissionTime: gameConfig.DecommissionTime,
    lReloadTimeBase: gameConfig.ReloadTimeBase,
    lReloadTimeStage1: gameConfig.ReloadTimeStage1,
    lReloadTimeStage2: gameConfig.ReloadTimeStage2,
    lReloadTimeStage3: gameConfig.ReloadTimeStage3,
    lReloadStage1Cost: gameConfig.ReloadStage1Cost,
    lReloadStage2Cost: gameConfig.ReloadStage2Cost,
    lReloadStage3Cost: gameConfig.ReloadStage3Cost,
    fltRepairSalvageDistance: gameConfig.RepairSalvageDistance,
    lMissileSiteMaintenanceCost: gameConfig.MissileSiteMaintenanceCost,
    lSAMSiteMaintenanceCost: gameConfig.SAMSiteMaintenanceCost,
    lSentryGunMaintenanceCost: gameConfig.SentryGunMaintenanceCost,
    lOreMineMaintenanceCost: gameConfig.OreMineMaintenanceCost,
    lHealthInterval: gameConfig.HealthInterval,
    lRadiationInterval: gameConfig.RadiationInterval,
    lPlayerRepairCost: gameConfig.PlayerRepairCost,
    lStructureRepairCost: gameConfig.StructureRepairCost,
    oAWOLTime: gameConfig.AWOLTime,
    oRemoveTime: gameConfig.RemoveTime,
    lNukeUpgradeCost: gameConfig.NukeUpgradeCost,
    lAllianceCooloffTime: gameConfig.AllianceCooloffTime,
    lMissileNuclearCost: gameConfig.MissileNuclearCost,
    lMissileTrackingCost: gameConfig.MissileTrackingCost,
    lMissileECMCost: gameConfig.MissileECMCost,
    fltEMPChance: gameConfig.EMPChance,
    fltEMPRadiusMultiplier: gameConfig.EMPRadiusMultiplier,
    fltECMInterceptorChanceReduction: gameConfig.ECMInterceptorChanceReduction,
    fltManualInterceptorChanceIncrease:
      gameConfig.ManualInterceptorChanceIncrease,
    lSentryGunReloadTime: gameConfig.SentryGunReloadTime,
    fltSentryGunRange: gameConfig.SentryGunRange,
    fltSentryGunHitChance: gameConfig.SentryGunHitChance,
    fltOreMineRadius: gameConfig.OreMineRadius,
    fltOreCompeteRadius: gameConfig.OreCompeteRadius,
    fltOreCollectRadius: gameConfig.OreCollectRadius,
    lMaxOreValue: gameConfig.MaxOreValue,
    lOreMineGenerateTime: gameConfig.OreMineGenerateTime,
    lOreMinExpiry: gameConfig.OreMinExpiry,
    lOreMaxExpiry: gameConfig.OreMaxExpiry,
    lMissileSpeedIndexCost: gameConfig.MissileSpeedIndexCost,
    fltMissileSpeedIndexCostPow: gameConfig.MissileBlastRadiusIndexCostPow,
    lMissileRangeIndexCost: gameConfig.MissileRangeIndexCost,
    fltMissileRangeIndexCostPow: gameConfig.MissileRangeIndexCostPow,
    lMissileBlastRadiusIndexCost: gameConfig.MissileBlastRadiusIndexCost,
    fltMissileBlastRadiusIndexCostPow:
      gameConfig.MissileBlastRadiusIndexCostPow,
    lNukeBlastRadiusIndexCost: gameConfig.NukeBlastRadiusIndexCost,
    fltNukeBlastRadiusIndexCostPow: gameConfig.NukeBlastRadiusIndexCostPow,
    lMissileMaxDamageIndexCost: gameConfig.MissileMaxDamageIndexCost,
    fltMissileMaxDamageIndexCostPow: gameConfig.MissileMaxDamageIndexCostPow,
    lInterceptorSpeedIndexCost: gameConfig.InterceptorSpeedIndexCost,
    fltInterceptorSpeedIndexCostPow: gameConfig.InterceptorSpeedIndexCostPow,
    lInterceptorRangeIndexCost: gameConfig.InterceptorRangeIndexCost,
    fltInterceptorRangeIndexCostPow: gameConfig.InterceptorRangeIndexCostPow,
    fltMissilePrepTimePerMagnitude: gameConfig.MissilePrepTimePerMagnitude,
    fltInterceptorPrepTimePerMagnitude:
      gameConfig.InterceptorPrepTimePerMagnitude,
    lHourlyBonusDiplomaticPresence: gameConfig.HourlyBonusDiplomaticPresence,
    lHourlyBonusPoliticalEngagement: gameConfig.HourlyBonusPoliticalEngagement,
    lHourlyBonusDefenderOfTheNation: gameConfig.HourlyBonusDefenderOfTheNation,
    lHourlyBonusNuclearSuperpower: gameConfig.HourlyBonusNuclearSuperpower,
    lHourlyBonusWeeklyKillsBatch: gameConfig.HourlyBonusWeeklyKillsBatch,
    lHourlyBonusSurvivor: gameConfig.HourlyBonusSurvivor,
    lHourlyBonusHippy: gameConfig.HourlyBonusHippy,
    lHourlyBonusPeaceMaker: gameConfig.HourlyBonusPeaceMaker,
    lHourlyBonusWarMonger: gameConfig.HourlyBonusWarMonger,
    lHourlyBonusLoneWolf: gameConfig.HourlyBonusLoneWolf,
    fltLoneWolfDistance: gameConfig.LoneWolfDistance,
    port: gameConfig.Port,
    missileSpeeds: gameConfig.MissileSpeeds,
    missileRanges: gameConfig.MissileRanges,
    missileBlastRadii: gameConfig.MissileBlastRadii,
    nukeBlastRadii: gameConfig.NukeBlastRadii,
    missileMaxDamages: gameConfig.MissileMaxDamages,
    interceptorSpeeds: gameConfig.InterceptorSpeeds,
    interceptorRanges: gameConfig.InterceptorRanges,
    MissileTypes: gameConfig.MissileTypes,
    InterceptorTypes: gameConfig.InterceptorTypes,
  });
  return new Config(parsedConfig);
};

module.exports.loadGame = () => {
  // let parsedGameSave = helperFunctions.parsedJsonStringsToInt(game);
  let users = fileHandler.loadStorageFile('users');
  // console.log(users);

  for (const [key, data] of Object.entries(users)) {
    let user = new User({
      UID: data.UID,
      lPlayerID: data.playerId,
      cBanState: parseInt(data.banState) == 0 ? 'NOT' : data.banState,
      oNextBanTime: parseInt(data.NextBanTime),
      oBanDurationRemaining: parseInt(data.BanDurationRemaining),
      strBanReason: data.BanReason,
      strLastIP: data.LastIP,
      bLastTypeMobile: data.LastConnectionMobile,
      oDeviceCheckedDate: data.LastChecked,
      bLastDeviceCheckFailed: data.LastCheckFailed,
      bDeviceChecksAPIFailed: data.CheckAPIFailed,
      bProscribed: data.Proscribed,
      lDeviceChecksFailCode: data.CheckFailCode,
      bProfileMatch: data.ProfileMatch,
      bBasicIntegrity: data.BasicIntegrity,
      bApproved: data.Approved,
      oExpired: data.Expired,
      strDeviceShortHash: data.DeviceHash,
      strAppListShortHash: data.AppListHash,
    });

    gameSimulation.addUser(user);
  }

  // parsedGameSave.Users.forEach((data, idx) => {
  //   let user = new User({
  // strIMEI: data.IMEI,
  // lPlayerID: data.PlayerID,
  // cBanState: data.BanState,
  // oNextBanTime: data.NextBanTime,
  // oBanDurationRemaining: data.BanDurationRemaining,
  // strBanReason: data.BanReason,
  // strLastIP: data.LastIP,
  // bLastTypeMobile: data.LastConnectionMobile,
  // oDeviceCheckedDate: data.LastChecked,
  // bLastDeviceCheckFailed: data.LastCheckFailed,
  // bDeviceChecksAPIFailed: data.CheckAPIFailed,
  // bProscribed: data.Proscribed,
  // lDeviceChecksFailCode: data.CheckFailCode,
  // bProfileMatch: data.ProfileMatch,
  // bBasicIntegrity: data.BasicIntegrity,
  // bApproved: data.Approved,
  // oExpired: data.Expired,
  // strDeviceShortHash: data.DeviceHash,
  // strAppListShortHash: data.AppListHash,
  //   });
  //   gameSimulation.addUser(user);
  // });
};
