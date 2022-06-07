const helperFunctions = require('../../helperFunctions');
const ByteBuffer = require('bytebuffer');

// This whole stupid class is basically just a number which decreases every time second it called. I don't understand why the other classes are needed. EDIT: Due to retarded java stuff.
class TimeDelay {
  constructor(data) {
    if (!data) {
      this.timeRemaining = 0;
      return;
    }
    if (data.buffer) {
      this.timeRemaining = data.readInt();
      return;
    }
    if (!data.buffer) {
      this.timeRemaining = data;
    }
  }
  Set(timeMS) {
    this.timeRemaining = timeMS;
  }
  GetRemaining() {
    return this.timeRemaining;
  }
  Expired() {
    return timeRemaining <= 0;
  }
  ForceExpiry() {
    this.timeRemaining = 0;
  }
  GetData(bb) {
    bb.writeInt(this.timeRemaining);
  }
  Tick(time) {
    // time is the amount of time to subtract per tick
    this.timeRemaining -= time;

    // This looks retarded, but whatever
    if (this.timeRemaining < 0) {
      this.timeRemaining = 0;
    }
  }
}

module.exports.TimeDelay = TimeDelay;
