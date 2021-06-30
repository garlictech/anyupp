/*
 * This is a quick and dirty script for copying files in AWS S3 to other buckets.
 * This is written so it can work across AWS accounts.
 * You can hack in code to apply work or logic to each file.
 *
 * For each file, it downloads locally to a tmp file and then starts uploading as soon as possible
 * and deletes the file immediately when the upload is done.
 *
 * Best way to use: Spin up a micro in EC2, install node.js,
 *                  create a directory and install the dependencies with
 *                  npm install aws-sdk
 *                  npm install async
 *                  npm install node-uuid
 *                  then run with  node ./s3copy-across-aws-accounts.js.
 *
 * Dont Forget: 1. Make a folder named 'downloads' in the directory you will run from.
 *              2. Replace keys and bucket names in this file.
 *              3. Tweak any other code you want (simultaneous max uploads, downloads, etc)
 *
 * See also: AWS SDK:              http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/frames.html
 *           Async for Node.js:    https://github.com/caolan/async
 *           Blog post about this: http://www.everyhaironyourhead.com/copy-files-in-aws-s3-to-an-s3-bucket-in-another-aws-account-with-node-js/
 */

var AWS = require('aws-sdk');
var async = require('async');
var fs = require('fs');
var uuid = require('uuid');

var sourceS3Conf = new AWS.Config({
  accessKeyId: 'XXX', //replace this with the S3 Access Key for the source bucket
  secretAccessKey: 'XXX', //replace this with the S3 Secret Access Key for the source bucket
});
var sourceS3 = new AWS.S3(sourceS3Conf);

var destS3Conf = new AWS.Config({
  accessKeyId: 'XXX', //replace this with the S3 Access Key for the destination bucket
  secretAccessKey: 'XXX',
});
var destS3 = new AWS.S3(destS3Conf);

var q = async.queue(upload, 5); //create an upload task queue that allows 5 simultaneous uploads
const srcBucket = 'anyuppbackend115354-staging';
const dstBucket = 'anyuppbackendbucket132227-prod';

download(); //kick off the transfer

function download(marker) {
  //listparams are the options for listing the source bucket contents. See AWS SDK.
  var listparams = {
    Bucket: srcBucket, //replace this with the name of the source bucket
    EncodingType: 'url',
    MaxKeys: 100, //Request 100 keys at a time
    Delimiter: '::',
  };
  //We request 100 bucket entry keys at a time, until we get through all of them.
  //AWS returns the starting key for the next 100 as NextMarker
  if (marker) {
    listparams.Marker = marker;
  }
  sourceS3.listObjects(listparams, function (lerr, info) {
    if (lerr) {
      console.log(lerr, lerr.stack);
      return; // if there is a problem getting the list, its all over.
    }
    //process the list of 100 keys (max) from the bucket
    async.eachLimit(
      info.Contents,
      5,
      function iterator(item, cb) {
        // allow 5 simultaneous downloads
        //Add code here for processing the bucket entries. Tailor as needed.
        //For example, here we are skipping any entries that have a zero size.
        if (item.Size == 0) {
          cb();
          return;
        }
        var getparams = {
          Bucket: dstBucket,
          Key: item.Key,
        };
        sourceS3.getObject(getparams, function (gerr, s3obj) {
          //download the object from the bucket
          if (gerr) {
            //if there is problem just print to console and move on.
            console.log('Download issue with ' + item.Key);
            console.log(gerr);
            cb();
            return;
          }
          var uname = uuid.v4(); //using uuid as a unique name for the tmp file we save
          //save the file to disk temporarily in a folder called downloads
          //until we upload it to the target bucket.
          //you can apply any rules or filters on the files here.
          fs.writeFile(
            './downloads/' + uname,
            s3obj.Body,
            { encoding: null },
            function (fserr) {
              if (fserr) {
                //if there is problem just print to console and move on.
                cb(fserr);
                return;
              }
              //if everything went well downloading, add it to the upload queue.
              q.push({ filename: uname, s3key: item.Key });
              console.log('Added ' + item.Key + ' to queue');
              cb();
            },
          );
        });
      },
      function done(aerr) {
        if (aerr) {
          return console.log(aerr);
        }
        if (info.NextMarker) {
          //if there are more keys in the bucket, get the next 100
          process.nextTick(function () {
            download(info.NextMarker);
          });
        } else {
          console.log('Downloads Done! Please wait for uploads to finish.');
        }
      },
    );
  });
}

function upload(uitem, qcb) {
  //function to upload each item in the upload queue to the destination bucket
  var stream = fs.createReadStream('./downloads/' + uitem.filename);
  destS3.putObject(
    {
      Bucket: dstBucket,
      Key: uitem.s3key,
      Body: stream,
    },
    function (uerr, data) {
      if (uerr) {
        //if there is an upload problem just print to console and move on.
        qcb(uerr);
        return;
      }
      //if the upload was successful, delete the local tmp file
      fs.unlink('./downloads/' + uitem.filename, function (delerr) {
        if (delerr) {
          //if there was a problem with that just print to console and move on.
          qcb(delerr);
          return;
        }
        console.log('Moved ' + uitem.s3key);
        qcb();
      });
    },
  );
}
