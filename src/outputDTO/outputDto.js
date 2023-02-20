export class LegislatorScoreOutput {
    id
    name
    num_supported_bills
    num_opposed_bills

    constructor(id, name, num_supported_bills, num_opposed_bills) {
        this.id = id
        this.name = name
        this.num_supported_bills = num_supported_bills
        this.num_opposed_bills = num_opposed_bills
    }
}

export class BillScoreOutput {
    id
    title
    supporter_count
    opposer_count
    primary_sponsor

    constructor(id, title, supporter_count, opposer_count, primary_sponsor) {
        this.id = id;
        this.title = title;
        this.supporter_count = supporter_count;
        this.opposer_count = opposer_count;
        this.primary_sponsor = primary_sponsor;
    }
}
