const helperFunctions = require('../../helperFunctions');
const gameSimulation = require('../../../gameSimulation');
const { TimeDelay } = require('../../comm/utilities/TimeDelay');
const ByteBuffer = require('bytebuffer');

const MISSILE_SLOT_EMPTY_TYPE = -1;
const MISSILE_SLOT_EMPTY_TIME = -1;

const DATA_SIZE = 9;
const DATA_SIZE_MISSILE_SLOT = 5;

class MissileSystem {
  constructor(data) {
    if (!data) {
      this.dlyReload = new TimeDelay();
    }

    if (data.buffer) {
      this.MissileSlots = [];
      this.dlyReload = new TimeDelay(data);
      this.lReloadTime = data.readInt();
      this.cMissileSlotCount = data.readByte();

      for (let i = 0; i < this.cMissileSlotCount; i++) {
        let cType = data.readByte();

        if (cType == MISSILE_SLOT_EMPTY_TYPE) {
          //Empty slot. Just prune the empty time value off the byte buffer.
          data.readInt();
          this.MissileSlots.push('EMPTY');
        } else {
          //Assign to missile slot.
          this.MissileSlots.push({ cType, prepTime: new TimeDelay(data) });
        }
      }
    }

    if (Object.keys(data).length == 2) {
      this.dlyReload = new TimeDelay();
      this.lReloadTime = data.lReloadTime;
      this.cMissileSlotCount = data.cMissileSlotCount;
    }

    // From save
    if (Object.keys(data).length == 5) {
      this.dlyReload = new TimeDelay(data.lReloadRemaining);
      this.lReloadTime = data.lReloadTime;
      this.cMissileSlotCount = data.cMissileSlotCount;
      this.MissileSlotTypes = data.SlotTypes;
      this.MissileSlotPrepTimes = data.PrepTimes;
    }
  }

  Tick(lMS) {
    this.dlyReload.Tick(lMS);

    this.MissileSlotPrepTimes.forEach((prepTime) => {
      prepTime.Tick(lMS);
    });
  }

  GetData() {
    let bb = new ByteBuffer(
      DATA_SIZE + this.cMissileSlotCount * DATA_SIZE_MISSILE_SLOT
    );

    this.dlyReload.GetData(bb);
    bb.writeInt(this.lReloadTime);
    bb.writeByte(this.cMissileSlotCount);

    for (let i = 0; i < this.cMissileSlotCount; i++) {
      if (this.MissileSlots[i] == 'EMPTY') {
        bb.writeByte(MISSILE_SLOT_EMPTY_TYPE);
        bb.writeInt(MISSILE_SLOT_EMPTY_TIME);
      } else {
        bb.writeByte(this.MissileSlots[i].cType);
        MissileSlotTypes[i].prepTime.GetData(bb);
      }
    }

    return bb.buffer;
  }

  AddMissileToSlot(cSlotNo, cType, lPrepTimeRemaining) {
    this.MissileSlots[cSlotNo] = { cType, prepTime: lPrepTimeRemaining };
    this.Changed();
  }

  Changed() {
    gameSimulation.entityChanged(this, false);
  }
}

module.exports.MissileSystem = MissileSystem;
