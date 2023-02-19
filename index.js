import {parse} from 'csv-parse/sync';
import fs from 'fs'

class Legislator {name}
class Bill {title;primarySponsor}
class Vote {bill_id}
class VoteResult {id;legislator_id;vote_id;vote_type}

const legislators = new Map();
const bills = new Map();
const votes = new Map();
const voteResults = []


loadDataFromCsv()
legislatorSupportCount()


function legislatorSupportCount(){
    legislators.forEach(value => console.log(value))
}

function billSupportCountAndPrimarySponsor(){
    bills.forEach(value => console.log(value))
}

function loadDataFromCsv() {

    csvFileNameToArrayObject("input/legislators.csv").forEach(obj => {
        legislators.set(obj.id,Object.assign(new Legislator(), obj))
    })

    csvFileNameToArrayObject("input/bills.csv").forEach(obj => {
        bills.set(obj.id,Object.assign(new Bill(), obj))
    })

    csvFileNameToArrayObject("input/votes.csv").forEach(obj => {
        votes.set(obj.id, Object.assign(new Vote(), obj))
    })

    console.log("d")
}

function csvFileNameToArrayObject(path) {
    const data = fs.readFileSync(path, 'utf8');
    return parse(data, {
        columns: true,
        skip_empty_lines: true
    });
}



