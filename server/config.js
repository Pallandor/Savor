var config = {
    api: {
        yelp: {
            consumer_key: 'u2gAoehSEq2Uu3yGMe0MSg',
            consumer_secret: 'D55dVkQn_oB85rHKBImgnxTiJnw',
            token: '7hktzZrMfygsuRTJP2WkoiOAmB05X_mP',
            token_secret: 'v24LIluEKF29MQKSqF1JXhT-7is'
        },

        // ADDED R.S
        uber: {
          client_id: 'cNjHPzCrLKp-e_-6JmJO1euwEAKmrRLG',
          client_secret: 'GtZk938iQePE-yTSeVd68QV5H0VAFDfgBvBLQ9xH',
          server_token: 'X2n1UZirsXcwQqJEupph4Xm3LodTJl7LXU4ajDFZ',
          redirect_uri: 'http://localhost:4000/api/uberauthorize',  // this may need to be 
          name: 'SavorApp',
          language: 'en_US', // optional, defaults to en_US
          sandbox: true // optional, defaults to false
        }
    }
}

module.exports = config; 
