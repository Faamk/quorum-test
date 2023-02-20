# quorum-test
 This repository contains the source code of my solution to Quorum's technical assessment


## Deployment 🚀

Node Version : `16.16.0`.

To execute this project put the csv files in the folder:

```bash
  mv legislators.csv votes.csv bills.csv vote_results.csv quorum-test/input/
``` 

Install the dependencies, 

```bash
  npm install
```

And execute the project, 

```bash
  npm start
```





## Write up:

#### 1 - Discuss your solution’s time complexity. What tradeoffs did you make?

I load the data directly into memory, loading the *legislators* and *votes* as maps to make the lookup faster. This solution trades space complexity to favor time complexity on lookups.

#### Improvements I thought of:

Making the  inicial setup using the **voteResults** to populate the Map with number of yays and nays could be executed only once and load the maps for both functions.

#### 2 - How would you change your solution to account for future columns that might be requested, such as “Bill Voted On Date” or “Co-Sponsors”?

I would add these properties to the model I used to represent the Bill entity. If the "Co-Sponsors" are also a **person_id**, I could look it up on the same **Legislator** map that I used to lookup the main sponsor's name.

#### 3 - How would you change your solution if instead of receiving CSVs of data, you were given a list of legislators or bills that you should generate a CSV for?

Receiving this data as a List would eliminate the parsing of the CSV using the utils package I created. Other than that not much would change, I would convert the necessary lists to Maps.

#### 4 - How long did you spend working on the assignment?

I took about 4 and a half hours, including doing the writeup and the documentation here.
