import {parse} from 'csv-parse/sync';
import {stringify} from 'csv-stringify';
import fs from 'fs'

class Legislator {
    name
}

class Bill {
    title
    sponsor_id
}

class Vote {
    bill_id
}

class VoteResult {
    id
    legislator_id
    vote_id
    vote_type
}

class Score {
    vote_yay
    vote_nay

    constructor(vote_yay, vote_nay) {
        this.vote_yay = vote_yay
        this.vote_nay = vote_nay
    }
}

class LegislatorScoreOutput {
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

class BillScoreOutput {
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

const legislators = new Map()
const bills = []
const votes = new Map()
const voteResults = []


loadDataFromCsv()
legislatorSupportCount()
billSupportCountAndPrimarySponsor()


function legislatorSupportCount() {
    const legislatorsIdAndVoteQuantity = new Map()
    voteResults.forEach(value => {
        if (!legislatorsIdAndVoteQuantity.get(value.legislator_id)) {
            legislatorsIdAndVoteQuantity.set(value.legislator_id, new Score(new Set(), new Set()))
        }
        let legScore = legislatorsIdAndVoteQuantity.get(value.legislator_id)

        if (value.vote_type == 2)
            legScore.vote_yay.add(votes.get(value.vote_id).bill_id)
        else
            legScore.vote_nay.add(votes.get(value.vote_id).bill_id)
    })

    const output = []

    legislators.forEach((legislator,index) => {
        const votingScore = legislatorsIdAndVoteQuantity.get(index)
        let yayVotes, nayVotes
        if (votingScore) {
            yayVotes = votingScore.vote_yay.size
            nayVotes = votingScore.vote_nay.size
        } else {
            yayVotes = 0
            nayVotes = 0
        }
        output.push(new LegislatorScoreOutput(index, legislator.name, yayVotes, nayVotes))
    })

    writeArrayObjectToCsv('legislators-support-oppose-count.csv', output, ['id', 'name', 'num_supported_bills', 'num_opposed_bills'])
}

function billSupportCountAndPrimarySponsor() {
    const billSupporterAndOpposed = new Map()
    voteResults.forEach(value => {
        const billId = votes.get(value.vote_id).bill_id
        if (!billSupporterAndOpposed.get(billId)) {
            billSupporterAndOpposed.set(billId, new Score(new Set(), new Set()))
        }
        let legScore = billSupporterAndOpposed.get(billId)

        if (value.vote_type == 2)
            legScore.vote_yay.add(value.legislator_id)
        else
            legScore.vote_nay.add(value.legislator_id)
    })

    const output = bills.map(bill => {
        const votingScore = billSupporterAndOpposed.get(bill.id)
        let yayVotes, nayVotes
        if (votingScore) {
            yayVotes = votingScore.vote_yay.size
            nayVotes = votingScore.vote_nay.size
        } else {
            yayVotes = 0
            nayVotes = 0
        }
        const personName = legislators.get(bill.sponsor_id)? legislators.get(bill.sponsor_id).name: 'Unknown'
        return new BillScoreOutput(bill.id, bill.title, yayVotes, nayVotes, personName)
    })

    writeArrayObjectToCsv('bills.csv', output, ['id', 'title', 'supporter_count', 'opposer_count', 'primary_sponsor'])
}

function loadDataFromCsv() {

    csvFileNameToArrayObject("input/legislators.csv").forEach(obj => {
        legislators.set(obj.id,Object.assign(new Legislator(), obj))
    })

    csvFileNameToArrayObject("input/bills.csv").forEach(obj => {
        bills.push(Object.assign(new Bill(), obj))
    })

    csvFileNameToArrayObject("input/votes.csv").forEach(obj => {
        votes.set(obj.id, Object.assign(new Vote(), obj))
    })

    csvFileNameToArrayObject("input/vote_results.csv").forEach(obj => {
        voteResults.push(Object.assign(new VoteResult(), obj))
    })
}


function writeArrayObjectToCsv(path, array, columns) {
    stringify(array, {header: true, columns: columns}, (err, output) => {
        if (err) throw err;
        fs.writeFile(path, output, (err) => {
            if (err) throw err;
        });
    });
}

function csvFileNameToArrayObject(path) {
    const data = fs.readFileSync(path, 'utf8');
    return parse(data, {
        columns: true,
        skip_empty_lines: true
    });
}




