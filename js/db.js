const { MongoClient, ServerApiVersion } = require('mongodb');

// Use your connection URI here, replacing `<Password>` with your actual password
const uri = "mongodb+srv://kononovse1:CentralizAtion2n.@gamifyingcyber.p076k.mongodb.net/?retryWrites=true&w=majority&appName=GamifyingCyber";

// Create a MongoClient object with the options (including serverApi version)
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Connected to MongoDB Atlas!");
    
    // Test connection with a simple command
    const result = await client.db("admin").command({ ping: 1 });
    console.log("Ping response:", result);

  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  } finally {
    // Ensure client is closed after operation
    await client.close();
  }
}

run().catch(console.dir);
