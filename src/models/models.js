export class Legislator {
    name
}

export class Bill {
    title
    sponsor_id
}

export class Vote {
    bill_id
}

export class VoteResult {
    id
    legislator_id
    vote_id
    vote_type
}

export class Score {
    vote_yay
    vote_nay

    constructor(vote_yay, vote_nay) {
        this.vote_yay = vote_yay
        this.vote_nay = vote_nay
    }
}
