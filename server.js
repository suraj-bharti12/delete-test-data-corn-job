// const { MongoClient } = require('mongodb');

// // MongoDB connection string
// const uri = 'mongodb+srv://shiva:ZxJf1KONMThYSpCU@cluster0.yuxls.mongodb.net/test';

// async function convertCreatedAtToDate() {
//     const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//     try {
//         await client.connect();
//         const database = client.db('webhooks-2');
//         const collection = database.collection('orders');

//         // Convert created_at to Date if it's stored as a string
//         const result = await collection.updateMany(
//             { created_at: { $type: "string" } },
//             [{ $set: { created_at: { $toDate: "$created_at" } } }]
//         );

//         console.log(`Converted ${result.modifiedCount} documents`);
//     } catch (error) {
//         console.error('An error occurred:', error);
//     } finally {
//         await client.close();
//     }
// }

// async function deleteOldData() {
//     const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//     try {
//         await client.connect();
//         console.log('Connected to MongoDB');

//         const database = client.db('webhooks-2');
//         const collection = database.collection('orders');

//         // Get today's and yesterday's dates at midnight UTC
//         const today = new Date();
//         today.setUTCHours(0, 0, 0, 0);

//         const yesterday = new Date(today);
//         yesterday.setUTCDate(today.getUTCDate() - 1);

//         const dayBeforeYesterday = new Date(yesterday);
//         dayBeforeYesterday.setUTCDate(yesterday.getUTCDate() - 1);

//         console.log(`Today: ${today.toISOString()}`);
//         console.log(`Yesterday: ${yesterday.toISOString()}`);
//         console.log(`Day Before Yesterday: ${dayBeforeYesterday.toISOString()}`);

//         // Log all documents to check their created_at values
//         const allDocs = await collection.find().toArray();
//         console.log("All documents in the collection:");
//         allDocs.forEach(doc => console.log(`_id: ${doc._id}, created_at: ${doc.created_at}`));

//         // Construct the query to delete documents older than the day before yesterday
//         const query = {
//             created_at: {
//                 $lt: dayBeforeYesterday
//             }
//         };

//         const documentsToDelete = await collection.find(query).toArray();
//         console.log("Documents to delete:");
//         documentsToDelete.forEach(doc => console.log(`_id: ${doc._id}, created_at: ${doc.created_at}`));

//         const result = await collection.deleteMany(query);

//         console.log(`Deleted ${result.deletedCount} documents`);
//     } catch (error) {
//         console.error('An error occurred:', error);
//     } finally {
//         await client.close();
//     }
// }

// // First convert the created_at field to Date type, then delete old data
// async function run() {
//     await convertCreatedAtToDate();
//     await deleteOldData();
// }

// run().catch(console.error);
///////////////////////////////////////////////////////////////////////////////////////////////////

const { MongoClient } = require('mongodb');
const cron = require('node-cron');
const express = require('express');

const app = express();
const port = 3000;  // Define the port you want to use


// MongoDB connection string
const uri = 'mongodb+srv://shiva:ZxJf1KONMThYSpCU@cluster0.yuxls.mongodb.net/test';

async function convertCreatedAtToDate() {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        const database = client.db('webhooks-2');
        const collection = database.collection('orders');

        // Convert created_at to Date if it's stored as a string
        const result = await collection.updateMany(
            { created_at: { $type: "string" } },
            [{ $set: { created_at: { $toDate: "$created_at" } } }]
        );

        console.log(`Converted ${result.modifiedCount} documents`);
    } catch (error) {
        console.error('An error occurred:', error);
    } finally {
        await client.close();
    }
}

async function deleteOldData() {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const database = client.db('webhooks-2');
        const collection = database.collection('orders');

        // Get today's and yesterday's dates at midnight UTC
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        const yesterday = new Date(today);
        yesterday.setUTCDate(today.getUTCDate() - 1);

        const dayBeforeYesterday = new Date(yesterday);
        dayBeforeYesterday.setUTCDate(yesterday.getUTCDate() - 1);

        console.log(`Today: ${today.toISOString()}`);
        console.log(`Yesterday: ${yesterday.toISOString()}`);
        console.log(`Day Before Yesterday: ${dayBeforeYesterday.toISOString()}`);

        // Log all documents to check their created_at values
        const allDocs = await collection.find().toArray();
        console.log("All documents in the collection:");
        allDocs.forEach(doc => console.log(`_id: ${doc._id}, created_at: ${doc.created_at}`));

        // Construct the query to delete documents older than the day before yesterday
        const query = {
            created_at: {
                $lt: dayBeforeYesterday
            }
        };

        const documentsToDelete = await collection.find(query).toArray();
        console.log("Documents to delete:");
        documentsToDelete.forEach(doc => console.log(`_id: ${doc._id}, created_at: ${doc.created_at}`));

        const result = await collection.deleteMany(query);

        console.log(`Deleted ${result.deletedCount} documents`);
    } catch (error) {
        console.error('An error occurred:', error);
    } finally {
        await client.close();
    }
}

// First convert the created_at field to Date type, then delete old data
async function run() {
    await convertCreatedAtToDate();
    await deleteOldData();
}

// Schedule the run function to execute every day at 2:05 PM
const task = cron.schedule('5 13 * * 1', () => {   
    console.log('Running scheduled task');
    run().catch(console.error);
}, {
    timezone: 'Asia/Kolkata'
});

task.start();

app.get('/', (req, res) => {
    res.send('Cron job is running!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});


