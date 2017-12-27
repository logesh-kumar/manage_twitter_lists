require('dotenv').config();
const Twit = require('twit')
const config = require('./config')
const fs = require('fs')
const csv = require('fast-csv')
const _ = require('lodash')
const stream = fs.createReadStream("users.csv")
let users = []
const csvStream = csv()
  .on("data", function (data) {
    users.push(data[0])
  })
  .on("end", function () {
    const usersChunks = _.chunk(users, 50);

    usersChunks.forEach(userChunk => {
      let userIds = userChunk.join(',')
      userIds = userIds.replace('@', '')
      addMembersToList(userIds)
      //deleteMembersToList(userIds)
    })

    console.log("done");
  });

stream.pipe(csvStream);

const T = new Twit({
  consumer_key: config.consumerKey,
  consumer_secret: config.consumerSecret,
  access_token: config.accessToken,
  access_token_secret: config.accessTokenSecret,
  timeout_ms: 60 * 1000,  // optional HTTP request timeout to apply to all requests.
});

function createList() {
  T.post("lists/create", { name: "TestList", mode: "public", description: "For life" }, function (err, data, response) {
    console.log(data)
  })
}

function getAllLists() {
  T.get("lists/list", function (err, data, response) {
    console.log(data)
  })
}

function addSingleMemberToList(userId) {
  T.post("lists/members/create", { list_id: "946016290971443201", slug: "testlist", user_id: userId }, function (err, data, response) {
    console.log(err)
  })
}

function addMembersToList(userIds) {
  T.post("lists/members/create_all", { list_id: "946016290971443201", slug: "testlist", user_id: userIds }, function (err, data, response) {
    console.log(data)
  })
}

function deleteMembersToList(userIds) {
  T.post("lists/members/destroy_all", { list_id: "946016290971443201", slug: "testlist", user_id: userIds }, function (err, data, response) {
    console.log(data)
  })
}

getAllLists()

/* T.post('statuses/update', { status: 'hello world!' }, function(err, data, response) {
  console.log(data)
})
 */
