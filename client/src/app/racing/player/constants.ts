export interface Statistics {
    currentLap: number;
    lapTimes: number[];
    finalTime: number;
}

export const RANDOM_FIRSTNAMES: string[] = [ "Thomas", "Jesse", "Sarah", "Billy", "Helen", "Jeffrey", "Stephanie", "Jane", "Todd",
                                             "Shawn", "Kevin", "Kathryn", "Rose", "Raymond", "Johnny", "Earl", "Edward",
                                             "Karen", "Catherine", "Ralph", "John", "Amanda", "Anna", "Harry", "Marilyn",
                                             "Jeremy", "Nicole", "Christopher", "Kenneth", "Dennis", "Bruce", "Martha",
                                             "Kelly", "Jimmy", "Harold", "Stephen", "Carl", "Lori", "Jonathan", "Sean",
                                             "Judy", "Aaron", "Eric", "Ernest", "Rebecca", "Gloria", "Larry", "Janice",
                                             "Clarence", "Douglas", "Jean", "Guy", "Paul", "Paulette", "Rene", "Jack", "Telly"];

export const RANDOM_LASTNAMES: string[] = [ "Williams", "Jones", "Coleman", "Brown", "Wood", "Diaz", "Cook", "Hall", "Watson", "Bah",
                                            "Campbell", "Henderson", "Torres", "Collins", "Jackson", "Hernandes", "Morris", "Simmons",
                                            "Powels", "Harris", "Long", "Miller", "Price", "Walker", "Green", "Wilson", "Nelson", "Davis",
                                            "Bryans", "Thompson", "Clarc", "James", "Garcia", "Wright", "Kins", "Martin", "Evans", "Butler",
                                            "Anderson", "Pattersons", "Kelly", "Cooper", "Young", "Baker", "Russels", "White", "Carter",
                                            "Turner", "Barnes", "Brooks", "Des Fleurs", "Tremblay", "De La Montagne", "Petrovish"];

export const RANDOM_TIME_MULTIPLIER: number = 10;
export const LOCAL_PLAYER_NAME: string = "You";
