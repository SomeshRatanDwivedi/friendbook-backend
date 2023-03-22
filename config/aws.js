const env = require('./environment')
const AWS = require('aws-sdk');

const bucketName = env.AWS_BUCKET_NAME
const region = env.AWS_BUCKET_REGION
const accessKeyId = env.AWS_ACCESS_KEY
const secretAccessKey = env.AWS_SECRET_KEY


AWS.config.update({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    signatureVersion: 'v4',
})


const s3 = new AWS.S3({ params: { Bucket: bucketName } });

const awsUpload = (file) => {

    return new Promise((resolve, reject) => {
    

        const { originalname, buffer } = file;

        const currentTime = new Date().getTime();
        const keyName = `${originalname}_${currentTime}`

        const data = {
            Key: keyName ,
            Body: buffer,
            ContentType: file.mimetype,
            ACL: 'public-read'
        }

        s3.upload(data, (err, data) => {
            if (err) {
                console.log("err in s3", err);
                reject(err);
            }
          
            resolve(keyName)
        })
    })
}




module.exports = {awsUpload, s3};