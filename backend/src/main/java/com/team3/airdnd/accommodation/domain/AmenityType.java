package com.team3.airdnd.accommodation.domain;

public enum AmenityType {
	WIFI,
	TV,
	AIR_CONDITIONER,
	HAIR_DRYER,
	POOL,
	PARKING,
	GYM,
	KITCHEN,
	LAUNDRY,
	HEATER;

	public static boolean isValid(String name) {
		if (name == null)
			return false;
		try {
			AmenityType.valueOf(name.toUpperCase());
			return true;
		} catch (IllegalArgumentException e) {
			return false;
		}
	}
}
