const { checkConnection, initIndex } = require('../utils/elasticsearch');

const runTest = async () => {
    console.log('Testing Elasticsearch connection...');
    const connected = await checkConnection();
    if (connected) {
        console.log('Success! Connection established.');
        await initIndex();
    } else {
        console.log('Failed to connect to Elasticsearch. Make sure it is running on http://localhost:9200');
    }
    process.exit(0);
};

runTest();
