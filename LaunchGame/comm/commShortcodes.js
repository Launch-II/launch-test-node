/**
 * @file Contains an object with shortCode objects, as well as functions by which to select those objects.
 * @author Owen Rossi-Keen
 */

/** @constant - Array of shortcodes. */

const shortCodes = [
  {
    code: 0,
    type: 'object',
    title: 'Authorize',
    desc: 'Request to authorize, using encrypted device ID.',
  },
  {
    code: 1,
    type: 'object',
    title: 'UserData',
    desc: "User data. Admin's eyes only.",
  },
  {
    code: 2,
    type: 'object',
    title: 'PermBanData',
    desc: 'Player is permanently banned, with reason.',
  },
  {
    code: 3,
    type: 'object',
    title: 'BanData',
    desc: 'Player is banned, with duration and reason.',
  },
  {
    code: 4,
    type: 'object',
    title: 'Registration',
    desc: 'Account registration request details.',
  },
  {
    code: 5,
    type: 'object',
    title: 'GameSnapshot',
    desc: 'A new snapshot of the entire game, for every new comms session.',
  },
  {
    code: 6,
    type: 'object',
    title: 'LocationUpdate',
    desc: 'Regular location data from players.',
  },
  {
    code: 7,
    type: 'object',
    title: 'Player',
    desc: 'A player.',
  },
  {
    code: 8,
    type: 'object',
    title: 'Missile',
    desc: 'A missile.',
  },
  {
    code: 9,
    type: 'object',
    title: 'Interceptor',
    desc: 'An interceptor missile.',
  },
  {
    code: 10,
    type: 'object',
    title: 'MissileSite',
    desc: 'A missile launch site.',
  },
  {
    code: 11,
    type: 'object',
    title: 'SamSite',
    desc: 'A SAM site.',
  },
  {
    code: 12,
    type: 'object',
    title: 'OreMine',
    desc: 'An ore mine.',
  },
  {
    code: 13,
    type: 'object',
    title: 'SentryGun',
    desc: 'A sentry gun',
  },
  {
    code: 14,
    type: 'object',
    title: 'Loot',
    desc: 'A loot cache.',
  },
  {
    code: 15,
    type: 'object',
    title: 'Radiation',
    desc: 'A radioactive area.',
  },
  {
    code: 16,
    type: 'object',
    title: 'AllianceMinor',
    desc: 'An alliance minor change (i.e. points change).',
  },
  {
    code: 17,
    type: 'object',
    title: 'AllianceMajor',
    desc: 'An alliance major change that should trigger a UI refresh (i.e. players joining/leaving, etc).',
  },
  {
    code: 18,
    type: 'object',
    title: 'Treaty',
    desc: 'An alliance treaty.',
  },
  {
    code: 19,
    type: 'object',
    title: 'Avatar',
    desc: 'An avatar.',
  },
  // 20 is reserved
  {
    code: 21,
    type: 'object',
    title: 'Config',
    desc: 'The game configuration.',
  },
  {
    code: 43,
    type: 'object',
    title: 'ProcessNames',
    desc: 'A list of process names, when location spoofing has been suspected.',
  },
  {
    code: 44,
    type: 'object',
    title: 'DeviceCheck',
    desc: 'Device check information.',
  },
  {
    code: 0,
    type: 'command',
    title: 'AccountUnregistered',
    desc: 'The account must be registered (present user with form).',
  },
  {
    code: 1,
    type: 'command',
    title: 'MajorVersionInvalid',
    desc: 'Notify the client that a major update is available.',
  },
  {
    code: 2,
    type: 'command',
    title: 'NameTaken',
    desc: 'The player or alliance name already exists.',
  },
  {
    code: 3,
    type: 'command',
    title: 'AccountCreateSuccess',
    desc: 'The account was created successfully.',
  },
  // 4 and 5 are reserved. For what, I wonder?
  {
    code: 6,
    type: 'command',
    title: 'SnapshotBegin',
    desc: 'Indicates the start of a requested game snapshot.',
  },
  {
    code: 7,
    type: 'command',
    title: 'SnapshotComplete',
    desc: 'Indicates the end of a requested game snapshot.',
  },
  {
    code: 8,
    type: 'command',
    title: 'SnapshotAck',
    desc: 'Acknowledges receipt of the end of the snapshot.',
  },
  {
    code: 18,
    type: 'command',
    title: 'KeepAlive',
    desc: "A keepalive for when location information isn't available.",
  },
  {
    code: 44,
    type: 'command',
    title: 'DeviceCheck',
    desc: 'Device check information',
  },
  {
    code: 73,
    type: 'command',
    title: 'PlayerNameTooLong',
    desc: 'Player name exceeds maximum length (32).',
  },
  {
    code: 74,
    type: 'command',
    title: 'PlayerNameTooShort',
    desc: 'Player name string is 0 length.',
  },
  {
    code: 75,
    type: 'command',
    title: 'KeepAlive',
    desc: "A keepalive for when location information isn't available.",
  },
];
/**
 * Selects communications shortcode object by its name.
 * @param {string} name - The name of the object you are searching for.
 * @returns {Object} shortCode - The shortcode object
 */
module.exports.byName = byName = (name) =>
  shortCodes.find((obj) => obj.title == name);

/**
 * Selects communications shortcode object by its comms code.
 * @param {number} code - The code of the object you are searching for.
 * @param {string} [type='object'] - 'command' or 'object'. Specifies the type of shortCode you're looking for.
 * @returns {Object} shortCode - The shortcode object
 */
module.exports.byCode = byCode = (code, type) => {
  if (type)
    return shortCodes.find((obj) => obj.code == code && obj.type == type);

  return shortCodes.find((obj) => obj.code == code);
};
