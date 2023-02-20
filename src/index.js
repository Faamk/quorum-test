import {Score} from "./models/models.js";
import {BillScoreOutput, LegislatorScoreOutput} from "./outputDTO/outputDto.js";
import {loadDataFromCsv, writeArrayObjectToCsv} from "./utils/csvUtils.js";
const {legislators,votes,bills,voteResults} = loadDataFromCsv()

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

    legislators.forEach((legislator, index) => {
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
        const personName = legislators.get(bill.sponsor_id) ? legislators.get(bill.sponsor_id).name : 'Unknown'
        return new BillScoreOutput(bill.id, bill.title, yayVotes, nayVotes, personName)
    })

    writeArrayObjectToCsv('bills.csv', output, ['id', 'title', 'supporter_count', 'opposer_count', 'primary_sponsor'])
}






