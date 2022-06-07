console.log('Loading helperFunctions.js');
// Contained within are data processing functions. No idea how these are gonna work in the browser 🤷‍♀️

// Eventually:
// https://jsdoc.app/index.html

// Dependencies
var ByteBuffer = require('bytebuffer');
const readline = require('readline');
const recursive = require('recursive-readdir');
const fs = require('fs');
const CryptoJS = require('crypto-js');
const terminal = require('./terminal');

const STRING_LENGTH_PREFIX_SIZE = 2;
const SANCTIFIED_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

module.exports.stringToSHA256 = (str) => {
  return new ByteBuffer(32).append(
    Buffer.from(CryptoJS.SHA256(str).toString(CryptoJS.enc.Hex), 'hex')
  );
};

module.exports.getStringDataSize = (str) => {
  return STRING_LENGTH_PREFIX_SIZE + stringToBytesBB(str).length;
};

module.exports.stringToBytesBB = (str) => {
  const bb = new ByteBuffer(str.length);
  bb.writeString(str);
  return bb.buffer;
};

module.exports.getStringData = (str) => {
  const bb = new ByteBuffer.allocate(getStringDataSize(str));
  cString = stringToBytesBB(str);
  bb.writeShort(cString.length);
  bb.append(cString);

  return bb.buffer;
};

module.exports.intFromBytes = (byteArray) => {
  if (byteArray.length !== 4) return console.log('Yikes!');
  const bb = new ByteBuffer(4).append(byteArray);

  return (
    (bb.buffer[0] << 24) +
    (bb.buffer[1] << 16) +
    (bb.buffer[2] << 8) +
    bb.buffer[3]
  );
};

module.exports.toSmobject = ({ data, type = 'notype', name = 'noid' }) => {
  // Not particularly useful now, but will be used to construct data eventually.
  return data
    ? {
        name,
        type,
        data,
      }
    : { name, type };
};
module.exports.roundFloat = (float) => Math.round(float * 100) / 100;

module.exports.getTime = (full) => {
  // This is a hacky way to do it, but it works 🤷‍♀️

  let currentDate = new Date();
  if (full) return currentDate.toJSON().slice(0, 19).replace('T', ' || ');
  return currentDate.toJSON().slice(0, 19).split('T')[1];
};

module.exports.stringFromData = (bb) => {
  let lengthToRead = bb.readShort();

  const cString = bb.readString(lengthToRead);

  return cString;
};

module.exports.projectAudit = async () => {
  terminal.log('Counting lines in project:', 'code');
  const countLines = async (filteredPaths) =>
    new Promise((res, rej) => {
      var totalLines = 0;
      var filesRead = 0;
      filteredPaths.forEach((filePath, idx) => {
        let linesCount = 0;
        readline
          .createInterface({
            input: fs.createReadStream(filePath),
            output: process.stdout,
            terminal: false,
          })
          .on('line', () => {
            linesCount++;
          })
          .on('close', () => {
            // console.log(filePath, linesCount)
            filesRead++;
            totalLines = totalLines + linesCount;
            // console.log(`${filesRead}/${filteredPaths.length}`);
            if (filesRead == filteredPaths.length) res(totalLines);
          });
      });
    });
  const remove = (array, phrase) =>
    array.filter((item) => item.indexOf(phrase) == -1);

  // Get array of all file paths
  const filePaths = await recursive('../../', [
    (path) => {
      var a = true;
      if (
        path.indexOf(
          'node_modules' &&
            path.indexOf('android') &&
            path.indexOf('package') &&
            path.indexOf('build') &&
            path.indexOf('message') &&
            path.indexOf('build') &&
            path.indexOf('.mext')
        ) == -1
      ) {
        a = false;
      }
      // console.log(path);
      if (path.indexOf('node_modules')) return false;
    },
  ]);
  // Filter out unwanted files
  const filtered = remove(
    remove(
      remove(
        remove(
          remove(
            remove(
              filePaths.filter(
                (path, idx) =>
                  path.slice(-3) == 'tml' ||
                  path.slice(-3) == 'jsx' ||
                  path.slice(-3) == '.js' ||
                  path.slice(-3) == 'son' ||
                  path.slice(-3) == 'tsx' ||
                  path.slice(-3) == 'css' ||
                  path.slice(-3) == 'txt' ||
                  path.slice(-3) == '.md'
              ),
              'node_modules'
            ),
            'android'
          ),
          'package'
        ),
        'build'
      ),
      '.next'
    ),
    'message'
  );
  // Pass array of filtered files to counting function
  let finalCount = await countLines(filtered);
  // Log the final count
  return 'Final Count: ' + finalCount + ', Process Complete!';
};

module.exports.crc32 = (r) => {
  for (var a, o = [], c = 0; c < 256; c++) {
    a = c;
    for (var f = 0; f < 8; f++) a = 1 & a ? 3988292384 ^ (a >>> 1) : a >>> 1;
    o[c] = a;
  }
  for (var n = -1, t = 0; t < r.length; t++)
    n = (n >>> 8) ^ o[255 & (n ^ r.charCodeAt(t))];
  return (-1 ^ n) >>> 0;
};

module.exports.parsedJsonStringsToInt = (object) => {
  if (Array.isArray(object)) {
    return object.map((data) => this.parsedJsonStringsToInt(data));
  }
  var obj = object;
  for (var prop in obj) {
    if (Array.isArray(obj[prop])) {
      this.parsedJsonStringsToInt(obj[prop]);
    } else {
      switch (obj[prop]) {
        case 'true':
          obj[prop] = true;
          break;
        case 'false':
          obj[prop] = false;
          break;
        default:
          if (
            obj.hasOwnProperty(prop) &&
            obj[prop] !== null &&
            !isNaN(obj[prop])
          ) {
            obj[prop] = +obj[prop];
          }
          break;
      }
    }
  }
  return obj;
};

module.exports.degreesToRadians = (deg) => {
  return deg * (Math.PI / 180);
};

module.exports.radiansToDegrees = (rad) => {
  return rad * (180 / Math.PI);
};

module.exports.milesToKilometers = (miles) => {
  return miles / 1.609;
};

module.exports.kilometersToMiles = (kilometers) => {
  return kilometers * 1.609;
};

module.exports.bytesToHexString = (data) => {
  let bb = new ByteBuffer(32).append(data).reset();
  return bb.toHex();
};

module.exports.sanitizeName = (str) => {
  // https://github.com/2Toad/Profanity
  let strName = str.trim();

  if (strName.length > 32) {
    strName = `NTL${Math.random()}-${Math.random() * 100 * Math.pi}`.slice(
      0,
      32
    );
  } else {
    if (strName.match('^.*[a-xzA-Z0-9][a-zA-Z0-9][a-zA-Z0-9].*$')) {
      strName = `RGX${Math.random()}-${Math.random() * 100 * Math.pi}`.slice(
        0,
        32
      );
    }
  }
  return strName;
};

module.exports.cleanJSON = (json) => {
  // This is assuming you manually removed the top-level Game: {} and Ctrl+F find-and-replaced all underscores with nothing.
  let parsedGame = this.parsedJsonStringsToInt(json);

  let userTest;
  let playerTest;
  let mSiteTest;
  let sSiteTest;

  // I'm aware this is some of the worst code ever written. It works, and I (hopefully) won't have to use it frequently.

  Object.keys(parsedGame).forEach((key, idx) => {
    if (key == 'Users') {
      let fixedUser = parsedGame[key].map((user) => {
        // for each user
        let faux = { ...user };
        if (user?.Reports?.Report) {
          // console.log(user.Reports.Report);
          if (Array.isArray(user?.Reports?.Report)) {
            faux.Reports = [...user.Reports.Report];
          } else {
            faux.Reports = [user.Reports.Report];
          }
        }
        return faux;
      });
      userTest = fixedUser;
      return;
    }
    if (key == 'Players') {
      let fixedPlayer = parsedGame[key].map((player) => {
        let faux = { ...player };

        if (player?.MissileSystem?.Slots?.Slot) {
          if (player?.MissileSystem?.Slots?.Slot == '') {
            faux.MissileSystem.Slots = [];
          } else {
            if (Array.isArray(player?.MissileSystem?.Slots?.Slot)) {
              faux.MissileSystem.Slots = [...player.MissileSystem.Slots.Slot];
            } else {
              faux.MissileSystem.Slots = [player.MissileSystem.Slots.Slot];
            }
          }
        }
        if (player?.InterceptorSystem?.Slots?.Slot) {
          if (player?.InterceptorSystem?.Slots?.Slot == '') {
            faux.InterceptorSystem.Slots = [];
          } else {
            if (Array.isArray(player?.InterceptorSystem?.Slots?.Slot)) {
              faux.InterceptorSystem.Slots = [
                ...player.InterceptorSystem.Slots.Slot,
              ];
            } else {
              faux.InterceptorSystem.Slots = [
                player.InterceptorSystem.Slots.Slot,
              ];
            }
          }
        }
        return faux;
      });
      playerTest = fixedPlayer;
      return;
    }
    if (key == 'MissileSites') {
      let fixedSite = parsedGame[key].map((site) => {
        let faux = { ...site };

        if (site?.MissileSystem?.Slots?.Slot) {
          if (site?.MissileSystem?.Slots?.Slot == '') {
            faux.MissileSystem.Slots = [];
          } else {
            if (Array.isArray(site?.MissileSystem?.Slots?.Slot)) {
              faux.MissileSystem.Slots = [...site.MissileSystem.Slots.Slot];
            } else {
              faux.MissileSystem.Slots = [site.MissileSystem.Slots.Slot];
            }
          }
        }
        return faux;
      });
      mSiteTest = fixedSite;
      return;
    }
    if (key == 'SAMSites') {
      let fixedSite = parsedGame[key].map((site) => {
        let faux = { ...site };

        if (site?.InterceptorSystem?.Slots?.Slot) {
          if (site?.InterceptorSystem?.Slots?.Slot == '') {
            faux.InterceptorSystem.Slots = [];
          } else {
            if (Array.isArray(site?.InterceptorSystem?.Slots?.Slot)) {
              faux.InterceptorSystem.Slots = [
                ...site.InterceptorSystem.Slots.Slot,
              ];
            } else {
              faux.InterceptorSystem.Slots = [
                site.InterceptorSystem.Slots.Slot,
              ];
            }
          }
        }
        return faux;
      });
      sSiteTest = fixedSite;
      return;
    }
  });

  fs.writeFileSync('./output.json', JSON.stringify(output));

  let output = {
    Users: userTest,
    Alliances: parsedGame.AlliancesplayerTest,
    Treaties: parsedGame.Treaties,
    Players: playerTest,
    Missiles: parsedGame.Missiles,
    Interceptors: parsedGame.Interceptors,
    MissileSites: mSiteTest,
    SAMSites: sSiteTest,
    SentryGuns: parsedGame.SentryGuns,
    OreMines: parsedGame.OreMines,
    Loots: parsedGame.Loots,
    Radiations: parsedGame.Radiations,
  };
  return output;
};

// Selects a random value from an array
module.exports.ranArr = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Capitalizes a string
module.exports.capitalize = (str) => str.replace(/^\w/, (c) => c.toUpperCase());

// Generates an ordinal suffix for a number
module.exports.generateOrdinal = (i) => {
  var j = i % 10,
    k = i % 100;
  if (j == 1 && k != 11) {
    return i + 'st';
  }
  if (j == 2 && k != 12) {
    return i + 'nd';
  }
  if (j == 3 && k != 13) {
    return i + 'rd';
  }
  return i + 'th';
};
