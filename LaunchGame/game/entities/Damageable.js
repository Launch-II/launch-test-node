const { LaunchEntity } = require('./LaunchEntity');
const ByteBuffer = require('bytebuffer');
const DATA_SIZE = 4;

class Damageable extends LaunchEntity {
  constructor(data) {
    if (!data) return;
    super(data);
    if (data.buffer) {
      this.nHP = data.readShort();
      this.nMaxHP = data.readShort();
    }
    if (!data.buffer) {
      this.nHP = data.nHP;
      this.nMaxHP = data.nMaxHP;
    }
  }

  GetData(lAskingID) {
    let cBaseData = super.GetData(lAskingID);

    const bb = new ByteBuffer(DATA_SIZE + cBaseData.length);
    bb.append(cBaseData);
    bb.writeShort(this.nHP);
    bb.writeShort(this.nMaxHP);

    return bb.buffer;
  }

  InflictDamage(nDamage) {
    nDamageInflicted = Math.min(nDamage, nHP);

    nHP -= nDamage;

    if (nHP < 0) nHP = 0;

    this.Changed(false);

    return nDamageInflicted;
  }

  SetHP(nHP) {
    this.nHP = nHP;
  }

  SetMaxHP(nMaxHP) {
    this.nMaxHP = nMaxHP;
  }

  AddHP(nHP) {
    this.nHP += nHP;
    this.nHP = Math.min(this.nHP, this.nMaxHP);
    this.Changed(false);
  }

  GetHPDeficit() {
    //Return how many HP away from full the damageable is.
    return this.nMaxHP - this.nHP;
  }

  Destroyed() {
    return this.nHP <= 0;
  }

  AtFullHealth() {
    return this.nHP == this.nMaxHP;
  }
}

module.exports.Damageable = Damageable;
