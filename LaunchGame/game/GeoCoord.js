const helperFunctions = require('../helperFunctions');

const UNSET_THRESHOLD = -100000;
const UNSET = UNSET_THRESHOLD * 10;

const DEGREES_IN_RADIANS_1 = (Math.PI * 2) / 360;
const DEGREES_IN_RADIANS_5 = (Math.PI * 2) / 72;
const DEGREES_IN_RADIANS_60 = (Math.PI * 2) / 6;
const DEGREES_IN_RADIANS_359 = DEGREES_IN_RADIANS_1 * 359;
const DEGREES_IN_RADIANS_355 = DEGREES_IN_RADIANS_1 * 355;

const INTERCEPT_RECALC_TICKS = 60;

const EARTH_RADIUS_KM = 6372.8;
const MS_PER_HOUR = 3600000;

class GeoCoord {
  constructor(data) {
    this.interceptRecalcTicks;
    this.geoIntercept;
    this.lastBearing;
    if (!data) {
      this.latitude = UNSET;
      this.longitude = UNSET;
      return;
    }
    if (data.latitudeDeg && data.longitudeDeg) {
      this.latitude = helperFunctions.degreesToRadians(data.latitudeDeg);
      this.longitude = helperFunctions.degreesToRadians(data.longitudeDeg);
      return;
    }
    if (data.geoCopy) {
      this.latitude = data.geoCopy.latitude;
      this.longitude = data.geoCopy.longitude;
      return;
    }
    if (data.geoFrom && data.randomDeviance) {
      this.latitude = geoFrom.latitude;
      this.longitude = getFrom.longitude;
      Move(Math.random() * (2 * Math.PI), Math.random() * randomDeviance);
      return;
    }
    if (data.latitude && data.longitude && data.degrees) {
      if (degrees) {
        this.latitude = helperFunctions.degreesToRadians(data.latitudeDeg);
        this.longitude = helperFunctions.degreesToRadians(data.longitudeDeg);
      } else {
        this.latitude = data.latitude;
        this.longitude = data.longitude;
      }
      return;
    }
    if (data.latitudeRad && data.longitudeRad) {
      this.latitude = data.latitudeRad;
      this.longitude = data.longitudeRad;
      return;
    }
  }
  GetCopy() {
    return new GeoCoord(this);
  }
  MoveToward({ destination, distance, speed, timeMS }) {
    if (distance) {
      let distanceTo = DistanceTo(destination);
      if (distance < distanceTo) {
        let bearing = BearingTo(destination);
        this.Move(bearing, distance);
        return false;
      }
      this.latitude = destination.latitude;
      this.longitude = destination.longitude;
      return true;
    }
    if (!distance) {
      let distance = (speed / MS_PER_HOUR) * timeMS;
      return this.MoveToward(destination, distance);
    }
  }
  MoveToIntercept(speed, missile, missileSpeed, target, timeMS) {
    this.interceptRecalcTicks--;
    if (interceptRecalcTicks <= 0) {
      this.geoIntercept = missile.GetCopy();

      let missileTime = 0;
      let interceptorTime = 340282346638528859811704183484516925440;

      while (missileTime < interceptorTime) {
        if (this.geoIntercept.MoveToward(target, missileSpeed, timeMS)) break;

        missileTime = missile.DistanceTo(this.geoIntercept) / missileSpeed;
        interceptorTime = this.DistanceTo(this.geoIntercept) / speed;
      }

      interceptRecalcTicks = INTERCEPT_RECALC_TICKS;
    }

    return MoveToward(this.geoIntercept, speed, timeMS);
  }
  InterceptPoint(destination, speed, interceptor, interceptorSpeed) {
    let time = 0;
    let interceptorTime = 0;
    let interceptPoint = GetCopy();

    while (time < interceptorTime) {
      if (interceptPoint.MoveToward({ destination, speed, timeMS: 1000 }))
        break;

      time = DistanceTo(interceptPoint) / speed;
      interceptorTime =
        interceptor.DistanceTo(interceptPoint) / interceptorSpeed;
    }

    return interceptPoint;
  }
  Move(bearing, distance) {
    this.lastBearing = bearing;

    let angularDistance = distance / EARTH_RADIUS_KM;

    let newLatitude = Math.asin(
      Math.sin(this.latitude) * Math.cos(angularDistance) +
        Math.cos(this.latitude) * Math.sin(angularDistance) * Math.cos(bearing)
    );
    let newLongitude =
      this.longitude +
      Math.atan2(
        Math.sin(bearing) * Math.sin(angularDistance) * Math.cos(this.latitude),
        Math.cos(angularDistance) -
          Math.sin(this.latitude) * Math.sin(newLatitude)
      );

    this.latitude = newLatitude;
    this.longitude = newLongitude;
  }
  BearingTo(destination) {
    let y =
      Math.sin(destination.longitude - this.longitude) *
      Math.cos(destination.latitude);
    let x =
      Math.cos(this.latitude) * Math.sin(destination.latitude) -
      Math.sin(this.latitude) * Math.cos(destination.latitude);

    return Math.atan2(y, x);
  }
  DistanceTo(destination) {
    let deltaLatitude = destination.latitude - this.latitude;
    let deltaLongitude = destination.longitude - this.longitude;

    let a =
      Math.sin(deltaLatitude / 2) * Math.sin(deltaLongitude / 2) +
      Math.sin(deltaLongitude / 2) *
        Math.sin(deltaLongitude / 2) *
        Math.cos(this.latitude) *
        Math.cos(destination.latitude);
    let c = 2 * Math.asin(Math.sqrt(a));

    return EARTH_RADIUS_KM * c;
  }
  AngularDistanceTo(destination) {
    let deltaLatitude = destination.latitude - this.latitude;
    let deltaLongitude = destination.longitude - this.longitude;

    let a =
      Math.sin(deltaLatitude / 2) * Math.sin(deltaLatitude / 2) +
      Math.sin(deltaLongitude / 2) *
        Math.sin(deltaLongitude / 2) *
        Math.cos(this.latitude) *
        Math.cos(destination.latitude);
    return 2 * Math.asin(Math.sqrt(a));
  }
  CrossTrackDistanceTo(object, objectDestination) {
    let dbl13 = object.AngularDistanceTo(this);
    let Theta13 = object.BearingTo(this);
    let Theta12 = object.BearingTo(objectDestination);

    return (
      Math.asin(Math.sin(dbl13) * Math.sin(Theta13 - Theta12)) * EARTH_RADIUS_KM
    );
  }
  AlongTrackDistanceTo(object, objectDestination) {
    let dbl13 = object.AngularDistanceTo(this);

    return (
      Math.acos(
        Math.cos(dbl13) /
          Math.cos(
            CrossTrackDistanceTo(object, objectDestination) / EARTH_RADIUS_KM
          )
      ) * EARTH_RADIUS_KM
    );
  }
  GetLatitude() {
    return helperFunctions.radiansToDegrees(this.latitude);
  }
  GetLongitude() {
    return helperFunctions.radiansToDegrees(this.longitude);
  }
  GetLastBearing() {
    return this.lastBearing;
  }
  GetValid() {
    // 🤷‍♀️
    return this.latitude > UNSET_THRESHOLD && this.longitude > UNSET_THRESHOLD;
  }
  BroadPhaseCollisionTest(geoPoint) {
    if (Math.abs(geoPoint.latitude) > DEGREES_IN_RADIANS_60) return true;

    if (Math.abs(geoPoint.latitude - this.latitude) < DEGREES_IN_RADIANS_1) {
      let longitudeDelta = Math.abs(geoPoint.longitude - this.longitude);

      if (longitudeDelta < DEGREES_IN_RADIANS_1) {
        return true;
      }

      return longitudeDelta > DEGREES_IN_RADIANS_359;
    }

    return false;
  }
  EvenBroaderPhaseCollisionTest(geoPoint) {
    if (Math.abs(geoPoint.latitude) > DEGREES_IN_RADIANS_60) return true;

    if (Math.abs(geoPoint.latitude - this.latitude) < DEGREES_IN_RADIANS_5) {
      let longitudeDelta = Math.abs(geoPoint.longitude - this.longitude);

      if (longitudeDelta < DEGREES_IN_RADIANS_5) return true;

      return longitudeDelta > DEGREES_IN_RADIANS_355;
    }

    return false;
  }
  IsInsideGeoRect(geoSouthernWest, geoNorthernEast) {
    return (
      this.longitude > geoSouthernWest.longitude &&
      this.longitude < geoNorthernEast.longitude &&
      this.latitude > geoSouthernWest.latitude &&
      this.latitude < geoNorthernEast.latitude
    );
  }
  ToString() {
    return `(${this.GetLatitude()}, ${this.GetLongitude})`;
  }
}

module.exports.GeoCoord = GeoCoord;
