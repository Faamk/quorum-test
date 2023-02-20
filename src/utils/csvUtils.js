import {Bill, Legislator, Vote, VoteResult} from "../models/models.js";
import {stringify} from "csv-stringify/browser/esm";
import fs from "fs";
import {parse} from "csv-parse/sync";

export function loadDataFromCsv() {
    const legislators = new Map()
    const votes = new Map()
    const bills = []
    const voteResults = []

    csvFileNameToArrayObject("input/legislators.csv").forEach(obj => {
        legislators.set(obj.id, Object.assign(new Legislator(), obj))
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

    return {legislators, votes, bills, voteResults}
}


export function writeArrayObjectToCsv(path, array, columns) {
    stringify(array, {header: true, columns: columns}, (err, output) => {
        if (err) throw err;
        fs.mkdir('output/', {recursive: true}, x => fs.writeFile("output/" + path, output, (err) => {
            if (err) throw err;
        }));
    });
}

function csvFileNameToArrayObject(path) {
    const data = fs.readFileSync(path, 'utf8');
    return parse(data, {
        columns: true,
        skip_empty_lines: true
    });
}
