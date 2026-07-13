from enum import Enum

class CrimeType(str, Enum):
    THEFT = "theft"
    ASSAULT = "assault"
    ROBBERY = "robbery"
    BURGLARY = "burglary"
    CYBERCRIME = "cybercrime"
    MISSING_PERSON = "missing_person"
    VEHICLE_THEFT = "vehicle_theft"
    CHAIN_SNATCHING = "chain_snatching"
    OTHER = "other"
